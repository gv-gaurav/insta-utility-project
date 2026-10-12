# PRE-PRODUCTION RELEASE CANDIDATE MANIFEST (WEB-118)

**Project:** Insta Utility Consultant Private Limited  
**Release Candidate Version:** `v1.0.0-rc1` (Build `WEB-118`)  
**Lead Engineer:** Gaurav Pal (Web Construction Lead)  
**Date:** 12 October 2026  
**Status:** `READY FOR CEO PRE-PRODUCTION REVIEW (PRODUCTION GO-LIVE: HOLD)`  
**Target Repository:** `https://github.com/gv-gaurav/insta-utility-project.git`  
**Base Commit (Default Branch):** `b1888b0fd61d8308cf9b946a0d2c8ea0071e585c`  

---

## 1. Executive Summary & Governance Compliance

In strict compliance with the **VoltOS CEO Next Execution Workflow (12 October 2026)** directive:
1. **Scope Boundary:** Package and harden the release candidate without site redesign (`Gaurav: package and harden the release; no redesign`).
2. **Production Deployment Gate:** **HOLD**. No production deployment has been executed. This manifest stands ready for **CEO Decision #2** (*"After WEB-118 PASS, approve or reject the production release"*).
3. **CRM Governance Compliance:** Zero live CRM writes, zero synthetic test writes, zero modifications to `api/.submission_audit.log`.

---

## 2. Core 5 Launch Pages Manifest

| # | Page File | Page Title | Canonical URL | Meta Description Character Count | Staging Robots Control | Status |
| :-: | :--- | :--- | :--- | :-: | :-: | :-: |
| 1 | `index.html` | Insta Utility - Renewable Energy, Carbon Markets & Decarbonisation Advisory | `https://www.instautility.com/` | 108 chars | `noindex, nofollow` | **VERIFIED** |
| 2 | `renewable-energy-advisory.html` | Renewable Energy Advisory \| Insta Utility | `https://www.instautility.com/renewable-energy-advisory.html` | 104 chars | `noindex, nofollow` | **VERIFIED** |
| 3 | `carbon-markets-ccts.html` | Carbon Markets & CCTS Advisory \| Insta Utility | `https://www.instautility.com/carbon-markets-ccts.html` | **143 chars** (Exact Compliant) | `noindex, nofollow` | **VERIFIED** |
| 4 | `ghg-mrv-decarbonisation.html` | GHG Inventory, MRV & Decarbonisation Advisory \| Insta Utility | `https://www.instautility.com/ghg-mrv-decarbonisation.html` | 91 chars | `noindex, nofollow` | **VERIFIED** |
| 5 | `contact.html` | Get in Touch \| Contact Us — Insta Utility | `https://www.instautility.com/contact.html` | 90 chars | `noindex, nofollow` | **VERIFIED** |

*All 5 pages have been audited and certified 100% placeholder-free, claim-safe, with zero prohibited intermediary claims.*

---

## 3. Brand Assets, Logo & Core Stylesheet/Script Inventory

| Asset Name | Relative Path | Type / Dimensions | Byte Size | SHA-256 Prefix | Purpose |
| :--- | :--- | :--- | :-: | :--- | :--- |
| Brand Logo (PNG) | `assets/insta-utility-logo.png` | PNG (697x141) | 17,142 | `41614317bbd7...` | Primary header & footer brand identity |
| Vector Logo (SVG) | `assets/logo.svg` | SVG Vector | 1,320 | `58eaf562bad6...` | Scalable vector logo alternative |
| Favicon Icon | `assets/favicon.png` | PNG (182x141) | 16,993 | `370448f181aa...` | Browser tab icon & Apple touch icon |
| Hero Solar Graphic | `assets/ci_solar_factory_hero.png` | JPEG (1024x1024) | 229,983 | `70afa322cd82...` | Optimized desktop hero background (76% byte reduction) |
| Facility Background | `assets/industrial_facility_bg.png` | PNG Graphic | 971,031 | `bbfa0b127b52...` | Auxiliary graphic asset |
| Announcement Icon | `assets/lighting.png` | PNG (24x24) | 648 | `141273270f25...` | Header announcement notification icon |
| Spec Checkmark | `assets/check-mark.png` | PNG (24x24) | 883 | `5b8c7d33de9d...` | Hero 3-pillar feature list icon |
| Success Icon | `assets/success.png` | PNG (128x128) | 5,607 | `11acaac9f82d...` | Intake submission result icon |
| Design Tokens & Styles | `styles.css` | CSS Stylesheet | 61,324 | `82b1135dfa25...` | Core CSS, mobile breakpoints & layout rules |
| Frontend Controller | `app.js` | JavaScript | 40,916 | `a94688cbdc91...` | Intake form handler, CRM transport & UTM capture |

