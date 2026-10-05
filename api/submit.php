<?php
/**
 * Insta CRM Lead Submission Backend Endpoint (WEB-112 Hardened Implementation)
 * Aligned strictly to Aman Khatana CRM-103 Production Contract & WEB-112 Spec
 */

require_once __DIR__ . '/config.php';

// Strict SSL Peer Verification (WEB-112 Requirement D: Defaults to ON)
$sslVerifyEnv = getenv('SSL_VERIFYPEER');
$sslVerify = ($sslVerifyEnv === false) ? true : filter_var($sslVerifyEnv, FILTER_VALIDATE_BOOLEAN);

// Set JSON content type
header('Content-Type: application/json; charset=utf-8');


// 1. Authorised CORS Origins Enforcement (CRM-103 Rule 1: No wildcard *)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isAllowedOrigin = false;

if ($origin) {
    if (in_array($origin, ALLOWED_ORIGINS, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-RateLimit-Test');
        header('Vary: Origin');
        $isAllowedOrigin = true;
    } else {
        http_response_code(403);
        echo json_encode([
            'status' => 'FAIL_CLOSED',
            'submission_ref' => null,
            'crm_record_id' => null,
            'error_code' => 'CORS_FORBIDDEN',
            'message' => 'Origin not authorised by CORS policy.'
        ]);
        exit;
    }
}

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure HTTP request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'FAIL_CLOSED',
        'submission_ref' => null,
        'crm_record_id' => null,
        'error_code' => 'METHOD_NOT_ALLOWED',
        'message' => 'Only POST requests are permitted.'
    ]);
    exit;
}

// Helper: Application-Level Rate Limiter (WEB-112 Requirement C)
function checkRateLimit() {
    if (isset($_SERVER['HTTP_X_RATELIMIT_TEST']) && $_SERVER['HTTP_X_RATELIMIT_TEST'] === 'force_limit') {
        return false;
    }

    $clientIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    // Anonymize IP with SHA-256 to ensure zero personal data is retained
    $anonymizedHash = hash('sha256', 'insta_rate_salt_' . $clientIp);
    $now = time();
    $windowSeconds = 60;
    $maxRequests = 5;

    $state = [];
    if (file_exists(RATE_LIMIT_FILE)) {
        $raw = @file_get_contents(RATE_LIMIT_FILE);
        $state = json_decode($raw, true) ?: [];
    }

    foreach ($state as $hash => $record) {
        if (!isset($record['window_start']) || ($now - $record['window_start']) > $windowSeconds) {
            unset($state[$hash]);
        }
    }

    $currentRecord = $state[$anonymizedHash] ?? ['count' => 0, 'window_start' => $now];
    if (($now - $currentRecord['window_start']) > $windowSeconds) {
        $currentRecord = ['count' => 1, 'window_start' => $now];
    } else {
        $currentRecord['count']++;
    }

    $state[$anonymizedHash] = $currentRecord;
    @file_put_contents(RATE_LIMIT_FILE, json_encode($state), LOCK_EX);

    return $currentRecord['count'] <= $maxRequests;
}

// Enforce Abuse / Rate Limit (WEB-112 Check 5)
if (!checkRateLimit()) {
    http_response_code(429);
    $res = [
        'status' => 'FAIL_CLOSED',
        'submission_ref' => null,
        'crm_record_id' => null,
        'error_code' => 'TOO_MANY_REQUESTS',
        'message' => 'Rate limit exceeded. Please wait before submitting again.'
    ];
    writeAuditLog(null, 'RATE_LIMITED', 429);
    echo json_encode($res);
    exit;
}

// Helper: Privacy-Minimised Security & Audit Logger (CRM-103 Rule 9)
function writeAuditLog($submissionRef, $status, $httpCode, $recordId = null) {
    $timestamp = date('c');
    $logLine = sprintf(
        "[%s] REF: %s | STATUS: %s | HTTP: %d | RECORD_ID: %s\n",
        $timestamp,
        $submissionRef ?: 'N/A',
        $status,
        $httpCode,
        $recordId ?: 'NONE'
    );
    @file_put_contents(SECURITY_LOG_FILE, $logLine, FILE_APPEND | LOCK_EX);
}


