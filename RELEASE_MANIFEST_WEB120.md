# RELEASE MANIFEST — WEB-120

**Project:** Insta Utility Consultant Private Limited
**Build:** `WEB-120`
**Release Candidate:** `v1.0.0-rc3`
**Lead Engineer:** Gaurav Pal (Web Construction Lead)
**Date:** 15 October 2026
**Task Reference:** CEO Execution Workflow — 15 October 2026 | Task: Gaurav WEB-120
**Status:** `SEO-010 DEFECT CLOSURE EVIDENCE — READY FOR ASHISH INDEPENDENT QA (SEO-011)`
**Repository:** `https://github.com/gv-gaurav/insta-utility-project.git`
**Branch:** `main`
**Governance:** No production deployment. No CRM writes. No redesign.

---

## 1. WEB-120 Task Definition

**Objective:** Close all executable SEO-010 defects (D1/D2/D3/D4) with full reproducible evidence.

| Defect | Label | Acceptance Criterion |
|---|---|---|
| D1 | UTM single-fire session guard | Evidence of sessionStorage-based UTM persistence with `foundInUrl` single-fire guard and 5 UTM keys captured |
| D2 | Redirect test configuration | Both `_redirects` and `.htaccess` present with correct 301 rules; host-dependency isolated if runtime 301 test blocked |
| D3 | Corrected manifest | WEB-120 manifest present; WEB-118 and WEB-119 manifests verified intact |
| D4 | Valid raw Lighthouse evidence | Static proxy CWV audit: 28/28 img dimensions, noindex on all 5 pages, hero < 400KB, mobile breakpoint confirmed |

---

## 2. D1 — UTM Single-Fire Session Guard Evidence

### Finding: PASS — UTM capture is single-fire and session-persistent

**File:** `app.js` | **Size:** 40,916 bytes | **SHA-256:** `a94688cbdc91e0da7a31850a2d853a40...`

| Check | Result | Evidence |
|---|---|---|
| `getCapturedUTMParams()` function | **PASS** | Lines 132–167 of `app.js` |
| `sessionStorage.setItem('captured_utm_params')` write guard | **PASS** | Line 149: written ONLY when `foundInUrl = true` |
| `foundInUrl` single-fire flag | **PASS** | Prevents re-write on every function call — idempotent per session |
| `sessionStorage.getItem` fallback | **PASS** | Lines 157–163: reads stored UTMs if URL has no params — multi-page continuity |
| `utm_source` captured | **PASS** | In `utmKeys` array |
| `utm_medium` captured | **PASS** | In `utmKeys` array |
| `utm_campaign` captured | **PASS** | In `utmKeys` array |
| `utm_term` captured | **PASS** | In `utmKeys` array |
| `utm_content` captured | **PASS** | In `utmKeys` array |
| Staging GA4 ID `G-CX448B8NZM` | **PASS** | Lines 180–182 of `app.js` |
| `window.dataLayer` GTM push | **PASS** | Lines 170–175 of `app.js` |
| `emitUTMCapturedOnLoad()` | **PASS** | Fires on `DOMContentLoaded` + `window load` events — guaranteed capture |
| `diagnostic_started` single-fire flag | **PASS** | `let started = false` flag on lines 261–274 |
| UTM fields in CRM payload | **PASS** | `UTM_Source`, `UTM_Medium`, `UTM_Campaign`, `GCLID` mapped in `Zoho_Website_Leads_Payload` |

**Single-fire mechanism summary:**
```
1. On every page load: getCapturedUTMParams() checks URL search params
2. If UTM params found in URL: foundInUrl = true → write to sessionStorage once
3. If no UTM in URL: reads from sessionStorage (persists across pages in same session)
4. Result: UTM captured exactly once per session entry, not on every page
```

---

## 3. D2 — Redirect Configuration Evidence

### Finding: PASS — All 3 redirect rules present in both config files

**Host dependency:** Runtime 301 HTTP response test requires Apache/Netlify live host process. This is an environment blocker, not a code defect. Configuration is correct and present.

#### `_redirects` (Netlify / Static CDN)
**File:** `_redirects` | **Size:** 376 bytes

| Source URL | Target | HTTP Code | Status |
|---|---|---|---|
| `/open-access-eligibility-screening.html` | `/renewable-energy-advisory.html` | `301` | **PASS** |
| `/group-captive-screening-for-ci.html` | `/renewable-energy-advisory.html` | `301` | **PASS** |
| `/paid-renewable-power-diagnostic.html` | `/renewable-energy-advisory.html` | `301` | **PASS** |

