import subprocess
import re

print("=== WEB-117 NEGATIVE TEST PROOF (BASE COMMIT 4f02c0e AUDIT) ===")

try:
    # Extract carbon-markets-ccts.html content from base commit 4f02c0e
    raw_html = subprocess.check_output(
        ['git', 'show', '4f02c0e:carbon-markets-ccts.html'],
        text=True,
        encoding='utf-8'
    )

    meta_desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']\s*/?>', raw_html, re.IGNORECASE)

    if meta_desc_match:
        desc_text = meta_desc_match.group(1).strip()
        desc_len = len(desc_text)
        print(f"Base Commit (4f02c0e) Meta Description Found:")
        print(f"Line Content: \"{desc_text}\"")
        print(f"Character Count: {desc_len} characters")
        if 120 <= desc_len <= 155:
            print("RESULT: PASS")
        else:
            print(f"RESULT: FAIL (Length {desc_len} chars is outside required 120-155 character range)")
    else:
        print("FAIL: Meta description tag not found in base commit file.")

except Exception as e:
    print(f"ERROR executing git show: {e}")