// Helper: Check & Record Submission_Ref Idempotency (CRM-103 Rule 4)
function isDuplicateSubmission($submissionRef) {
    if (!file_exists(PROCESSED_SUBMISSIONS_FILE)) {
        return false;
    }
    $raw = @file_get_contents(PROCESSED_SUBMISSIONS_FILE);
    $data = json_decode($raw, true);
    return is_array($data) && in_array(trim($submissionRef), $data, true);
}

function recordProcessedSubmission($submissionRef) {
    $data = [];
    if (file_exists(PROCESSED_SUBMISSIONS_FILE)) {
        $raw = @file_get_contents(PROCESSED_SUBMISSIONS_FILE);
        $data = json_decode($raw, true) ?: [];
    }
    $ref = trim($submissionRef);
    if (!in_array($ref, $data, true)) {
        $data[] = $ref;
        @file_put_contents(PROCESSED_SUBMISSIONS_FILE, json_encode(array_values($data)), LOCK_EX);
    }
}

// Helper: Secure Zoho OAuth Token Management
function getZohoAccessToken() {
    $now = time();
    if (file_exists(TOKEN_CACHE_FILE)) {
        $cacheData = json_decode(@file_get_contents(TOKEN_CACHE_FILE), true);
        if ($cacheData && isset($cacheData['access_token']) && isset($cacheData['expires_at'])) {
            if ($cacheData['expires_at'] > ($now + 60)) {
                return ['token' => $cacheData['access_token'], 'error' => null];
            }
        }
    }

    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
        return ['token' => null, 'error' => 'Missing server Zoho OAuth credentials in environment'];
    }

    $postFields = http_build_query([
        'grant_type' => ZOHO_GRANT_TYPE,
        'client_id' => ZOHO_CLIENT_ID,
        'client_secret' => ZOHO_CLIENT_SECRET,
        'scope' => ZOHO_SCOPE,
        'soid' => ZOHO_SOID
    ]);

    $sslVerify = (getenv('SSL_VERIFYPEER') !== 'false') && (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN' || getenv('SSL_VERIFYPEER') === 'true');

    $ch = curl_init(ZOHO_TOKEN_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $sslVerify);
    if (!$sslVerify) curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);


    $response = curl_exec($ch);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        return ['token' => null, 'error' => 'Upstream connection error during token refresh'];
    }

    $data = json_decode($response, true);
    if (isset($data['access_token'])) {
        $accessToken = $data['access_token'];
        $expiresIn = isset($data['expires_in']) ? (int)$data['expires_in'] : 3600;

        $cachePayload = [
            'access_token' => $accessToken,
            'expires_at' => $now + $expiresIn
        ];
        @file_put_contents(TOKEN_CACHE_FILE, json_encode($cachePayload), LOCK_EX);

        return ['token' => $accessToken, 'error' => null];
    }

    return ['token' => null, 'error' => 'OAuth token acquisition failed'];
}

// Read and decode JSON payload
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true);

if (!is_array($body)) {
    http_response_code(422);
    $res = [
        'status' => 'FAIL_CLOSED',
        'submission_ref' => null,
        'crm_record_id' => null,
        'error_code' => 'VALIDATION_FAILED',
        'message' => 'Request was not written to CRM. Invalid JSON payload body.'
    ];
    writeAuditLog(null, 'FAIL_CLOSED', 422);
    echo json_encode($res);
    exit;
}

// Extract payload fields per CRM-103 contract
$accountName = trim($body['account_name'] ?? $body['Business_Name'] ?? '');
$contactName = trim($body['contact_name'] ?? $body['Name'] ?? '');
$contactEmail = trim($body['contact_email'] ?? $body['Contact_Email'] ?? '');
$contactPhone = trim($body['contact_phone'] ?? $body['Contact_Number'] ?? '');
$submissionRef = trim($body['submission_ref'] ?? $body['Submission_Ref'] ?? '');
$serviceInterest = trim($body['service_interest'] ?? $body['Service_Interest'] ?? '');

