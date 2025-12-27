"""
Silver Spring Observatory Website Scraper

This script crawls silverspringastro.com to:
1. Discover all pages (handling frames)
2. Download all astronomy images
3. Extract metadata (names, descriptions, observatory codes)
4. Save structured data for the new site

Usage: python scrape_site.py
"""

import os
import re
import json
import time
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Optional, List, Set
import hashlib

# Configuration
BASE_URL = "https://silverspringastro.com"
OUTPUT_DIR = Path("../public/images")
DATA_DIR = Path("../src/data/scraped")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Known page patterns from the original site
KNOWN_PAGES = [
    "home.htm",
    "galaxies.htm", "Galaxies.htm", "galaxy.htm",
    "galaxyclusters.htm", "GalaxyClusters.htm", "galaxy_clusters.htm",
    "starclusters.htm", "StarClusters.htm", "star_clusters.htm",
    "nebulae.htm", "Nebulae.htm", "nebula.htm",
    "supernovae.htm", "Supernovae.htm", "supernova.htm",
    "asteroids.htm", "Asteroids.htm", "asteroid.htm",
    "exoplanets.htm", "Exoplanets.htm", "exoplanet.htm",
    "equipment.htm", "Equipment.htm",
    "work.htm", "Work.htm",
    "family.htm", "Family.htm", "travel.htm", "Travel.htm",
    "starparties.htm", "StarParties.htm",
    "bbo.htm", "BBO.htm", "blackbird.htm",
]


@dataclass
class ScrapedImage:
    """Represents a scraped astronomy image"""
    url: str
    filename: str
    local_path: str
    page_source: str
    title: Optional[str] = None
    designation: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    observatory: Optional[str] = None
    filters: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None


class SiteScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.visited_urls: Set[str] = set()
        self.discovered_pages: Set[str] = set()
        self.images: List[ScrapedImage] = []
        self.failed_urls: List[str] = []
        
        # Create output directories
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        
        # Category subdirectories
        for cat in ["galaxies", "galaxy-clusters", "star-clusters", "nebulae", 
                    "supernovae", "asteroids", "exoplanets", "equipment", "travel", "misc"]:
            (OUTPUT_DIR / cat).mkdir(exist_ok=True)
            (OUTPUT_DIR / cat / "thumbs").mkdir(exist_ok=True)

    def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """Fetch and parse a page"""
        if url in self.visited_urls:
            return None
        
        self.visited_urls.add(url)
        print(f"  Fetching: {url}")
        
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            print(f"    Error fetching {url}: {e}")
            self.failed_urls.append(url)
            return None

    def discover_pages(self):
        """Discover all pages on the site"""
        print("\n=== Discovering Pages ===")
        
        # Try the main frameset page first
        main_soup = self.fetch_page(BASE_URL)
        if main_soup:
            # Look for frames
            for frame in main_soup.find_all(['frame', 'iframe']):
                src = frame.get('src')
                if src:
                    full_url = urljoin(BASE_URL, src)
                    self.discovered_pages.add(full_url)
                    print(f"  Found frame: {src}")
        
        # Try all known page patterns
        for page in KNOWN_PAGES:
            url = urljoin(BASE_URL, page)
            self.discovered_pages.add(url)
        
        # Also try with/without www
        www_base = "https://www.silverspringastro.com"
        for page in KNOWN_PAGES:
            self.discovered_pages.add(urljoin(www_base, page))
        
        print(f"\n  Total pages to check: {len(self.discovered_pages)}")

    def extract_image_info(self, img_tag, soup, page_url: str) -> Optional[ScrapedImage]:
        """Extract information about an image from its tag and surrounding context"""
        src = img_tag.get('src')
        if not src:
            return None
        
        # Skip tiny images, icons, and tracking pixels
        width = img_tag.get('width', '999')
        height = img_tag.get('height', '999')
        try:
            if int(width) < 50 or int(height) < 50:
                return None
        except:
            pass
        
        # Skip known non-content images
        skip_patterns = ['clicky', 'badge', 'counter', 'spacer', 'blank', 'pixel']
        if any(pat in src.lower() for pat in skip_patterns):
            return None
        
        full_url = urljoin(page_url, src)
        filename = os.path.basename(urlparse(full_url).path)
        
        if not filename or not any(filename.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif']):
            return None
        
        # Try to extract title/description from various sources
        title = img_tag.get('alt') or img_tag.get('title')
        
        # Look at parent elements for more context
        parent = img_tag.parent
        description = None
        
        # Check for captions in nearby text
        if parent:
            # Check for text in parent or siblings
            parent_text = parent.get_text(strip=True)
            if parent_text and len(parent_text) > len(title or ''):
                description = parent_text
            
            # Check next sibling for caption
            next_sib = img_tag.find_next_sibling()
            if next_sib and next_sib.string:
                if not description:
                    description = next_sib.string.strip()
        
        # Detect category from page URL
        category = self.detect_category(page_url, filename)
        
        # Detect observatory code from filename or nearby text
        observatory = self.detect_observatory(filename, description or title or '')
        
        # Detect filter info
        filters = self.detect_filters(filename, description or title or '')
        
        # Try to extract Messier/NGC designation
        designation = self.extract_designation(filename, title or '', description or '')
        
        # Determine local path based on category
        local_path = f"{category}/{filename}"
        
        return ScrapedImage(
            url=full_url,
            filename=filename,
            local_path=local_path,
            page_source=page_url,
            title=title,
            designation=designation,
            category=category,
            observatory=observatory,
            filters=filters,
            description=description
        )

    def detect_category(self, page_url: str, filename: str) -> str:
        """Detect the category based on page URL and filename"""
        url_lower = page_url.lower()
        file_lower = filename.lower()
        
        if 'galax' in url_lower and 'cluster' in url_lower:
            return 'galaxy-clusters'
        elif 'galaxy' in url_lower or 'galaxi' in url_lower:
            return 'galaxies'
        elif 'star' in url_lower and 'cluster' in url_lower:
            return 'star-clusters'
        elif 'nebula' in url_lower:
            return 'nebulae'
        elif 'supernova' in url_lower:
            return 'supernovae'
        elif 'asteroid' in url_lower:
            return 'asteroids'
        elif 'exoplanet' in url_lower:
            return 'exoplanets'
        elif 'equipment' in url_lower or 'scope' in file_lower or 'mount' in file_lower:
            return 'equipment'
        elif 'family' in url_lower or 'travel' in url_lower or 'israel' in file_lower:
            return 'travel'
        else:
            return 'misc'

    def detect_observatory(self, filename: str, text: str) -> Optional[str]:
        """Detect observatory code from filename or description"""
        combined = f"{filename} {text}".upper()
        
        if 'BBO' in combined or 'BLACKBIRD' in combined:
            return 'BBO'
        elif 'SRO' in combined or 'SIERRA' in combined:
            return 'SRO'
        elif 'G53' in combined or 'ALDER' in combined:
            return 'G53'
        elif 'H85' in combined or 'SILVER SPRING' in combined:
            return 'H85'
        
        # Check filename patterns
        if '_bbo' in filename.lower() or 'bbo_' in filename.lower():
            return 'BBO'
        elif '_h85' in filename.lower() or 'h85_' in filename.lower():
            return 'H85'
        
        return None

    def detect_filters(self, filename: str, text: str) -> Optional[str]:
        """Detect filter information"""
        combined = f"{filename} {text}".upper()
        
        filters = []
        if 'LRGB' in combined:
            filters.append('LRGB')
        if 'HA' in combined or 'H-ALPHA' in combined or 'HALPHA' in combined:
            if 'LRGB' in filters:
                return 'LRGB+Ha'
            filters.append('Ha')
        if 'OIII' in combined or 'O3' in combined:
            filters.append('OIII')
        if 'SII' in combined or 'S2' in combined:
            filters.append('SII')
        
        if 'SII' in filters and 'HA' in ' '.join(filters).upper() and 'OIII' in filters:
            return 'SII/Ha/OIII'
        
        return filters[0] if filters else None

    def extract_designation(self, filename: str, title: str, description: str) -> Optional[str]:
        """Extract Messier, NGC, IC, or other designation"""
        combined = f"{filename} {title} {description}"
        
        # Messier objects
        m_match = re.search(r'\bM\s*(\d{1,3})\b', combined, re.IGNORECASE)
        if m_match:
            return f"M{m_match.group(1)}"
        
        # NGC objects
        ngc_match = re.search(r'\bNGC\s*(\d{3,5})\b', combined, re.IGNORECASE)
        if ngc_match:
            return f"NGC {ngc_match.group(1)}"
        
        # IC objects
        ic_match = re.search(r'\bIC\s*(\d{3,5})\b', combined, re.IGNORECASE)
        if ic_match:
            return f"IC {ic_match.group(1)}"
        
        # Abell clusters
        abell_match = re.search(r'\bAbell\s*(\d+)\b', combined, re.IGNORECASE)
        if abell_match:
            return f"Abell {abell_match.group(1)}"
        
        return None

    def scrape_page(self, url: str):
        """Scrape a single page for images and links"""
        soup = self.fetch_page(url)
        if not soup:
            return
        
        # Find all images
        for img in soup.find_all('img'):
            image_info = self.extract_image_info(img, soup, url)
            if image_info:
                # Check for duplicates by URL
                if not any(i.url == image_info.url for i in self.images):
                    self.images.append(image_info)
                    print(f"    Found image: {image_info.filename}")
        
        # Find links to other pages (for recursive scraping)
        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.endswith('.htm') or href.endswith('.html'):
                full_url = urljoin(url, href)
                if full_url.startswith(BASE_URL) or full_url.startswith("https://www.silverspringastro.com"):
                    if full_url not in self.discovered_pages:
                        self.discovered_pages.add(full_url)
                        print(f"    Discovered new page: {full_url}")

    def download_image(self, image: ScrapedImage) -> bool:
        """Download a single image"""
        output_path = OUTPUT_DIR / image.local_path
        
        if output_path.exists():
            print(f"    Skipping (exists): {image.filename}")
            return True
        
        try:
            response = self.session.get(image.url, timeout=60)
            response.raise_for_status()
            
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            print(f"    Downloaded: {image.filename}")
            return True
        except Exception as e:
            print(f"    Failed to download {image.url}: {e}")
            return False

    def download_all_images(self):
        """Download all discovered images"""
        print(f"\n=== Downloading {len(self.images)} Images ===")
        
        success = 0
        failed = 0
        
        for i, image in enumerate(self.images):
            print(f"  [{i+1}/{len(self.images)}] {image.filename}")
            if self.download_image(image):
                success += 1
            else:
                failed += 1
            
            # Be nice to the server
            time.sleep(0.5)
        
        print(f"\n  Downloaded: {success}, Failed: {failed}")

    def save_data(self):
        """Save scraped data to JSON files"""
        print("\n=== Saving Data ===")
        
        # Save all image data
        images_data = [asdict(img) for img in self.images]
        with open(DATA_DIR / "images_raw.json", 'w') as f:
            json.dump(images_data, f, indent=2)
        print(f"  Saved {len(images_data)} images to images_raw.json")
        
        # Group by category
        by_category = {}
        for img in self.images:
            cat = img.category
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(asdict(img))
        
        for cat, imgs in by_category.items():
            with open(DATA_DIR / f"{cat}.json", 'w') as f:
                json.dump(imgs, f, indent=2)
            print(f"  Saved {len(imgs)} images to {cat}.json")
        
        # Save failed URLs
        if self.failed_urls:
            with open(DATA_DIR / "failed_urls.json", 'w') as f:
                json.dump(self.failed_urls, f, indent=2)
            print(f"  Saved {len(self.failed_urls)} failed URLs")

    def run(self):
        """Main scraping process"""
        print("=" * 60)
        print("Silver Spring Observatory Website Scraper")
        print("=" * 60)
        
        # Step 1: Discover pages
        self.discover_pages()
        
        # Step 2: Scrape each page
        print("\n=== Scraping Pages ===")
        pages_to_scrape = list(self.discovered_pages)
        for i, url in enumerate(pages_to_scrape):
            print(f"\n[{i+1}/{len(pages_to_scrape)}] Scraping: {url}")
            self.scrape_page(url)
            
            # Check for newly discovered pages
            new_pages = self.discovered_pages - set(pages_to_scrape)
            if new_pages:
                pages_to_scrape.extend(new_pages)
            
            time.sleep(0.5)  # Be nice to the server
        
        # Step 3: Download images
        self.download_all_images()
        
        # Step 4: Save data
        self.save_data()
        
        print("\n" + "=" * 60)
        print("Scraping Complete!")
        print(f"  Pages scraped: {len(self.visited_urls)}")
        print(f"  Images found: {len(self.images)}")
        print(f"  Failed URLs: {len(self.failed_urls)}")
        print("=" * 60)


if __name__ == "__main__":
    scraper = SiteScraper()
    scraper.run()

