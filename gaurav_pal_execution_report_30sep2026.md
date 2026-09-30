# EXECUTION REPORT — INSTA UTILITY WEB-105, WEB-108 & WEB-109 IMPLEMENTATION

**Owner:** Gaurav Pal (Web Construction Lead)  
**Date:** 30 September 2026  
**Target Repository:** `https://github.com/gv-gaurav/insta-utility-project.git`  
**Branch:** `main`  
**Latest Commit:** `READY_TO_PUSH`  
**Overall Task Status:** ALL GAURAV TASKS COMPLETE (`PASS` for WEB-105, WEB-108 & WEB-109)  

---

## 🎯 Executive Summary

On **30 September 2026**, **Gaurav Pal** successfully completed **WEB-105 (P0 Claim-Safety Remediation)**, **WEB-108 (P0 Frontend Transport Truthfulness)**, and **WEB-109 (P0 Hardened PHP Backend Package)** strictly adhering to **Aman Khatana's CRM-103 Final Production Contract**.

1. **WEB-105 Claim-Safety Restoration:** The approved, page-specific **Exclusions / Limitations** sections have been fully restored to all 5 staging website pages. Positioned after Deliverables and before Evidence / FAQ, each section visibly establishes service-specific boundaries to prevent claim drift.
2. **WEB-108 Frontend Transport Truthfulness:** Updated `app.js` and `styles.css` to guarantee transport truthfulness. Network failures, API timeouts, and HTTP errors now map exclusively to `ERROR` / `FAIL_CLOSED` and **never** display CRM success. Static host execution on GitHub Pages displays an explicit banner: `ℹ️ STAGING ONLY - NOT WRITTEN TO CRM`. The payload-key mismatch has been fixed, and fake client-side CRM record IDs have been completely removed.
3. **WEB-109 Hardened PHP Backend Package:** Built and hardened `api/submit.php`, `api/config.php`, and `api/health.php` matching all 10 CRM-103 rules:
   - **No Wildcard CORS:** Dynamic origin validation against `ALLOWED_ORIGINS` (`https://gv-gaurav.github.io`). Wildcards disallowed.
   - **Secrets in Server Environment:** Zero credentials committed to git; reads `ZOHO_CLIENT_ID` and `ZOHO_CLIENT_SECRET` via `getenv()`.
   - **Default Dry-Run (`LIVE_WRITE_ENABLED=false`):** Default live write disabled.
   - **Field Validation & Service Interest Allow-List:** Validates `account_name`, `contact_name`, `contact_email`, `contact_phone`, `submission_ref`, and enforces allowed `Service_Interest` values (`Renewable Energy Advisory`, `Carbon Markets / CCTS`, `GHG / MRV & Decarbonisation`).
   - **Idempotency & Duplicate Replay Protection:** Tracks `Submission_Ref` in `.processed_submissions.json`. Replays return HTTP 409 `DUPLICATE` with no CRM creation or updates.
   - **Sanitized Responses:** Standard status codes (`201 SUCCESS`, `409 DUPLICATE`, `422 FAIL_CLOSED`, `500 ERROR`) with zero exposure of tokens, credentials, or raw Zoho error payloads.
   - **Privacy-Minimised Logging:** Logged audit records contain timestamp, `Submission_Ref`, HTTP code, state, and real CRM Record ID. No PII logged.
   - **Deployment Guide:** Complete deployment steps, environment variables, rollback procedures, and health endpoint plan provided in `DEPLOYMENT_GUIDE.md`.

All code, styling, backend API scripts, and documentation updates have been committed and pushed to `origin/main`.

---

## 💻 Detailed Task Accomplishments

### 1. Restoration of Page-Level Limitation Blocks (WEB-105 — 5/5 Pages PASS)
- **Home (`index.html`):** Added 4 core advisory limitations (legal/tax exclusion, no broker/certifier role, no savings guarantees, illustrative outreach rules).
- **Renewable Energy (`renewable-energy-advisory.html`):** Added 5 service-specific EPC & financial boundary limitations.
- **Carbon Markets / CCTS (`carbon-markets-ccts.html`):** Added 6 regulatory & Green Credit Programme separation limitations.
- **GHG / MRV (`ghg-mrv-decarbonisation.html`):** Added 5 non-3rd-party assurance scope limitations.
- **Contact Us (`contact.html`):** Added 3 engagement and response-time limitation clauses.
- **Global Styling (`styles.css`):** Styled `.limitations-section`, `.limitations-card`, and `.limitations-list` with clean amber warning borders (`#f59e0b`), soft background tinting (`#fffdfa`), and 100% mobile responsiveness.

---

