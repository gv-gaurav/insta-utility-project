<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

echo json_encode([
    'status' => 'PASS',
    'service' => 'insta-crm-php-backend',
    'live_write_enabled' => LIVE_WRITE_ENABLED,
    'target_endpoint' => ZOHO_LEAD_URL,
    'timestamp' => date('c')
]);
