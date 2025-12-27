"""
Download all missing images from silverspringastro.com
"""
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import sys
import urllib.parse

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def get_page(url):
    """Fetch a page and return soup."""
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        return BeautifulSoup(r.content, 'html.parser')
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return None

def find_all_images(soup, base_url):
    """Find all image URLs in a page."""
    images = set()
    
    # Check img tags
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if src and '.jpg' in src.lower():
            if not src.startswith('http'):
                src = urllib.parse.urljoin(base_url, src)
            images.add(src)
    
    # Check links to images
    for a in soup.find_all('a'):
        href = a.get('href', '')
        if href and '.jpg' in href.lower():
            if not href.startswith('http'):
                href = urllib.parse.urljoin(base_url, href)
            images.add(href)
    
    return images

def download_image(url, output_dir):
    """Download an image."""
    filename = url.split('/')[-1].split('?')[0]
    filename = urllib.parse.unquote(filename)
    output_path = output_dir / filename
    
    if output_path.exists():
        print(f"    [SKIP] {filename}")
        return filename
    
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        with open(output_path, 'wb') as f:
            f.write(r.content)
        size_kb = output_path.stat().st_size / 1024
        print(f"    [OK] {filename} ({size_kb:.1f} KB)")
        return filename
    except Exception as e:
        print(f"    [FAIL] {filename}: {e}")
        return None

def process_page(url, output_folder):
    """Process a page and download all images."""
    output_dir = Path(f"public/images/{output_folder}")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\nProcessing: {url}")
    soup = get_page(url)
    if not soup:
        return []
    
    images = find_all_images(soup, url)
    print(f"  Found {len(images)} images")
    
    downloaded = []
    for img_url in sorted(images):
        # Skip thumbnails - we'll get full size
        if '_thumb' in img_url.lower():
            continue
        result = download_image(img_url, output_dir)
        if result:
            downloaded.append(result)
    
    return downloaded

def main():
    print("=" * 60)
    print("Downloading All Missing Images")
    print("=" * 60)
    
    # Pages to scrape
    pages = [
        ("http://www.silverspringastro.com/galaxyclusters/galaxyclusters.htm", "galaxy-clusters"),
        ("http://www.silverspringastro.com/starclusters/starclusters.htm", "star-clusters"),
    ]
    
    for url, folder in pages:
        process_page(url, folder)
    
    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)

if __name__ == "__main__":
    main()

