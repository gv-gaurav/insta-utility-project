<?php
/**
 * Minimal Non-Sensitive Health Endpoint (WEB-109 Hardened Spec)
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

echo json_encode([
    'status' => 'PASS',
    'service' => 'insta-crm-php-backend',
    'live_write_enabled' => LIVE_WRITE_ENABLED,
    'timestamp' => date('c')
]);
