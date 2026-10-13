import hashlib, os, re

def sha256_full(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()

# Hero asset
hero = 'assets/ci_solar_factory_hero.png'
print('=== HERO ASSET ===')
print('File: ' + hero)
print('Size: ' + str(os.path.getsize(hero)) + ' bytes')
print('SHA-256 (FULL): ' + sha256_full(hero))

# All assets
print()
print('=== ALL ASSETS ===')
assets = [
    'assets/ci_solar_factory_hero.png',
    'assets/industrial_facility_bg.png',
    'assets/insta-utility-logo.png',
    'assets/favicon.png',
    'assets/check-mark.png',
    'assets/lighting.png',
    'assets/success.png',
    'assets/logo.svg',
]
for a in assets:
    size = os.path.getsize(a)
    sha = sha256_full(a)
    print(a + ' | ' + str(size) + ' bytes | SHA256: ' + sha)

# Img tag audit
print()
print('=== IMG TAG AUDIT (5 LAUNCH PAGES) ===')
pages = [
    'index.html',
    'renewable-energy-advisory.html',
    'carbon-markets-ccts.html',
    'ghg-mrv-decarbonisation.html',
    'contact.html'
]
img_re = re.compile(r'<img\s[^>]+>', re.IGNORECASE | re.DOTALL)
total = 0
missing = 0
for page in pages:
    content = open(page, encoding='utf-8').read()
    imgs = img_re.findall(content)
    page_total = len(imgs)
    page_missing = 0
    for img in imgs:
        has_w = 'width=' in img.lower()
        has_h = 'height=' in img.lower()
        if not has_w or not has_h:
            page_missing += 1
            missing += 1
    total += page_total
    print(page + ': ' + str(page_total) + ' img tags, ' + str(page_missing) + ' missing dimensions')

print('TOTAL: ' + str(total) + ' img tags | Missing: ' + str(missing))

# Per-tag breakdown with dimensions
print()
print('=== ALL IMG TAGS WITH width/height VALUES ===')
w_re = re.compile(r'width=["\'](\d+)["\']', re.IGNORECASE)
h_re = re.compile(r'height=["\'](\d+)["\']', re.IGNORECASE)
src_re = re.compile(r'src=["\']([^"\']+)["\']', re.IGNORECASE)

for page in pages:
    content = open(page, encoding='utf-8').read()
    imgs = img_re.findall(content)
    print('--- ' + page + ' ---')
    for img in imgs:
        w_m = w_re.search(img)
        h_m = h_re.search(img)
        s_m = src_re.search(img)
        src_val = s_m.group(1) if s_m else 'UNKNOWN'
        w_val = w_m.group(1) if w_m else 'MISSING'
        h_val = h_m.group(1) if h_m else 'MISSING'
        print('  src=' + src_val + ' | width=' + w_val + ' | height=' + h_val)

print()
print('=== AUDIT COMPLETE ===')
