#!/usr/bin/env python3
"""
Migrate Old Silver Spring Astro Website
========================================
This script processes the old website backup and:
1. Extracts relevant images (astronomy, travel, equipment)
2. Deletes junk files (_vti folders, admin stuff, etc.)
3. Copies useful content to the new site structure
4. Checks for duplicates
"""

import os
import shutil
import hashlib
from pathlib import Path
from collections import defaultdict

# Configuration - UPDATE THESE PATHS
# NOTE: The old website was extracted directly to the Desktop, mixed with other folders!
# We'll only process specific known folders from the old website.
OLD_SITE_BASE = Path(r"C:\Users\Adir\Desktop")
NEW_SITE_PATH = Path(r"C:\Users\Adir\Desktop\Coding\Dev\silverspringastro-2")
NEW_IMAGES_PATH = NEW_SITE_PATH / "public" / "images"

# Image extensions to look for
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.webp'}

# SPECIFIC FOLDERS from the old website to process (ignore everything else on Desktop)
OLD_WEBSITE_FOLDERS = [
    'galaxies',
    'galaxyclusters', 
    'starclusters',
    'nebulae',
    'supernovae',
    'exoplanets',
    'asteroidsastrometry',
    'asteroidsphotometry',
    'MPWeb',
    'equipment',
    'Australia',
    'Travel2',
    'familypictures',
    'Old_Family_Pictures',
    'StarParties',
    'Cornell',
    'HighSchool',
    'images',
    'videos',
    # Junk folders to clean up
    'yahoo_site_admin',
    'cgi-bin',
    'tmp',
    '_vti_bin',
    '_vti_cnf', 
    '_vti_log',
    '_vti_pvt',
    '_vti_txt',
    '_private',
]

# Folders to DELETE (junk/config files)
FOLDERS_TO_DELETE = [
    '_vti_bin', '_vti_cnf', '_vti_log', '_vti_pvt', '_vti_txt', '_private',
    'yahoo_site_admin', 'cgi-bin', 'tmp', 'lscache', 'cache', 'credentials', 'logs',
]

# Files to DELETE by extension
FILES_TO_DELETE = {'.htm', '.html', '.css', '.js', '.asp', '.aspx', '.asa', '.xml', '.cnt', '.htc'}

# Mapping of old folders to new categories
CATEGORY_MAPPING = {
    # Astronomy categories
    'galaxies': 'galaxies',
    'galaxyclusters': 'galaxy-clusters', 
    'starclusters': 'star-clusters',
    'nebulae': 'nebulae',
    'supernovae': 'supernovae',
    'exoplanets': 'exoplanets',
    'asteroidsastrometry': 'asteroids',
    'asteroidsphotometry': 'asteroids',
    'MPWeb': 'asteroids',  # Minor planets
    
    # Equipment
    'equipment': 'equipment',
    
    # Travel/Family photos
    'Australia': 'travel/australia',
    'Travel2': 'travel/misc',
    'familypictures': 'travel/family',
    'Old_Family_Pictures': 'travel/family',
    'StarParties': 'travel/star-parties',
    
    # Other
    'Cornell': 'about',
    'HighSchool': 'about',
    'images': 'misc',  # Root images folder
    'videos': 'skip',  # Skip videos for now
}

