<?php
require_once __DIR__ . '/api/config.php';

function testLandingUrl($url, $ref) {
    $tokenResult = getZohoAccessToken();
    $token = $tokenResult['token'];

    $zohoRecord = [
        'Business_Name' => 'Synthetic Test Corp',
        'Name' => 'Gaurav Pal',
        'Contact_Email' => 'gaurav.test@company.com',
        'Contact_Number' => '+91 98765 43210',
        'Submission_Ref' => $ref,
        'Brand' => 'Insta utility',
        'Service_Interest' => 'Renewable Energy Advisory',
        'Landing_Page' => $url
    ];

    $zohoPayload = json_encode(['data' => [$zohoRecord]]);

    $ch = curl_init(ZOHO_LEAD_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $zohoPayload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Zoho-oauthtoken ' . $token,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo "Testing URL: $url | Ref: $ref\n";
    echo "HTTP Code: $code\n";
    echo "Response: $res\n\n";
}

testLandingUrl('http://localhost:5055/index.html', 'IU-2026-1008-LOCALHOST-TEST');
testLandingUrl('https://www.instautility.com/index.html', 'IU-2026-1008-PRODUCTION-TEST');
