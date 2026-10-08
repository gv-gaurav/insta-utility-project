import os
import re

html_files = [
    'index.html',
    'renewable-energy-advisory.html',
    'carbon-markets-ccts.html',
    'ghg-mrv-decarbonisation.html',
    'contact.html'
]

print("=== WEB-116 FINAL LAUNCH TECHNICAL DEFECT REMEDIATION VERIFICATION ===")

total_errors = 0

# Fix 1: Check styles.css has no render-blocking @import
if os.path.exists('styles.css'):
    with open('styles.css', 'r', encoding='utf-8') as f:
        css_content = f.read()
    if '@import url' in css_content:
        print("FAIL: styles.css contains render-blocking @import statement!")
        total_errors += 1
    else:
        print("PASS: styles.css is free of render-blocking @import (Mobile LCP optimized).")

# Fix 6: Check sitemap.xml lastmod timestamps
if os.path.exists('sitemap.xml'):
    with open('sitemap.xml', 'r', encoding='utf-8') as f:
        sitemap_content = f.read()
    if '<lastmod>2026-10-08</lastmod>' in sitemap_content and sitemap_content.count('<lastmod>2026-10-08</lastmod>') == 5:
        print("PASS: sitemap.xml updated to 2026-10-08 for all 5 URLs.")
    else:
        print("FAIL: sitemap.xml does not have 5 updated 2026-10-08 lastmod timestamps!")
        total_errors += 1

# Fix 2, 3, 4, 5, 7 per HTML file
forbidden_positioning = [
    r'Independent Position',
    r'Independent advisory support',
    r'seeking objective guidance',
    r'independent advisory firm'
]

for file_name in html_files:
    if not os.path.exists(file_name):
        print(f"FAIL: File {file_name} missing!")
        total_errors += 1
        continue

    with open(file_name, 'r', encoding='utf-8') as f:
        content = f.read()

    file_errors = 0

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

    # Check top header structure
    if '<header>' not in content or 'class="header-logo-img"' not in content or 'mobileMenuBtn' not in content:
        print(f"FAIL: {file_name} missing valid top header component!")
        file_errors += 1

    if file_errors == 0:
        print(f"PASS: {file_name} passed all WEB-116 technical defect checks.")
    else:
        total_errors += file_errors

# Final Summary
if total_errors == 0:
    print("\nSUCCESS: ALL 5 LAUNCH PAGES PASSED WEB-116 TECHNICAL DEFECT REMEDIATION AUDIT 100%")
else:
    print(f"\nFAILED: Found {total_errors} total validation errors.")