# Subfolders within Old_Family_Pictures to process with better names
FAMILY_SUBFOLDER_MAPPING = {
    'Israel_2003_Aug': 'travel/israel-2003',
    'Israel_2003_Oct': 'travel/israel-2003',
    'Israel_2005': 'travel/israel-2005',
    'Israel_2006_Aug': 'travel/israel-2006',
    'Israel_2006_Jan': 'travel/israel-2006',
    'Israel_2007_Aug': 'travel/israel-2007',
    'Bahamas_Dec_2007': 'travel/bahamas-2007',
    'Orlando_2002': 'travel/orlando-2002',
    'PuertoRico_2003': 'travel/puerto-rico-2003',
    'SanFrancisco_2003': 'travel/san-francisco-2003',
    'San_Diego_2005_web': 'travel/san-diego-2005',
    'Ski_Vermont_2005': 'travel/vermont-2005',
    'NMSkies_2007': 'travel/nm-skies-2007',
    'Ken_Israel_BGU_1973': 'about/ken-israel-1973',
    'Ken_Miriam_1960-1970': 'about/ken-miriam-1960s',
    'Ken_Miriam_1978-1980': 'about/ken-miriam-1970s',
    'Tamar_BatMitzva': 'travel/family',
    'Family_2002': 'travel/family',
    'Family_2003': 'travel/family',
}

def get_file_hash(filepath):
    """Calculate MD5 hash of a file for duplicate detection."""
    hash_md5 = hashlib.md5()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except:
        return None

def is_image_file(filepath):
    """Check if file is an image based on extension."""
    return filepath.suffix.lower() in IMAGE_EXTENSIONS

def delete_junk_folders():
    """Delete all junk/config folders from the old website."""
    deleted_count = 0
    deleted_size = 0
    
    # Delete top-level junk folders
    for folder_name in FOLDERS_TO_DELETE:
        folder_path = OLD_SITE_BASE / folder_name
        if folder_path.exists() and folder_path.is_dir():
            try:
                for f in folder_path.rglob('*'):
                    if f.is_file():
                        deleted_size += f.stat().st_size
                shutil.rmtree(folder_path)
                deleted_count += 1
                print(f"    Deleted: {folder_name}/")
            except Exception as e:
                print(f"    Error deleting {folder_name}: {e}")
    
    # Also delete _vti_cnf subfolders inside content folders
    for folder_name in OLD_WEBSITE_FOLDERS:
        folder_path = OLD_SITE_BASE / folder_name
        if folder_path.exists() and folder_name not in FOLDERS_TO_DELETE:
            for root, dirs, files in os.walk(folder_path, topdown=False):
                for dir_name in dirs:
                    if dir_name in FOLDERS_TO_DELETE or dir_name.startswith('_vti'):
                        dir_path = Path(root) / dir_name
                        try:
                            for f in dir_path.rglob('*'):
                                if f.is_file():
                                    deleted_size += f.stat().st_size
                            shutil.rmtree(dir_path)
                            deleted_count += 1
                        except:
                            pass
    
    print(f"  Total deleted: {deleted_count} junk folders ({deleted_size / (1024*1024):.1f} MB)")
    return deleted_count, deleted_size

def delete_junk_files():
    """Delete HTML, CSS, JS and other non-image files from old website folders."""
    deleted_count = 0
    deleted_size = 0
    
    for folder_name in OLD_WEBSITE_FOLDERS:
        folder_path = OLD_SITE_BASE / folder_name
        if folder_path.exists() and folder_path.is_dir() and folder_name not in FOLDERS_TO_DELETE:
            for file_path in folder_path.rglob('*'):
                if file_path.is_file():
                    ext = file_path.suffix.lower()
                    if ext in FILES_TO_DELETE:
                        try:
                            deleted_size += file_path.stat().st_size
                            file_path.unlink()
                            deleted_count += 1
                        except:
                            pass
    
    print(f"  Deleted {deleted_count} junk files ({deleted_size / (1024*1024):.1f} MB)")
    return deleted_count, deleted_size

def scan_existing_images(new_images_path):
    """Scan existing images in new site to detect duplicates."""
    existing_hashes = {}
    existing_names = set()
    
    if new_images_path.exists():
        for img_path in new_images_path.rglob('*'):
            if img_path.is_file() and is_image_file(img_path):
                file_hash = get_file_hash(img_path)
                if file_hash:
                    existing_hashes[file_hash] = img_path
                existing_names.add(img_path.name.lower())
    
    return existing_hashes, existing_names

