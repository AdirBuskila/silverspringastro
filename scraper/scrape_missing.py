"""
Scrape and download missing images from silverspringastro.com
"""
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import sys
import re

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "https://silverspringastro.com"

def scrape_page(url: str):
    """Scrape a page and return all image URLs."""
    print(f"Scraping: {url}")
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        images = []
        for img in soup.find_all('img'):
            src = img.get('src', '')
            if src and not src.startswith('http'):
                src = f"{BASE_URL}/{src.lstrip('/')}"
            if src and '.jpg' in src.lower():
                images.append(src)
        
        # Also check for links to images
        for a in soup.find_all('a'):
            href = a.get('href', '')
            if href and '.jpg' in href.lower():
                if not href.startswith('http'):
                    href = f"{BASE_URL}/{href.lstrip('/')}"
                images.append(href)
        
        return list(set(images))
    except Exception as e:
        print(f"  Error: {e}")
        return []

def download_image(url: str, output_dir: Path):
    """Download an image."""
    filename = url.split('/')[-1].split('?')[0]
    output_path = output_dir / filename
    
    if output_path.exists():
        print(f"  [SKIP] {filename}")
        return True
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        size_kb = output_path.stat().st_size / 1024
        print(f"  [OK] {filename} ({size_kb:.1f} KB)")
        return True
    except Exception as e:
        print(f"  [FAIL] {filename}: {e}")
        return False

def main():
    print("=" * 60)
    print("Scraping Missing Images")
    print("=" * 60)
    
    # Galaxy Clusters
    print("\n=== Galaxy Clusters ===")
    gc_dir = Path("public/images/galaxy-clusters")
    gc_dir.mkdir(parents=True, exist_ok=True)
    
    gc_images = scrape_page(f"{BASE_URL}/GalaxyClusters.html")
    print(f"Found {len(gc_images)} images")
    for img_url in gc_images:
        if '_thumb' not in img_url.lower():
            download_image(img_url, gc_dir)
    
    # Star Clusters  
    print("\n=== Star Clusters ===")
    sc_dir = Path("public/images/star-clusters")
    sc_dir.mkdir(parents=True, exist_ok=True)
    
    sc_images = scrape_page(f"{BASE_URL}/StarClusters.html")
    print(f"Found {len(sc_images)} images")
    for img_url in sc_images:
        if '_thumb' not in img_url.lower():
            download_image(img_url, sc_dir)

    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)

if __name__ == "__main__":
    main()



