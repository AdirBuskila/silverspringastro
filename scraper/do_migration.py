#!/usr/bin/env python3
"""
Non-interactive migration script - copies new images to the new site.
Run this after reviewing what migrate_old_site.py found.
"""

import os
import sys
import shutil
import hashlib
from pathlib import Path
from collections import defaultdict

# Import config from main script
sys.path.insert(0, str(Path(__file__).parent))
from migrate_old_site import (
    OLD_SITE_BASE, NEW_SITE_PATH, NEW_IMAGES_PATH,
    OLD_WEBSITE_FOLDERS, FOLDERS_TO_DELETE, CATEGORY_MAPPING,
    FAMILY_SUBFOLDER_MAPPING, IMAGE_EXTENSIONS,
    get_file_hash, is_image_file, scan_existing_images, find_all_images
)

def copy_images(images_by_category, existing_hashes, existing_names):
    """Copy images to the new site."""
    stats = {
        'copied': 0,
        'duplicates_hash': 0,
        'duplicates_name': 0,
        'errors': 0,
    }
    
    for category, image_paths in sorted(images_by_category.items()):
        # For now, only copy astronomy images (not travel/family)
        # Travel will be uploaded via admin panel
        if category.startswith('travel/') or category.startswith('about/'):
            print(f"[SKIP] {category} - will be added via admin panel")
            continue
            
        dest_folder = NEW_IMAGES_PATH / category
        dest_folder.mkdir(parents=True, exist_ok=True)
        
        print(f"\n[COPY] {category} ({len(image_paths)} images)")
        
        copied_this_cat = 0
        for img_path in image_paths:
            file_hash = get_file_hash(img_path)
            file_name = img_path.name.lower()
            
            # Check for duplicate by hash
            if file_hash and file_hash in existing_hashes:
                stats['duplicates_hash'] += 1
                continue
            
            # Check for duplicate by name
            if file_name in existing_names:
                stats['duplicates_name'] += 1
                continue
            
            # Copy file
            dest_path = dest_folder / img_path.name
            try:
                shutil.copy2(img_path, dest_path)
                if file_hash:
                    existing_hashes[file_hash] = dest_path
                existing_names.add(file_name)
                stats['copied'] += 1
                copied_this_cat += 1
            except Exception as e:
                print(f"  Error copying {img_path.name}: {e}")
                stats['errors'] += 1
        
        print(f"  Copied {copied_this_cat} new images")
    
    return stats

def main():
    print("="*60)
    print("COPYING ASTRONOMY IMAGES TO NEW SITE")
    print("="*60)
    
    # Scan existing images
    print("\n[1] Scanning existing images...")
    existing_hashes, existing_names = scan_existing_images(NEW_IMAGES_PATH)
    print(f"  Found {len(existing_names)} existing images")
    
    # Find images in old site
    print("\n[2] Finding images in old site...")
    images_by_category = find_all_images()
    
    # Copy images
    print("\n[3] Copying astronomy images...")
    stats = copy_images(images_by_category, existing_hashes, existing_names)
    
    print("\n" + "="*60)
    print("MIGRATION COMPLETE")
    print("="*60)
    print(f"  Copied: {stats['copied']} images")
    print(f"  Skipped (duplicate hash): {stats['duplicates_hash']}")
    print(f"  Skipped (duplicate name): {stats['duplicates_name']}")
    print(f"  Errors: {stats['errors']}")
    
    # Summary of what's left for admin panel
    print("\n[INFO] Travel/family photos were NOT copied.")
    print("  These can be added later via the admin panel.")
    print("  Or run this script again with modifications if needed.")

if __name__ == "__main__":
    main()

