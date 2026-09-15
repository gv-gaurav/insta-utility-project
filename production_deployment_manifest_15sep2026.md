# Production Deployment Manifest & Release Package (15 Sep 2026)

**Owner:** Gaurav Pal (Insta Utility Greenfield Staging Lead)  
**Date:** Tuesday, 15 September 2026  
**Cycle Release Status:** `PREPARED (NOINDEX STAGING) — AWAITING FRESH CEO RELEASE AUTHORITY`  
**Governance Constraint:** Do NOT publish to production, deploy DNS changes, or remove `noindex` headers without explicit CEO release authorization.

---

## 1. Release Package Scope

This deployment manifest covers the complete **Insta Utility v1.2 Claim-Safe Diagnostic & Commercial Launch Suite**:

| Page / Asset | Source File | Canonical Target URL | Staging Status |
| :--- | :--- | :--- | :--- |
| **C&I Renewable Power Diagnostic v1** | [`index.html`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/index.html) | `https://www.instautility.com/` | `NOINDEX STAGING` |
| **Open Access Eligibility Screening** | [`open-access-eligibility-screening.html`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/open-access-eligibility-screening.html) | `https://www.instautility.com/open-access-eligibility-screening.html` | `NOINDEX STAGING` |
| **Group Captive Screening for C&I** | [`group-captive-screening-for-ci.html`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/group-captive-screening-for-ci.html) | `https://www.instautility.com/group-captive-screening-for-ci.html` | `NOINDEX STAGING` |
| **Paid Renewable Power Diagnostic** | [`paid-renewable-power-diagnostic.html`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/paid-renewable-power-diagnostic.html) | `https://www.instautility.com/paid-renewable-power-diagnostic.html` | `NOINDEX STAGING` |
| **Core Client Script & CRM Engine** | [`app.js`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/app.js) | `https://www.instautility.com/app.js` | `STAGING TESTED (9/9 PASS)` |
| **Executive Light Theme System** | [`styles.css`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/styles.css) | `https://www.instautility.com/styles.css` | `STAGING TESTED` |

---

## 2. Environment Values & Configuration Matrix

```json
{
  "ENVIRONMENT": "STAGING",
  "BRAND": "Insta utility",
  "SPEC_VERSION": "2026-09-09 Mayank Insta Diagnostic v1 Contract",
  "GA4_MEASUREMENT_ID": "G-CX448B8NZM",
  "GA4_DEBUG_MODE": true,
  "ZOHO_CRM_TRANSPORT_CONTRACT": "Website_Leads",
  "ZOHO_CRM_ALLOWED_FIELDS": [
    "Business_Name",
    "Name",
    "Contact_Email",
    "Contact_Number",
    "Submission_Ref",
    "Brand"
  ],
  "ZOHO_CRM_OWNER_POLICY": "NULL_GATED (CEO Explicit Approval Required)",
  "ROBOTS_HEADER_CURRENT": "noindex, nofollow",
  "ROBOTS_HEADER_PRODUCTION_GO": "index, follow"
}
```

---

## 3. `index` / `noindex` Switch Protocol

> [!CAUTION]  
> **INDEXING GOVERNANCE LOCK:** All pages currently include `<meta name="robots" content="noindex, nofollow">`. **DO NOT** execute the find-and-replace below until CEO provides a written `GO FOR PRODUCTION PUBLISH` checkpoint signal.

### Execution Command (Execute ONLY upon CEO Release Authority):
```powershell
# PowerShell Find & Replace for Meta Robots Switch (Staging -> Production)
Get-ChildItem -Filter "*.html" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'content="noindex, nofollow"', 'content="index, follow"' | Set-Content $_.FullName
}
```

---

## 4. Rollback Plan & Commit Tracking

* **Baseline Production-Ready Commit:** `49cdad9` (*format(launch): format html structure in paid-renewable-power-diagnostic.html*)
* **Staging Verification Commit:** `HEAD` (Includes Aman 4-state CRM transport UX integration)
* **Rollback Command:**
  ```bash
  git checkout 49cdad9
  git clean -fd
  ```

---

## 5. Deployment Checklist & Verification Gates

- [x] **CRM Schema Verification:** 6-field allow-list enforced (`Business_Name`, `Name`, `Contact_Email`, `Contact_Number`, `Submission_Ref`, `Brand`).
- [x] **Owner Field Gate:** `Owner` remains `null` / unassigned.
- [x] **CRM Transport UX:** 4 deterministic states implemented in [`app.js`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/app.js) (Success, Duplicate, Fail-Closed, Error + Retry).
- [x] **Measurement Engine:** Single `dataLayer` emission per event (Tarun GA4 3x duplicate fix verified).
- [x] **Claim-Safe Copy:** No guaranteed savings percentage or fixed prices quoted across any page.
- [x] **Mobile & Responsive:** Off-canvas drawer navigation and 100% viewport compliance across desktop, tablet, and mobile breakpoints.
- [ ] **CEO Release Approval:** PENDING (Staging noindex freeze active).