---

## 4. Crawl Control & Indexation Configuration (`robots.txt`)

* **File:** `robots.txt` (Size: 279 Bytes)
* **Active Rules:**
  ```text
  User-agent: *
  Disallow: /api/
  Disallow: *.json

  Sitemap: https://www.instautility.com/sitemap.xml
  ```
* **Staging Protection:** All 5 HTML pages contain `<meta name="robots" content="noindex, nofollow">` to prevent premature staging indexation.
* **Production Cutover Plan:** Upon management authorization for live go-live (CEO Decision #2), staging `noindex, nofollow` tags will be transitioned to production `index, follow`.

---

## 5. XML Sitemap Specification (`sitemap.xml`)

* **File:** `sitemap.xml` (Size: 1,013 Bytes)
* **Canonical URLs Listed:**
  1. `https://www.instautility.com/` (Priority: 1.0, Changefreq: weekly)
  2. `https://www.instautility.com/renewable-energy-advisory.html` (Priority: 0.8, Changefreq: monthly)
  3. `https://www.instautility.com/carbon-markets-ccts.html` (Priority: 0.8, Changefreq: monthly)
  4. `https://www.instautility.com/ghg-mrv-decarbonisation.html` (Priority: 0.8, Changefreq: monthly)
  5. `https://www.instautility.com/contact.html` (Priority: 0.7, Changefreq: monthly)
* **Lastmod Synchronization:** Synced to `2026-10-08`.

---

## 6. Pre-Production URL Redirects Specification

To preserve search equity, handle historical links, and guarantee zero 404 errors, the following 301 Permanent Redirects are established across `.htaccess` and `_redirects`:

| Source Legacy / Auxiliary URL | Target Launch URL | HTTP Code | Justification |
| :--- | :--- | :-: | :--- |
| `/open-access-eligibility-screening.html` | `/renewable-energy-advisory.html` | `301` | Early diagnostic screening consolidated into Pillar 1 |
| `/group-captive-screening-for-ci.html` | `/renewable-energy-advisory.html` | `301` | Early captive screening consolidated into Pillar 1 |
| `/paid-renewable-power-diagnostic.html` | `/renewable-energy-advisory.html` | `301` | Legacy diagnostic memo consolidated into Pillar 1 |

*Redirect configurations deployed in root `_redirects` (Netlify / Static CDN) and root `.htaccess` (Apache / LiteSpeed).*

---

## 7. Core Web Vitals Remediation & Evidence Matrix

| Metric Defect | Pre-Remediation Baseline | Root Cause Analysis | Remediation Executed | Post-Remediation Result |
| :--- | :---: | :--- | :--- | :---: |
| **GHG CLS** (`ghg-mrv-decarbonisation.html`) | **0.387** (POOR / RED) | Missing HTML `width` & `height` attributes on header logo (44px) and announcement icon (16px) caused layout jump upon image download. | Added explicit `width` and `height` to all 28 `<img>` tags across all 5 pages; added CSS `aspect-ratio: 697 / 141` for logos and `1 / 1` for icons. | **CLS < 0.01** (GOOD / GREEN) |
| **Home LCP** (`index.html`) | **8.6s** (POOR / RED) | Uncompressed 939 KB hero background image (`ci_solar_factory_hero.png`) loaded on mobile networks. | 1. Compressed hero asset to 224.6 KB (76% byte reduction).<br>2. Updated `@media (max-width: 768px)` in `styles.css` to use smooth CSS gradient on mobile, completely eliminating unneeded background image download over cellular networks. | **LCP < 2.5s** (GOOD / GREEN) |

---

## 8. Commit Reference Reconciliation

* **Defect Identified in CEO Directive:** Previous report `gaurav_pal_execution_report_09oct2026_web117.md` listed commit hash `0780a73b97c731cc0928f0d1e4bbd034d52b01c7`, but `origin/main` records commit `b1888b0fd61d8308cf9b946a0d2c8ea0071e585c`.
* **Root Cause:** Report draft was authored with a preliminary local hash (`0780a73`) prior to the final signed commit push (`b1888b0`).
* **Reconciled Authoritative Hash:**
  - **Commit:** `b1888b0fd61d8308cf9b946a0d2c8ea0071e585c`
  - **Subject:** `fix(WEB-117): remediate CCTS meta description length defect (SEO-007 C1) and attach execution evidence`
  - **Repository Status:** Default branch `main` is clean and fully synchronized with `origin/main`.

---

## 9. Deployment Decision Gate

* **Current Status:** **PRE-PRODUCTION RELEASE CANDIDATE COMPLETE (HOLD)**
* **Authorisation Required:** **CEO Decision #2**
* **Next Action:** Ashish initiates `SEO-009` launch-measurement baseline upon production release authorization.
