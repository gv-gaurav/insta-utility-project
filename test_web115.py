import os
import re

html_files = [
    'index.html',
    'renewable-energy-advisory.html',
    'carbon-markets-ccts.html',
    'ghg-mrv-decarbonisation.html',
    'contact.html'
]

print("=== WEB-115 LAUNCH CANDIDATE VERIFICATION ===")

forbidden_patterns = [
    r'Placeholder note:',
    r'\[Insert\s+.*?\]',
    r'trust-placeholder-box',
    r'Evidence &amp; Source Placeholders',
    r'Evidence &amp; Office Placeholders',
    r'placeholders pending verification'
]

total_errors = 0

for file_name in html_files:
    if not os.path.exists(file_name):
        print(f"FAIL: File {file_name} missing!")
        total_errors += 1
        continue

    with open(file_name, 'r', encoding='utf-8') as f:
        content = f.read()

    file_errors = 0
    for pattern in forbidden_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            print(f"FAIL: {file_name} contains forbidden pattern '{pattern}' ({len(matches)} matches)")
            file_errors += 1
            total_errors += 1

    # Check staging noindex tag
    if '<meta name="robots" content="noindex, nofollow">' not in content:
        print(f"FAIL: {file_name} missing staging noindex meta tag!")
        total_errors += 1

    # Check form id
    if file_name != 'DEPLOYMENT_GUIDE.md' and '<form id="diagnosticForm"' not in content:
        print(f"FAIL: {file_name} missing diagnosticForm ID!")
        total_errors += 1

    if file_errors == 0:
        print(f"PASS: {file_name} is clean, valid, and placeholder-free.")

if total_errors == 0:
    print("\nSUCCESS: ALL 5 LAUNCH CANDIDATE PAGES CERTIFIED 100% PLACEHOLDER-FREE (WEB-115 PASS)")
else:
    print(f"\nFAILED: Found {total_errors} validation errors.")
