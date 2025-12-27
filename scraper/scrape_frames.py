import requests
from bs4 import BeautifulSoup
from pathlib import Path
import sys
import re
import urllib.parse

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

BASE = "https://silverspringastro.com"

def get_page(url):
    """Fetch a page and return soup."""
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        return BeautifulSoup(r.content, 'html.parser')
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return None

def find_all_links(soup, base_url):
    """Find all links in a page."""
    links = set()
    for a in soup.find_all('a'):
        href = a.get('href', '')
        if href and not href.startswith('#') and not href.startswith('mailto:'):
            if not href.startswith('http'):
                href = urllib.parse.urljoin(base_url, href)
            links.add(href)
    return links

def find_all_images(soup, base_url):
    """Find all images in a page."""
    images = []
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if src:
            if not src.startswith('http'):
                src = urllib.parse.urljoin(base_url, src)
            images.append(src)
    return images

def download_image(url, output_dir):
    """Download an image."""
    filename = url.split('/')[-1].split('?')[0]
    # Clean filename
    filename = urllib.parse.unquote(filename)
    output_path = output_dir / filename
    
    if output_path.exists():
        print(f"    [SKIP] {filename}")
        return
    
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        with open(output_path, 'wb') as f:
            f.write(r.content)
        size_kb = output_path.stat().st_size / 1024
        print(f"    [OK] {filename} ({size_kb:.1f} KB)")
    except Exception as e:
        print(f"    [FAIL] {filename}: {e}")

# First, get home.htm
print("=== Checking home.htm ===")
soup = get_page(f"{BASE}/home.htm")
if soup:
    links = find_all_links(soup, f"{BASE}/")
    print(f"Found {len(links)} links:")
    for link in sorted(links):
        print(f"  {link}")

# Try specific pages
pages_to_try = [
    ("galaxy_clusters.htm", "galaxy-clusters"),
    ("galaxycluster.htm", "galaxy-clusters"),  
    ("star_clusters.htm", "star-clusters"),
    ("starcluster.htm", "star-clusters"),
    ("clusters.htm", "star-clusters"),
]

# Also check if there's a navigation menu with links
print("\n=== Checking for page links ===")
if soup:
    for a in soup.find_all('a'):
        href = a.get('href', '').lower()
        text = a.get_text(strip=True)
        if 'cluster' in href or 'cluster' in text.lower():
            print(f"  Found: {a.get('href')} -> {text}")

# Try common page patterns
print("\n=== Testing page URLs ===")
test_urls = [
    "home.htm",
    "galaxies.htm", 
    "galaxy_clusters.htm",
    "star_clusters.htm",
    "nebulae.htm",
    "supernovae.htm",
    "asteroids.htm",
    "exoplanets.htm",
    "family.htm",
]

for page in test_urls:
    url = f"{BASE}/{page}"
    try:
        r = requests.head(url, timeout=5)
        print(f"  {page}: {r.status_code}")
        if r.status_code == 200:
            soup = get_page(url)
            if soup:
                images = find_all_images(soup, url)
                print(f"    -> {len(images)} images found")
    except Exception as e:
        print(f"  {page}: ERROR")