def find_all_images():
    """Find all images in the old site folders."""
    images = defaultdict(list)
    skipped_files = []
    
    for folder_name in OLD_WEBSITE_FOLDERS:
        folder_path = OLD_SITE_BASE / folder_name
        
        # Skip junk folders and non-existent folders
        if not folder_path.exists() or folder_name in FOLDERS_TO_DELETE:
            continue
            
        for img_path in folder_path.rglob('*'):
            if img_path.is_file() and is_image_file(img_path):
                # Determine category based on path
                rel_path = img_path.relative_to(folder_path)
                parts = rel_path.parts
                
                # Handle Old_Family_Pictures with subfolder mapping
                if folder_name == 'Old_Family_Pictures' and len(parts) > 0:
                    subfolder = parts[0]
                    category = FAMILY_SUBFOLDER_MAPPING.get(subfolder, 'travel/family')
                else:
                    category = CATEGORY_MAPPING.get(folder_name, 'other')
                
                # Skip if marked as skip
                if category == 'skip':
                    skipped_files.append(img_path)
                    continue
                    
                images[category].append(img_path)
    
    if skipped_files:
        print(f"  Skipped {len(skipped_files)} files (marked as skip)")
    
    return images

def copy_images_to_new_site(images_by_category, existing_hashes, existing_names, dry_run=True):
    """Copy images to the new site, avoiding duplicates."""
    stats = {
        'copied': 0,
        'duplicates_hash': 0,
        'duplicates_name': 0,
        'errors': 0,
    }
    
    for category, image_paths in images_by_category.items():
        dest_folder = NEW_IMAGES_PATH / category
        
        if not dry_run:
            dest_folder.mkdir(parents=True, exist_ok=True)
        
        print(f"\n{'='*50}")
        print(f"Category: {category} ({len(image_paths)} images)")
        print(f"{'='*50}")
        
        for img_path in image_paths:
            file_hash = get_file_hash(img_path)
            file_name = img_path.name.lower()
            
            # Check for duplicate by hash
            if file_hash in existing_hashes:
                print(f"  [SKIP-HASH] {img_path.name} (duplicate of {existing_hashes[file_hash].name})")
                stats['duplicates_hash'] += 1
                continue
            
            # Check for duplicate by name
            if file_name in existing_names:
                print(f"  [SKIP-NAME] {img_path.name} (name already exists)")
                stats['duplicates_name'] += 1
                continue
            
            # Copy file
            dest_path = dest_folder / img_path.name
            
            if dry_run:
                print(f"  [WOULD COPY] {img_path.name}")
            else:
                try:
                    shutil.copy2(img_path, dest_path)
                    print(f"  [COPIED] {img_path.name}")
                    existing_hashes[file_hash] = dest_path
                    existing_names.add(file_name)
                    stats['copied'] += 1
                except Exception as e:
                    print(f"  [ERROR] {img_path.name}: {e}")
                    stats['errors'] += 1
    
    return stats

def print_summary(images_by_category):
    """Print a summary of what was found."""
    print("\n" + "="*60)
    print("SUMMARY OF IMAGES FOUND")
    print("="*60)
    
    total = 0
    for category, images in sorted(images_by_category.items()):
        count = len(images)
        total += count
        # Calculate total size
        size = sum(img.stat().st_size for img in images if img.exists())
        size_mb = size / (1024 * 1024)
        print(f"  {category:20s}: {count:5d} images ({size_mb:.1f} MB)")
    
    print(f"  {'TOTAL':20s}: {total:5d} images")
    print("="*60)

