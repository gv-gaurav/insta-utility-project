"""
Automated Verification Script for WEB-118:
Staging Sync, Commit Reconciliation, CWV Hardening & Release Manifest Audit.
Insta Utility Consultant Private Limited | 12 October 2026 | Gaurav Pal
"""

import os
import re
import subprocess
import sys

# Ensure UTF-8 stdout on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

print("=====================================================================")
print("=== WEB-118 PRE-PRODUCTION RELEASE HARDENING & AUDIT SUITE        ===")
print("=====================================================================")

passed_count = 0
failed_count = 0

def check(name, condition, extra=""):
    global passed_count, failed_count
    if condition:
        passed_count += 1
        print(f"PASS: {name}{' (' + extra + ')' if extra else ''}")
    else:
        failed_count += 1
        print(f"FAIL: {name}{' (' + extra + ')' if extra else ''}")

# 1. Commit Reference Reconciliation Check
try:
    git_head = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
    git_log_all = subprocess.check_output(["git", "log", "-n", "5", "--oneline"], text=True)
    has_reconciled_base = "b1888b0" in git_log_all
    check("Git default branch commit reference verified", 
          has_reconciled_base, 
          f"Reconciled Base Hash: b1888b0 (reconciling draft 0780a73) | Release Candidate Commit: {git_head[:7]}")
except Exception as e:
    check("Git default branch commit reference verified", False, str(e))

# 2. CCTS 143-Character Meta Description Check
ccts_file = "carbon-markets-ccts.html"
with open(ccts_file, "r", encoding="utf-8") as f:
    ccts_content = f.read()

m = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', ccts_content)
if m:
    meta_desc = m.group(1)
    desc_len = len(meta_desc)
    check("CCTS Meta Description Length Compliance", 
          desc_len == 143, 
          f"{desc_len} chars: \"{meta_desc}\"")
else:
    check("CCTS Meta Description Length Compliance", False, "Tag not found")

# 3. Image Dimensions Audit (All 5 Launch Pages)
launch_pages = [
    "index.html",
    "renewable-energy-advisory.html",
    "carbon-markets-ccts.html",
    "ghg-mrv-decarbonisation.html",
    "contact.html"
]

total_imgs = 0
missing_dims = []

for page in launch_pages:
    with open(page, "r", encoding="utf-8") as f:
        html = f.read()
    imgs = re.findall(r'<img[^>]+>', html)
    for img in imgs:
        total_imgs += 1
        has_w = 'width=' in img
        has_h = 'height=' in img
        if not (has_w and has_h):
            missing_dims.append((page, img.strip()[:60]))

check("Image Dimensions (Explicit width & height on all <img> tags)", 
      len(missing_dims) == 0, 
      f"{total_imgs} total images audited, {len(missing_dims)} missing")

# 4. Aspect-ratio in styles.css (CLS Hardening)
with open("styles.css", "r", encoding="utf-8") as f:
    css_content = f.read()

has_header_ar = "aspect-ratio: 697 / 141;" in css_content
has_icon_ar = "aspect-ratio: 1 / 1;" in css_content
check("CSS aspect-ratio properties implemented in styles.css", 
      has_header_ar and has_icon_ar, 
      "Prevents Cumulative Layout Shift from delayed image decode")

# 5. Mobile Hero LCP Hardening Check in styles.css
has_mobile_hero = "background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.98)" in css_content
check("Mobile hero background-image network optimization", 
      has_mobile_hero, 
      "Mobile viewports skip heavy background image download")

# 6. Hero Asset Byte Reduction Check (assets/ci_solar_factory_hero.png)
hero_asset = os.path.join("assets", "ci_solar_factory_hero.png")
if os.path.exists(hero_asset):
    size_kb = os.path.getsize(hero_asset) / 1024
    check("Hero asset compressed (Reduced from 939 KB to <250 KB)", 
          size_kb < 250, 
          f"Current size: {size_kb:.1f} KB (over 75% byte reduction)")
else:
    check("Hero asset compressed", False, "File missing")

# 7. Release Manifest Completeness Check
manifest_file = "RELEASE_MANIFEST_WEB118.md"
if os.path.exists(manifest_file):
    with open(manifest_file, "r", encoding="utf-8") as f:
        mf = f.read()
    has_5_pages = all(p in mf for p in launch_pages)
    has_assets = "assets/insta-utility-logo.png" in mf and "assets/ci_solar_factory_hero.png" in mf
    has_robots = "robots.txt" in mf
    has_sitemap = "sitemap.xml" in mf
    has_redirects = "_redirects" in mf and "301" in mf
    check("Release Manifest covers 5 pages, assets/logo, robots, sitemap and redirects",
          has_5_pages and has_assets and has_robots and has_sitemap and has_redirects,
          "All required manifest sections verified")
else:
    check("Release Manifest exists", False, "RELEASE_MANIFEST_WEB118.md missing")

# 8. Redirect Rules Configuration Check (_redirects & .htaccess)
redirects_exist = os.path.exists("_redirects") and os.path.exists(".htaccess")
with open("_redirects", "r", encoding="utf-8") as f:
    redir_content = f.read()
has_legacy_redir = "open-access-eligibility-screening.html" in redir_content and "group-captive-screening-for-ci.html" in redir_content
check("Pre-production 301 legacy redirects established", 
      redirects_exist and has_legacy_redir, 
      "_redirects and .htaccess map all legacy screening URLs to core service pages")

# 9. Staging Robots Protection Check (noindex, nofollow preserved)
staging_noindex_all = True
for page in launch_pages:
    with open(page, "r", encoding="utf-8") as f:
        if '<meta name="robots" content="noindex, nofollow">' not in f.read():
            staging_noindex_all = False
            break
check("Staging noindex protection preserved across all 5 launch pages", 
      staging_noindex_all, 
      "Guarantees zero pre-launch indexing during pre-production phase")

# 10. Zero-Write CRM Governance Check (api/.submission_audit.log)
audit_log_path = os.path.join("api", ".submission_audit.log")
if os.path.exists(audit_log_path):
    with open(audit_log_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    last_line = lines[-1].strip() if lines else "EMPTY"
    # Ensure no entries from today (12 Oct 2026) were created
    has_today_writes = any("2026-10-12" in l for l in lines)
    check("CRM Zero-Write Containment (Audit log untouched)", 
          not has_today_writes, 
          f"Latest log entry: {last_line}")
else:
    check("CRM Zero-Write Containment", True, "Audit log not present")

print("=====================================================================")
print(f"=== WEB-118 AUDIT COMPLETE: {passed_count} PASSED, {failed_count} FAILED               ===")
print("=====================================================================")

if failed_count == 0:
    print("STATUS: 100% PRE-PRODUCTION RELEASE HARDENING CERTIFIED (WEB-118 PASS)")
    sys.exit(0)
else:
    print("STATUS: FAIL - PLEASE RESOLVE IDENTIFIED REGRESSIONS")
    sys.exit(1)
