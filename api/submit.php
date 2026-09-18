<?php
/**
 * Insta CRM Lead Submission PHP Backend Endpoint
 * Receives form inputs from frontend, validates 6 verified fields,
 * and securely forwards to Zoho CRM v8 Website_Leads API.
 */

// Handle CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'FAIL_CLOSED',
        'reason_code' => 'METHOD_NOT_ALLOWED',
        'message' => 'Only POST requests are allowed.'
    ]);
    exit;
}

require_once __DIR__ . '/config.php';

// Helper function to get or refresh Zoho OAuth Access Token
function getZohoAccessToken() {
    $now = time();
    
    // Check cached token
    if (file_exists(TOKEN_CACHE_FILE)) {
        $cacheData = json_decode(file_get_contents(TOKEN_CACHE_FILE), true);
        if ($cacheData && isset($cacheData['access_token']) && isset($cacheData['expires_at'])) {
            if ($cacheData['expires_at'] > ($now + 60)) {
                return ['token' => $cacheData['access_token'], 'error' => null];
            }
        }
    }

    // Request new token from Zoho OAuth endpoint
    $postFields = http_build_query([
        'grant_type' => ZOHO_GRANT_TYPE,
        'client_id' => ZOHO_CLIENT_ID,
        'client_secret' => ZOHO_CLIENT_SECRET,
        'scope' => ZOHO_SCOPE,
        'soid' => ZOHO_SOID
    ]);

    $ch = curl_init(ZOHO_TOKEN_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        return ['token' => null, 'error' => "cURL Error fetching token: " . $curlErr];
    }

    $data = json_decode($response, true);
    if (isset($data['access_token'])) {
        $accessToken = $data['access_token'];
        $expiresIn = isset($data['expires_in']) ? (int)$data['expires_in'] : 3600;

        // Cache the token locally
        $cachePayload = [
            'access_token' => $accessToken,
            'expires_at' => $now + $expiresIn
        ];
        @file_put_contents(TOKEN_CACHE_FILE, json_encode($cachePayload));

        return ['token' => $accessToken, 'error' => null];
    }

    $errMsg = isset($data['error']) ? $data['error'] : 'Unknown OAuth token error';
    return ['token' => null, 'error' => $errMsg];
}

// Read raw JSON body input
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?: [];

// Extract frontend fields with fallbacks
$accountName = trim($body['account_name'] ?? $body['Business_Name'] ?? '');
$contactName = trim($body['contact_name'] ?? $body['Name'] ?? '');
$contactEmail = trim($body['contact_email'] ?? $body['Contact_Email'] ?? '');
$contactPhone = trim($body['contact_phone'] ?? $body['Contact_Number'] ?? '');
$submissionRef = trim($body['submission_ref'] ?? $body['Submission_Ref'] ?? ('IU-2026-' . time()));
$brand = trim($body['brand'] ?? $body['Brand'] ?? 'Insta utility');

// Validation: Ensure mandatory 6-contract fields exist
$missingFields = [];
if (empty($accountName)) $missingFields[] = 'account_name';
if (empty($contactName)) $missingFields[] = 'contact_name';
if (empty($contactEmail)) $missingFields[] = 'contact_email';
if (empty($contactPhone)) $missingFields[] = 'contact_phone';

if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'FAIL_CLOSED',
        'reason_code' => 'MISSING_MANDATORY_FIELDS',
        'missing_fields' => $missingFields
    ]);
    exit;
}

// Build 6-Field Zoho Record Payload
$zohoRecord = [
    'Business_Name' => $accountName,
    'Name' => $contactName,
    'Contact_Email' => $contactEmail,
    'Contact_Number' => $contactPhone,
    'Submission_Ref' => $submissionRef,
    'Brand' => $brand
];

// If LIVE_WRITE_ENABLED is false (Shadow / Dry-run Mode), return controlled success
if (!LIVE_WRITE_ENABLED) {
    http_response_code(200);
    echo json_encode([
        'status' => 'FAIL_CLOSED',
        'mode' => 'SHADOW_ONLY',
        'message' => 'PHP Backend Integration PASS. LIVE_WRITE_ENABLED=false (0 CRM writes).',
        'submission_ref' => $submissionRef,
        'mapped_payload' => $zohoRecord
    ]);
    exit;
}

// Retrieve Zoho Access Token
$tokenResult = getZohoAccessToken();
if (!$tokenResult['token']) {
    http_response_code(500);
    echo json_encode([
        'status' => 'FAIL_CLOSED',
        'reason_code' => 'OAUTH_AUTHENTICATION_FAILURE',
        'error_detail' => $tokenResult['error']
    ]);
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
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$zohoResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    http_response_code(500);
    echo json_encode([
        'status' => 'FAIL_CLOSED',
        'reason_code' => 'HTTP_CONNECTION_ERROR',
        'error_detail' => $curlErr
    ]);
    exit;
}

$resData = json_decode($zohoResponse, true);

if ($httpCode === 200 || $httpCode === 201) {
    http_response_code(200);
    echo json_encode([
        'status' => 'SUCCESS',
        'message' => 'Lead record successfully created in Zoho CRM via PHP backend.',
        'submission_ref' => $submissionRef,
        'zoho_response' => $resData
    ]);
} else {
    http_response_code($httpCode ?: 500);
    echo json_encode([
        'status' => 'FAIL_CLOSED',
        'reason_code' => 'ZOHO_API_ERROR',
        'http_code' => $httpCode,
        'zoho_error' => $resData
    ]);
}