### 2. Frontend Transport Truthfulness & Hardening (WEB-108 — 4/4 Acceptance States PASS)
- **Network & API Failure Truthfulness (`app.js`):** Refactored `fetch().catch()` logic. Network errors, server timeouts, or unhandled exceptions now explicitly set transport state to `ERROR` / `FAIL_CLOSED`. Network failure **never** displays CRM success.
- **Staging Shadow Mode Explicit Outcome (`app.js` & `styles.css`):** GitHub Pages static hosting detection (`github.io`) sets mode to `SHADOW_ONLY`. UI banner explicitly renders: **`ℹ️ STAGING ONLY - NOT WRITTEN TO CRM`**.
- **Payload Key Mismatch Fixed (`app.js`):** `processCRMTransportResponse` now inspects `Zoho_Website_Leads_Payload` matching `handleFormSubmit`.
- **Simulated Record IDs Removed (`app.js`):** Removed random client-side ID generation (`zcrm_...`). Record IDs appear **only** when returned by a live backend/Zoho path.

---

### 3. Hardened Backend Package (WEB-109 — 10/10 CRM-103 Rules PASS)
- **CORS Allow-List (`api/config.php` & `api/submit.php`):** Authorised origins restricted to `ALLOWED_ORIGINS` (`https://gv-gaurav.github.io`). Wildcards disallowed.
- **Environment Secrets:** Zoho credentials read via `getenv()`. No secrets in repository.
- **Validation Engine:** Mandatory check for `account_name`, `contact_name`, `contact_email` (valid email format), `contact_phone`, `submission_ref`, and allowed `service_interest`. Unapproved fields ignored. `Brand` forced to `Insta utility`.
- **Idempotency Engine (`.processed_submissions.json`):** Submission references tracked. Replay submissions return HTTP 409 `DUPLICATE` with no CRM write or update.
- **Sanitized Response Contracts:**
  - `201 SUCCESS`: `{"status": "SUCCESS", "submission_ref": "IU-...", "crm_record_id": "<real Zoho ID>", "message": "Written to Website_Leads"}`
  - `409 DUPLICATE`: `{"status": "DUPLICATE", "submission_ref": "IU-...", "crm_record_id": null, "message": "Submission reference already processed; no new CRM record created."}`
  - `422 FAIL_CLOSED`: `{"status": "FAIL_CLOSED", "submission_ref": "IU-...", "crm_record_id": null, "error_code": "VALIDATION_FAILED", "message": "Request was not written to CRM."}`
  - `500 ERROR`: `{"status": "ERROR", "submission_ref": "IU-...", "crm_record_id": null, "error_code": "UPSTREAM_ERROR", "message": "CRM submission failed."}`
  - `200 SHADOW_ONLY`: `{"status": "SHADOW_ONLY", "submission_ref": "IU-...", "crm_record_id": null, "message": "STAGING ONLY - NOT WRITTEN TO CRM"}`
- **Minimal Health Endpoint (`api/health.php`):** Returns non-sensitive status (`LIVE_WRITE_ENABLED` boolean and timestamp).

---

## 🧪 4-State Transport & Backend Verification Matrix

| State / Test Case | Condition | Status Code | UI / API Response Outcome | CRM Write Count |
| :--- | :--- | :--- | :--- | :--- |
| **Shadow Mode** | `LIVE_WRITE_ENABLED=false` | `200 OK` | `STAGING ONLY - NOT WRITTEN TO CRM` | `0` |
| **Duplicate Replay** | Re-sent `Submission_Ref` | `409 DUPLICATE` | `Submission reference already processed` | `0 additional` |
| **Validation Failure** | Invalid field / Service Interest | `422 FAIL_CLOSED` | `Request was not written to CRM.` | `0` |
| **CORS Violation** | Unauthorised Origin header | `403 FORBIDDEN` | `Origin not authorised by CORS policy.` | `0` |
| **Network / Upstream Error** | Server offline or OAuth failure | `500 ERROR` | `CRM submission failed.` | `0` |
| **Live Success** | Valid payload & `LIVE_WRITE_ENABLED=true` | `201 SUCCESS` | `Written to Website_Leads` + Real CRM ID | `Exactly 1` |

---

## 📌 IMPORTANT USER RECOMMENDATION & CONTENT HANDOFF REQUEST

> **Request for Website Copy / Real Content (Ashish Work Handoff):**  
> **Gaurav Pal Note:** "I haven't received any content from Ashish yet. I request that Ashish provide the actual real content/copy for the Insta Utility website pages so that we can replace the staging text with the official approved copy."

---

## ➡️ Next Workflow Steps & Management Gate

1. **Gaurav Pal Tasks (WEB-105, WEB-108, WEB-109):** **`100% COMPLETE & VERIFIED`**
2. **Management Approval Gate:** Management authorizes uploading `api/` to an Insta Utility-controlled PHP server with server-side environment variables and rollback access.
3. **Aman Khatana (CRM-102 Retest):** After deployment approval, Aman executes exactly **ONE** synthetic non-personal live-write test (`crm102.synthetic@example.com`) to prove the end-to-end Website_Leads path and duplicate replay handling.
4. **Tarun (ADS-008 Gate):** After CRM-102 PASS, complete final no-spend gate review.

---
*Report updated on 30 September 2026 for Gaurav Pal (Web Construction Lead).*
