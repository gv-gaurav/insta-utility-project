<?php
/**
 * Insta CRM Integration Configuration (WEB-109 Hardened Spec)
 * Aligned to Aman Khatana CRM-103 Production Contract
 */

// Safety Switch: Default LIVE_WRITE_ENABLED to false (Shadow / Dry-Run Mode)
$liveWriteEnv = getenv('LIVE_WRITE_ENABLED');
define('LIVE_WRITE_ENABLED', filter_var($liveWriteEnv, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false);

// Authorised CORS Origins Allow-List (CRM-103 Rule 1: No wildcard *)
$envOrigins = getenv('ALLOWED_ORIGINS') ?: getenv('CORS_ALLOWED_ORIGINS');
$defaultOrigins = [
    'https://gv-gaurav.github.io',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:5055'
];
if ($envOrigins) {
    $parsedOrigins = array_map('trim', explode(',', $envOrigins));
    define('ALLOWED_ORIGINS', array_values(array_filter($parsedOrigins)));
} else {
    define('ALLOWED_ORIGINS', $defaultOrigins);
}

// Zoho OAuth & API Credentials (Loaded strictly from Server Environment)
define('ZOHO_CLIENT_ID', getenv('ZOHO_CLIENT_ID') ?: '');
define('ZOHO_CLIENT_SECRET', getenv('ZOHO_CLIENT_SECRET') ?: '');
define('ZOHO_GRANT_TYPE', getenv('ZOHO_GRANT_TYPE') ?: 'client_credentials');
define('ZOHO_SCOPE', getenv('ZOHO_SCOPE') ?: 'ZohoCRM.modules.ALL');
define('ZOHO_SOID', getenv('ZOHO_SOID') ?: 'ZohoCRM.60046335348');

// Zoho Endpoints
define('ZOHO_TOKEN_URL', getenv('ZOHO_TOKEN_URL') ?: 'https://accounts.zoho.in/oauth/v2/token');
define('ZOHO_LEAD_URL', getenv('ZOHO_LEAD_URL') ?: 'https://www.zohoapis.in/crm/v8/Website_Leads');

// Local Data Store Paths (Secrets and tokens kept out of web root if possible, cached locally)
define('TOKEN_CACHE_FILE', __DIR__ . '/.zoho_token_cache.json');
define('PROCESSED_SUBMISSIONS_FILE', __DIR__ . '/.processed_submissions.json');
define('SECURITY_LOG_FILE', __DIR__ . '/.submission_audit.log');
