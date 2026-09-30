# INSTA UTILITY WEB-109 DEPLOYMENT & ROLLBACK GUIDE

**Task:** WEB-109 — Hardened PHP Backend Deploy Package  
**Owner:** Gaurav Pal (Web Construction Lead)  
**Date:** 30 September 2026  
**Status:** READY FOR MANAGEMENT APPROVAL & DEPLOYMENT  

---

## 🎯 1. Overview & Security Architecture

The WEB-109 backend package provides a production-hardened PHP transport layer for Insta Utility lead capture. Built strictly to Aman Khatana's **CRM-103 Final Specification**, it eliminates security vulnerabilities and guarantees transport truthfulness.

### Security & Hardening Features Implemented:
1. **No Wildcard CORS:** Dynamic origin validation against `ALLOWED_ORIGINS` (Default: `https://gv-gaurav.github.io`). Requests from unauthorized origins are rejected with HTTP 403 Forbidden.
2. **Zero Credentials in Git:** Zoho OAuth secrets (`ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`) are read strictly from server environment variables via `getenv()`.
3. **Default Safety Switch (`LIVE_WRITE_ENABLED=false`):** Hardened dry-run mode returns `STAGING ONLY - NOT WRITTEN TO CRM` without writing to Zoho CRM until management authorizes live write.
4. **Strict Field Contract & Validation:** Mandatory validation for `account_name`, `contact_name`, `contact_email` (valid email format), `contact_phone`, `submission_ref`, and `service_interest` (must be in approved allow-list). Unapproved fields are stripped; `Brand` is forced to `Insta utility`.
5. **Idempotency & Duplicate Replay Protection:** `Submission_Ref` is tracked in a local data store (`.processed_submissions.json`). Duplicate submissions return HTTP 409 `DUPLICATE` without creating or updating records.
6. **Sanitized Browser Responses:** Returns clean status codes (`201 SUCCESS`, `409 DUPLICATE`, `422 FAIL_CLOSED`, `500 ERROR`). OAuth tokens, client secrets, and raw Zoho API payloads are never exposed to the client.
7. **Privacy-Minimised Logging:** Audit logs record timestamp, `Submission_Ref`, HTTP code, state, and real CRM Record ID. No PII (names, emails, phones) or secrets are logged.

---

## 📋 2. Required Server Environment Variables

Configure the following environment variables on the PHP host (e.g. Render, Railway, cPanel, or Linux server):

| Variable Name | Required Value / Description | Example |
| :--- | :--- | :--- |
| `LIVE_WRITE_ENABLED` | Set to `false` initially; `true` only for synthetic test / live write | `false` |
| `ALLOWED_ORIGINS` | Comma-separated list of approved HTTPS origins | `https://gv-gaurav.github.io` |
| `ZOHO_CLIENT_ID` | Production Zoho CRM OAuth Client ID | *Set in host secrets* |
| `ZOHO_CLIENT_SECRET` | Production Zoho CRM OAuth Client Secret | *Set in host secrets* |
| `ZOHO_GRANT_TYPE` | OAuth grant type | `client_credentials` |
| `ZOHO_SCOPE` | OAuth scope | `ZohoCRM.modules.ALL` |
| `ZOHO_SOID` | Zoho Organization ID | `ZohoCRM.60046335348` |

---

## 🚀 3. Step-by-Step Deployment Steps

1. **Host Provisioning:** Ensure the target server supports PHP 7.4+ with `curl` and `json` extensions enabled.
2. **Deploy Package Upload:** Upload the contents of the `api/` directory (`config.php`, `submit.php`, `health.php`, `.htaccess`) to the server `api/` web path.
3. **Environment Setup:** Set the required environment variables listed in Section 2 in the host environment settings.
4. **File Permissions:** Ensure the `api/` directory has write permissions for `.zoho_token_cache.json`, `.processed_submissions.json`, and `.submission_audit.log`.
5. **Health Verification:** Test the endpoint by querying `GET https://<server-domain>/api/health.php`. Expect:
   ```json
   {
     "status": "PASS",
     "service": "insta-crm-php-backend",
     "live_write_enabled": false,
     "timestamp": "..."
   }
   ```
6. **Frontend Integration:** Update `window.STAGING_API_BASE_URL` in `index.html` or `app.js` to point to `https://<server-domain>`.

---

## 🔄 4. Rollback Procedure

If any issue occurs during or after deployment:

1. **Immediate Disconnect:** Unset `window.STAGING_API_BASE_URL` on the frontend (`app.js` / `index.html`). The frontend will immediately fall back to GitHub Pages Staging Shadow Mode (`STAGING ONLY - NOT WRITTEN TO CRM`).
2. **Server Switch Off:** Set `LIVE_WRITE_ENABLED=false` in the server environment settings and restart/redeploy the server instance.
3. **Revert Git Commits:** If code changes need to be reverted, run:
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## 🧪 5. Management Gate Approval Request

Management approval is requested to deploy this package to the Insta Utility PHP-capable staging server and authorize exactly **ONE synthetic live-write test (CRM-102)**.