def main():
    print("="*60)
    print("SILVER SPRING ASTRO - OLD SITE MIGRATION")
    print("="*60)
    
    # Check paths exist
    if not OLD_SITE_BASE.exists():
        print(f"ERROR: Base path not found: {OLD_SITE_BASE}")
        return
    
    # Check if old website folders exist
    found_folders = [f for f in OLD_WEBSITE_FOLDERS if (OLD_SITE_BASE / f).exists()]
    print(f"\nFound {len(found_folders)} old website folders on Desktop")
    print(f"New site path: {NEW_SITE_PATH}")
    
    # Step 1: Delete junk folders
    print("\n[STEP 1] Cleaning up junk folders...")
    deleted_count, deleted_size = delete_junk_folders()
    
    # Step 2: Delete junk files (HTML, CSS, etc.)
    print("\n[STEP 2] Cleaning up junk files (HTML, CSS, JS)...")
    delete_junk_files()
    
    # Step 3: Scan existing images in new site
    print("\n[STEP 3] Scanning existing images in new site...")
    existing_hashes, existing_names = scan_existing_images(NEW_IMAGES_PATH)
    print(f"  Found {len(existing_names)} existing images")
    
    # Step 4: Find all images in old site
    print("\n[STEP 4] Finding images in old site...")
    images_by_category = find_all_images()
    print_summary(images_by_category)
    
    # Step 5: Ask user what to do
    print("\n" + "="*60)
    print("WHAT WOULD YOU LIKE TO DO?")
    print("="*60)
    print("  1. DRY RUN - Show what would be copied (no changes)")
    print("  2. COPY NEW IMAGES - Copy non-duplicate images to new site")
    print("  3. LIST BY CATEGORY - Show images grouped by category")
    print("  4. EXIT - Do nothing")
    
    choice = input("\nEnter choice (1/2/3/4): ").strip()
    
    if choice == '1':
        print("\n[DRY RUN] Showing what would be copied...")
        stats = copy_images_to_new_site(images_by_category, existing_hashes, existing_names, dry_run=True)
        print(f"\n  Summary:")
        print(f"  - Would copy: {stats['copied']} new images")
        print(f"  - Skip (duplicate hash): {stats['duplicates_hash']}")
        print(f"  - Skip (duplicate name): {stats['duplicates_name']}")
        
    elif choice == '2':
        confirm = input("\nThis will copy images to the new site. Continue? (y/n): ").strip().lower()
        if confirm == 'y':
            print("\n[COPYING] Copying new images to new site...")
            stats = copy_images_to_new_site(images_by_category, existing_hashes, existing_names, dry_run=False)
            print(f"\n  Summary:")
            print(f"  - Copied: {stats['copied']} images")
            print(f"  - Skipped (duplicate hash): {stats['duplicates_hash']}")
            print(f"  - Skipped (duplicate name): {stats['duplicates_name']}")
            print(f"  - Errors: {stats['errors']}")
        else:
            print("Cancelled.")
            
    elif choice == '3':
        print("\n[LISTING BY CATEGORY]")
        for category, imgs in sorted(images_by_category.items()):
            print(f"\n--- {category} ({len(imgs)} images) ---")
            for img in imgs[:10]:  # Show first 10
                print(f"    {img.name}")
            if len(imgs) > 10:
                print(f"    ... and {len(imgs) - 10} more")
    
    elif choice == '5':
        # Hidden option to clean up old folders after migration
        print("\n[CLEANUP] Removing old website folders from Desktop...")
        confirm = input("This will DELETE all old website folders. Type 'DELETE' to confirm: ").strip()
        if confirm == 'DELETE':
            for folder_name in OLD_WEBSITE_FOLDERS:
                folder_path = OLD_SITE_BASE / folder_name
                if folder_path.exists():
                    try:
                        shutil.rmtree(folder_path)
                        print(f"  Deleted: {folder_name}/")
                    except Exception as e:
                        print(f"  Error deleting {folder_name}: {e}")
            print("Cleanup complete!")
        else:
            print("Cleanup cancelled.")
        
    else:
        print("\nExiting without changes.")
    
    print("\nDone!")

if __name__ == "__main__":
    main()

