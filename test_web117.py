import os
import re

html_files = [
    'index.html',
    'renewable-energy-advisory.html',
    'carbon-markets-ccts.html',
    'ghg-mrv-decarbonisation.html',
    'contact.html'
]

print("=== WEB-117 CCTS METADATA DEFECT REMEDIATION & NON-REGRESSION AUDIT ===")

total_errors = 0

# Check 1: Check styles.css has no render-blocking @import
if os.path.exists('styles.css'):
    with open('styles.css', 'r', encoding='utf-8') as f:
        css_content = f.read()
    if '@import url' in css_content:
        print("FAIL: styles.css contains render-blocking @import statement!")
        total_errors += 1
    else:
        print("PASS: styles.css is free of render-blocking @import.")

# Check 2: Check sitemap.xml lastmod timestamps
if os.path.exists('sitemap.xml'):
    with open('sitemap.xml', 'r', encoding='utf-8') as f:
        sitemap_content = f.read()
    if '<lastmod>2026-10-08</lastmod>' in sitemap_content and sitemap_content.count('<lastmod>2026-10-08</lastmod>') == 5:
        print("PASS: sitemap.xml has valid 5 lastmod timestamps.")
    else:
        print("FAIL: sitemap.xml does not have 5 updated lastmod timestamps!")
        total_errors += 1

forbidden_positioning = [
    r'Independent Position',
    r'Independent advisory support',
    r'seeking objective guidance',
    r'independent advisory firm'
]

forbidden_placeholders = [
    r'Placeholder note:',
    r'\[Insert\s+.*?\]',
    r'trust-placeholder-box',
    r'Evidence &amp; Source Placeholders',
    r'Evidence &amp; Office Placeholders',
    r'placeholders pending verification'
]

# Check 3: Audit carbon-markets-ccts.html specifically for WEB-117 CCTS meta description remediation
ccts_file = 'carbon-markets-ccts.html'
if os.path.exists(ccts_file):
    with open(ccts_file, 'r', encoding='utf-8') as f:
        ccts_content = f.read()
    
    meta_desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']\s*/?>', ccts_content, re.IGNORECASE)
    if not meta_desc_match:
        print("FAIL: carbon-markets-ccts.html missing <meta name=\"description\"> tag!")
        total_errors += 1
    else:
        desc_text = meta_desc_match.group(1).strip()
        desc_len = len(desc_text)
        if 120 <= desc_len <= 155:
            print(f"PASS: carbon-markets-ccts.html CCTS meta description remediated ({desc_len} chars): \"{desc_text}\"")
        else:
            print(f"FAIL: carbon-markets-ccts.html meta description length is {desc_len} chars (Must be 120-155 chars): \"{desc_text}\"")
            total_errors += 1

# Check 4: General Non-Regression Audit across all 5 launch pages
for file_name in html_files:
    if not os.path.exists(file_name):
        print(f"FAIL: File {file_name} missing!")
        total_errors += 1
        continue

    with open(file_name, 'r', encoding='utf-8') as f:
        content = f.read()

    file_errors = 0

    # Check staging noindex tag
    if '<meta name="robots" content="noindex, nofollow">' not in content:
        print(f"FAIL: {file_name} missing staging noindex meta tag!")
        file_errors += 1

    # Check GA4 script loader ID
    if 'id="ga4-gtag-loader"' not in content:
        print(f"FAIL: {file_name} missing GA4 loader ID 'ga4-gtag-loader'!")
        file_errors += 1

    # Check og:image is absolute
    if 'property="og:image" content="https://www.instautility.com/assets/insta-utility-logo.png"' not in content:
        print(f"FAIL: {file_name} missing absolute og:image meta tag!")
        file_errors += 1

    # Check canonical link
    if '<link rel="canonical" href="https://www.instautility.com/' not in content:
        print(f"FAIL: {file_name} missing or invalid canonical link!")
        file_errors += 1

    # Check schema logo URL is absolute
    if '"logo": "https://www.instautility.com/assets/insta-utility-logo.png"' not in content:
        print(f"FAIL: {file_name} missing absolute schema logo URL!")
        file_errors += 1

    # Check forbidden positioning wording
    for pattern in forbidden_positioning:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            print(f"FAIL: {file_name} contains forbidden positioning pattern '{pattern}' ({len(matches)} matches)")
            file_errors += 1

    # Check forbidden placeholders
    for pattern in forbidden_placeholders:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            print(f"FAIL: {file_name} contains forbidden placeholder pattern '{pattern}' ({len(matches)} matches)")
            file_errors += 1

    # Check form id
    if '<form id="diagnosticForm"' not in content:
        print(f"FAIL: {file_name} missing diagnosticForm ID!")
        file_errors += 1

    if file_errors == 0:
        print(f"PASS: {file_name} non-regression checks passed.")
    else:
        total_errors += file_errors

# Summary
if total_errors == 0:
    print("\nWEB-117 AUDIT RESULT: ALL CHECKS PASSED (Zero errors)")
else:
    print(f"\nWEB-117 AUDIT RESULT: FAILED ({total_errors} errors found)")
