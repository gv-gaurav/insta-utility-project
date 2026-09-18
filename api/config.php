<?php
/**
 * Insta CRM Integration Configuration
 * Store Zoho API credentials safely on the server
 */

// Safety Switch: Set to true for live Zoho writes, false for shadow/dry-run mode
define('LIVE_WRITE_ENABLED', false);

// Zoho OAuth & API Credentials (Loaded securely from Server Environment)
define('ZOHO_CLIENT_ID', getenv('ZOHO_CLIENT_ID') ?: '');
define('ZOHO_CLIENT_SECRET', getenv('ZOHO_CLIENT_SECRET') ?: ''); // Kept empty in git repository for security
define('ZOHO_GRANT_TYPE', getenv('ZOHO_GRANT_TYPE') ?: 'client_credentials');
define('ZOHO_SCOPE', getenv('ZOHO_SCOPE') ?: 'ZohoCRM.modules.ALL');
define('ZOHO_SOID', getenv('ZOHO_SOID') ?: 'ZohoCRM.60046335348');

// Zoho Endpoints
define('ZOHO_TOKEN_URL', 'https://accounts.zoho.in/oauth/v2/token');
define('ZOHO_LEAD_URL', 'https://www.zohoapis.in/crm/v8/Website_Leads');

// Token Cache File Path
define('TOKEN_CACHE_FILE', __DIR__ . '/zoho_token_cache.json');