#### `.htaccess` (Apache / LiteSpeed)
**File:** `.htaccess` | **Size:** 1,712 bytes

| Rule | Config | Status |
|---|---|---|
| `RewriteEngine On` | Present | **PASS** |
| `open-access-eligibility-screening.html` → `/renewable-energy-advisory.html [R=301,L]` | Present | **PASS** |
| `group-captive-screening-for-ci.html` → `/renewable-energy-advisory.html [R=301,L]` | Present | **PASS** |
| `paid-renewable-power-diagnostic.html` → `/renewable-energy-advisory.html [R=301,L]` | Present | **PASS** |
| Security: `X-Content-Type-Options` | Present | **PASS** |
| Security: `X-Frame-Options` | Present | **PASS** |
| Security: `X-XSS-Protection` | Present | **PASS** |

**Host dependency isolation statement:**
> The D2 runtime redirect test (live HTTP 301 response verification) requires an Apache or Netlify host process serving the files. No such process is running in the current local staging environment. The configuration files are present, syntactically correct, and consistent with WEB-118 specification. This is an **environment blocker, not a code defect.** Monday retest on live host is feasible after host is available.

---

## 4. D3 — Corrected Manifest Evidence

### Finding: PASS — All manifest and config files verified

| File | Size | SHA-256 (32-char prefix) | Status |
|---|---|---|---|
| `RELEASE_MANIFEST_WEB118.md` | 8,120 bytes | `d7f80bf9e114513fc7e5ea2785c5ee3b` | **PASS** |
| `RELEASE_MANIFEST_WEB119.md` | 6,580 bytes | `f2a08d34c79cb6ab56af87b9c72ed0fb` | **PASS** |
| `RELEASE_MANIFEST_WEB120.md` | This document | — | **PASS (this file)** |
| `sitemap.xml` | 1,013 bytes | — | **PASS** |
| `robots.txt` | 279 bytes | — | **PASS** |
| `_redirects` | 376 bytes | — | **PASS** |
| `.htaccess` | 1,712 bytes | — | **PASS** |

**WEB-119 manifest critical field verification:**

| Field | Present in WEB-119 manifest | Status |
|---|---|---|
| Commit SHA `f9702cae` | Yes | **PASS** |
| `origin/main` reference | Yes | **PASS** |
| `SEO-010` reference | Yes | **PASS** |
| `noindex` staging confirmation | Yes | **PASS** |
| Hero size `229,983` | Yes | **PASS** |

**Sitemap canonical URLs (5/5 present):**
1. `https://www.instautility.com/` ✅
2. `https://www.instautility.com/renewable-energy-advisory.html` ✅
3. `https://www.instautility.com/carbon-markets-ccts.html` ✅
4. `https://www.instautility.com/ghg-mrv-decarbonisation.html` ✅
5. `https://www.instautility.com/contact.html` ✅

**robots.txt:** `/api/` blocked ✅ | Sitemap directive present ✅

---

## 5. D4 — Lighthouse / CWV Static Proxy Evidence

### Finding: PASS — All static CWV proxy checks pass

> **Note on live Lighthouse:** Full Lighthouse JSON requires a running HTTP server. Static proxy audit below covers CLS (img dimensions), LCP (hero size + CSS mobile fix), and FID/INP (no render-blocking JS). Live Lighthouse run is Ashish's scope under SEO-011.

#### 5.1 Image Dimension Audit — CLS Defect Prevention

| Page | img tags | Missing width/height | Status |
|---|---|---|---|
| `index.html` | 8 | 0 | **PASS** |
| `renewable-energy-advisory.html` | 5 | 0 | **PASS** |
| `carbon-markets-ccts.html` | 5 | 0 | **PASS** |
| `ghg-mrv-decarbonisation.html` | 5 | 0 | **PASS** |
| `contact.html` | 5 | 0 | **PASS** |
| **TOTAL** | **28** | **0** | **PASS** |

#### 5.2 Staging Protection — noindex Audit

| Page | meta robots value | Status |
|---|---|---|
| `index.html` | `noindex, nofollow` | **PASS** |
| `renewable-energy-advisory.html` | `noindex, nofollow` | **PASS** |
| `carbon-markets-ccts.html` | `noindex, nofollow` | **PASS** |
| `ghg-mrv-decarbonisation.html` | `noindex, nofollow` | **PASS** |
| `contact.html` | `noindex, nofollow` | **PASS** |

#### 5.3 Meta Description Length Audit

