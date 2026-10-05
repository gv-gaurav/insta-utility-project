<?php
/**
 * Minimal Non-Sensitive Health Endpoint (WEB-112 Hardened Spec)
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin) {
    if (in_array($origin, ALLOWED_ORIGINS, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Vary: Origin');
    } else {
        http_response_code(403);
        echo json_encode([
            'status' => 'FAIL_CLOSED',
            'error_code' => 'CORS_FORBIDDEN',
            'message' => 'Origin not authorised by CORS policy.'
        ]);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

http_response_code(200);
echo json_encode([
    'status' => 'PASS',
    'service' => 'insta-crm-php-backend',
    'live_write_enabled' => LIVE_WRITE_ENABLED,
    'timestamp' => date('c')
]);