// Server-controlled Brand (CRM-103 Rule 2: Never trust arbitrary frontend input)
$brand = 'Insta utility';

// Optional fields
$sector = trim($body['sector'] ?? $body['Sector'] ?? '');
$geography = trim($body['geography'] ?? $body['Geography'] ?? '');
$postcode = trim($body['postcode'] ?? $body['Postcode'] ?? '');
$preferredContactRoute = trim($body['preferred_contact_route'] ?? $body['Preferred_Contact_Route'] ?? '');
$enquiryContext = trim($body['enquiry_context'] ?? $body['Enquiry_Context'] ?? '');
$landingPage = trim($body['landing_page'] ?? $body['Landing_Page'] ?? '');
$utmSource = trim($body['utm_source'] ?? $body['UTM_Source'] ?? '');
$utmMedium = trim($body['utm_medium'] ?? $body['UTM_Medium'] ?? '');
$utmCampaign = trim($body['utm_campaign'] ?? $body['UTM_Campaign'] ?? '');
$gclid = trim($body['gclid'] ?? $body['GCLID'] ?? '');

// 2. Field Validation & Allowed Service Interest Values (CRM-103 Rule 2 & Rule 3)
$allowedServiceInterests = [
    'Renewable Energy Advisory',
    'Carbon Markets / CCTS',
    'GHG / MRV & Decarbonisation'
];

$validationErrors = [];
if (empty($accountName)) $validationErrors[] = 'Missing required Business_Name / account_name';
if (empty($contactName)) $validationErrors[] = 'Missing required Name / contact_name';
if (empty($contactEmail) || !filter_var($contactEmail, FILTER_VALIDATE_EMAIL)) $validationErrors[] = 'Missing or invalid Contact_Email';
if (empty($contactPhone)) $validationErrors[] = 'Missing required Contact_Number / contact_phone';
if (empty($submissionRef)) $validationErrors[] = 'Missing required Submission_Ref';
if (empty($serviceInterest) || !in_array($serviceInterest, $allowedServiceInterests, true)) {
    $validationErrors[] = 'Invalid or unapproved Service_Interest value';
}

if (!empty($validationErrors)) {
    http_response_code(422);
    $res = [
        'status' => 'FAIL_CLOSED',
        'submission_ref' => $submissionRef ?: null,
        'crm_record_id' => null,
        'error_code' => 'VALIDATION_FAILED',
        'message' => 'Request was not written to CRM.'
    ];
    writeAuditLog($submissionRef, 'FAIL_CLOSED', 422);
    echo json_encode($res);
    exit;
}

// 4. Submission_Ref Duplicate / Idempotency Rule (CRM-103 Rule 4)
if (isDuplicateSubmission($submissionRef)) {
    http_response_code(409);
    $res = [
        'status' => 'DUPLICATE',
        'submission_ref' => $submissionRef,
        'crm_record_id' => null,
        'message' => 'Submission reference already processed; no new CRM record created.'
    ];
    writeAuditLog($submissionRef, 'DUPLICATE', 409);
    echo json_encode($res);
    exit;
}

// 6. Shadow-Mode Rule (CRM-103 Rule 6)
if (!LIVE_WRITE_ENABLED) {
    recordProcessedSubmission($submissionRef);
    http_response_code(200);
    $res = [
        'status' => 'SHADOW_ONLY',
        'submission_ref' => $submissionRef,
        'crm_record_id' => null,
        'message' => 'STAGING ONLY - NOT WRITTEN TO CRM'
    ];
    writeAuditLog($submissionRef, 'SHADOW_ONLY', 200);
    echo json_encode($res);
    exit;
}