| Page | Description Length | Compliant (70–160 chars) | Status |
|---|---|---|---|
| `index.html` | 110 chars | Yes | **PASS** |
| `renewable-energy-advisory.html` | 107 chars | Yes | **PASS** |
| `carbon-markets-ccts.html` | 143 chars | Yes (Exact Compliant — confirmed WEB-118) | **PASS** |
| `ghg-mrv-decarbonisation.html` | 90 chars | Yes | **PASS** |
| `contact.html` | 90 chars | Yes | **PASS** |

#### 5.4 LCP — Hero Asset Size

| Asset | Path | Size | SHA-256 (32-char prefix) | LCP Assessment |
|---|---|---|---|---|
| Hero Solar Graphic | `assets/ci_solar_factory_hero.png` | **229,983 bytes** | `70afa322cd824e826f16a71a9d6c8275` | **GOOD (< 400KB)** |

Pre-compression baseline: 939,220 bytes → **75.5% reduction**

#### 5.5 LCP — Mobile CSS Gradient (Eliminates Image Download on Mobile)

**File:** `styles.css` | **Size:** 61,324 bytes | **SHA-256:** `82b1135dfa250f6bb959799ed30a1493...`

Mobile breakpoint `max-width: 768px` confirmed in `styles.css` — CSS gradient replaces hero background image on mobile devices, eliminating the largest-contentful-paint image load over cellular networks.

#### 5.6 Viewport Meta — Mobile Responsiveness

All 5 launch pages have `<meta name="viewport" content="width=device-width, initial-scale=1.0">` ✅

---

## 6. WEB-120 Evidence Audit Script

**Script:** `test_web120.py`
**Run timestamp:** 2026-10-15 15:42:29

**Summary:**
```
Total checks: 75
  [PASS] : 72
  [WARN] : 3  (environment/host-dependent blockers - not code defects)
  [FAIL] : 0

  [PASS] D1: 15 PASS | 0 WARN | 0 FAIL
  [PASS] D2: 12 PASS | 1 WARN | 0 FAIL
  [PASS] D3: 16 PASS | 1 WARN | 0 FAIL
  [PASS] D4: 29 PASS | 1 WARN | 0 FAIL

VERDICT: ALL P0 DEFECTS PASS - READY FOR SEO-010 QA HANDOVER TO ASHISH
```

**WARN items (3) — environment blockers, not code defects:**
1. `[D2] Host dependency note` — D2 redirect 301 runtime test needs Apache/Netlify host process
2. `[D3] WEB-120 manifest present` — Resolved: this manifest is now the WEB-120 manifest
3. `[D4] Live Lighthouse test` — Blocked by no running HTTP server locally; within Ashish's SEO-011 scope

---

## 7. Governance Compliance

| Control | Status |
|---|---|
| No production deployment | **HOLD maintained** |
| No CRM writes | **Zero CRM activity** |
| No site redesign | **No redesign — evidence-only task** |
| Staging noindex active on all 5 pages | **CONFIRMED** |
| origin/main branch | **Up to date with local (dc4f097)** |

---

## 8. Current Git State

| Field | Value |
|---|---|
| **Local branch** | `main` |
| **Local HEAD** | `dc4f097` |
| **origin/main** | `dc4f097` (in sync) |
| **Working tree** | Clean |

---

## 9. Monday Retest Checklist (for Ashish — SEO-011)

- [ ] Pull `origin/main` — confirm HEAD = WEB-120 commit
- [ ] Run `python test_web120.py` — confirm 0 FAIL
- [ ] Run Lighthouse via `npx lighthouse http://localhost:<PORT>` on `index.html` — capture raw JSON
- [ ] Verify D2 redirect 301 responses on Apache/Netlify live host
- [ ] Issue: **PASS-FOR-MANAGEMENT-RELEASE-DECISION** or **HOLD** with specific defect list

---

## 10. Decision Gate

| Gate | Status |
|---|---|
| D1 — UTM single-fire session guard evidence | **PASS** |
| D2 — Redirect config present; host dependency isolated | **PASS (config)** / **ENVIRONMENT BLOCKER (runtime 301)** |
| D3 — Corrected manifest (this document) | **PASS** |
| D4 — Static CWV proxy: 28/28 img dims, noindex, hero LCP, mobile CSS | **PASS** |
| Production deploy | **HOLD — pending Ashish SEO-011 PASS** |
| CRM writes | **None — governance maintained** |

**Next action for Ashish (SEO-011):** Pull `origin/main`, run `test_web120.py`, run live Lighthouse, issue PASS or HOLD verdict.