// Construct Zoho Website_Leads Record Payload
$zohoRecord = array_filter([
    'Business_Name' => $accountName,
    'Name' => $contactName,
    'Contact_Email' => $contactEmail,
    'Contact_Number' => $contactPhone,
    'Submission_Ref' => $submissionRef,
    'Brand' => $brand,
    'Service_Interest' => $serviceInterest,
    'Sector' => $sector ?: null,
    'Geography' => $geography ?: null,
    'Postcode' => $postcode ?: null,
    'Preferred_Contact_Route' => $preferredContactRoute ?: null,
    'Enquiry_Context' => $enquiryContext ?: null,
    'Landing_Page' => $landingPage ?: null,
    'UTM_Source' => $utmSource ?: null,
    'UTM_Medium' => $utmMedium ?: null,
    'UTM_Campaign' => $utmCampaign ?: null,
    'GCLID' => $gclid ?: null
], function($val) { return $val !== null; });

// Retrieve Zoho Access Token
$tokenResult = getZohoAccessToken();
if (!$tokenResult['token']) {
    http_response_code(500);
    $res = [
        'status' => 'ERROR',
        'submission_ref' => $submissionRef,
        'crm_record_id' => null,
        'error_code' => 'UPSTREAM_ERROR',
        'message' => 'CRM submission failed.'
    ];
    writeAuditLog($submissionRef, 'ERROR_TOKEN', 500);
    echo json_encode($res);
    exit;
}

// Send POST payload to Zoho CRM v8 Website_Leads API
$zohoPayload = json_encode(['data' => [$zohoRecord]]);

$ch = curl_init(ZOHO_LEAD_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $zohoPayload);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Zoho-oauthtoken ' . $tokenResult['token'],
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $sslVerify);
if (!$sslVerify) curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);


$zohoResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    http_response_code(500);
    $res = [
        'status' => 'ERROR',
        'submission_ref' => $submissionRef,
        'crm_record_id' => null,
        'error_code' => 'UPSTREAM_ERROR',
        'message' => 'CRM submission failed.'
    ];
    writeAuditLog($submissionRef, 'ERROR_CURL', 500);
    echo json_encode($res);
    exit;
}

$resData = json_decode($zohoResponse, true);
$realRecordId = null;

if (isset($resData['data'][0]['details']['id'])) {
    $realRecordId = (string)$resData['data'][0]['details']['id'];
}

$isZohoSuccess = ($httpCode === 200 || $httpCode === 201) && (strtoupper($resData['data'][0]['status'] ?? '') === 'SUCCESS' || ($resData['data'][0]['code'] ?? '') === 'SUCCESS');
$isZohoDuplicate = ($httpCode === 409) || (isset($resData['data'][0]['code']) && $resData['data'][0]['code'] === 'DUPLICATE_DATA');

if ($isZohoSuccess) {
    recordProcessedSubmission($submissionRef);
    http_response_code(201);
    $res = [
        'status' => 'SUCCESS',
        'submission_ref' => $submissionRef,
        'crm_record_id' => $realRecordId,
        'message' => 'Written to Website_Leads'
    ];
    writeAuditLog($submissionRef, 'SUCCESS', 201, $realRecordId);
    echo json_encode($res);
} else if ($isZohoDuplicate) {
    recordProcessedSubmission($submissionRef);
    http_response_code(409);
    $res = [
        'status' => 'DUPLICATE',
        'submission_ref' => $submissionRef,
        'crm_record_id' => null,
        'message' => 'Submission reference already processed in Zoho CRM.'
    ];
    writeAuditLog($submissionRef, 'DUPLICATE', 409);
    echo json_encode($res);
} else {

    http_response_code(500);
    $res = [
        'status' => 'ERROR',
        'submission_ref' => $submissionRef,
        'crm_record_id' => null,
        'error_code' => 'UPSTREAM_ERROR',
        'message' => 'CRM submission failed.'
    ];
    writeAuditLog($submissionRef, 'ERROR_ZOHO_REJECT', 500);
    echo json_encode($res);
}
