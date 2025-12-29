#!/usr/bin/env python3
"""
Find and remove duplicate images/videos in the project.
Identifies duplicates by:
1. File hash (exact duplicates)
2. Similar filenames (e.g., image.jpg and image_thumb.jpg)
"""

import os
import hashlib
from pathlib import Path
from collections import defaultdict
import shutil

# Configuration
PROJECT_PATH = Path(r"C:\Users\Adir\Desktop\Coding\Dev\silverspringastro-2")
PUBLIC_IMAGES_PATH = PROJECT_PATH / "public" / "images"
OLD_WEBSITE_PATH = PROJECT_PATH / "old-website"

# File extensions to check
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.webp'}
VIDEO_EXTENSIONS = {'.mp4', '.avi', '.mov', '.wmv', '.webm', '.mkv'}
ALL_MEDIA = IMAGE_EXTENSIONS | VIDEO_EXTENSIONS

def get_file_hash(filepath, chunk_size=8192):
    """Calculate MD5 hash of a file."""
    hasher = hashlib.md5()
    try:
        with open(filepath, 'rb') as f:
            while chunk := f.read(chunk_size):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception:
        return None

def format_size(size_bytes):
    """Format bytes to human readable string."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"

def find_all_media(base_path):
    """Find all media files in a directory."""
    files = []
    if not base_path.exists():
        return files
    
    for filepath in base_path.rglob('*'):
        if filepath.is_file() and filepath.suffix.lower() in ALL_MEDIA:
            files.append(filepath)
    return files

def find_duplicates_by_hash(files):
    """Find exact duplicates by file hash."""
    hash_to_files = defaultdict(list)
    
    print("  Calculating file hashes...")
    for i, filepath in enumerate(files):
        if (i + 1) % 100 == 0:
            print(f"    Processed {i + 1}/{len(files)} files...")
        
        file_hash = get_file_hash(filepath)
        if file_hash:
            hash_to_files[file_hash].append(filepath)
    
    # Return only groups with duplicates
    return {h: paths for h, paths in hash_to_files.items() if len(paths) > 1}

def find_thumbnail_pairs(files):
    """Find files that have both full and thumbnail versions."""
    name_to_files = defaultdict(list)
    
    for filepath in files:
        # Normalize name (remove _thumb, thumb, _small, etc.)
        name = filepath.stem.lower()
        for suffix in ['_thumb', 'thumb', '_small', '_sm', '_thumbnail', '_tn']:
            name = name.replace(suffix, '')
        
        key = (filepath.parent, name, filepath.suffix.lower())
        name_to_files[key].append(filepath)
    
    # Return only groups with multiple files (potential thumb + full pairs)
    return {k: paths for k, paths in name_to_files.items() if len(paths) > 1}

def analyze_duplicates():
    """Main function to find and report duplicates."""
    print("=" * 60)
    print("DUPLICATE FILE FINDER")
    print("=" * 60)
    
    # Scan public images
    print("\n[1] Scanning public/images folder...")
    public_files = find_all_media(PUBLIC_IMAGES_PATH)
    print(f"    Found {len(public_files)} media files")
    
    # Scan old-website folder
    print("\n[2] Scanning old-website folder...")
    old_files = find_all_media(OLD_WEBSITE_PATH)
    print(f"    Found {len(old_files)} media files")
    
    all_files = public_files + old_files
    print(f"\n    TOTAL: {len(all_files)} media files")
    
    # Find exact duplicates
    print("\n[3] Finding exact duplicates (by file hash)...")
    duplicates = find_duplicates_by_hash(all_files)
    
    if duplicates:
        print(f"\n    Found {len(duplicates)} groups of duplicate files:")
        total_waste = 0
        dup_list = []
        
        for file_hash, paths in duplicates.items():
            # Sort by path - prefer keeping files in public/images
            paths.sort(key=lambda p: (0 if 'public' in str(p) else 1, str(p)))
            keep = paths[0]
            remove = paths[1:]
            
            waste = sum(p.stat().st_size for p in remove)
            total_waste += waste
            
            for r in remove:
                dup_list.append((r, keep, r.stat().st_size))
        
        print(f"\n    Potential space savings: {format_size(total_waste)}")
        
        # Show first 20 duplicates
        print("\n    Sample duplicates (first 20):")
        for i, (dup, orig, size) in enumerate(dup_list[:20]):
            print(f"      {i+1}. {dup.name} ({format_size(size)})")
            print(f"         Duplicate of: {orig}")
        
        if len(dup_list) > 20:
            print(f"      ... and {len(dup_list) - 20} more")
        
        return dup_list
    else:
        print("    No exact duplicates found!")
        return []

def find_thumbs_in_public():
    """Find thumbnail files in public/images that have full versions."""
    print("\n[4] Finding thumbnail files that can be removed...")
    
    thumbs_to_remove = []
    
    for filepath in PUBLIC_IMAGES_PATH.rglob('*'):
        if not filepath.is_file():
            continue
        
        name_lower = filepath.stem.lower()
        
        # Check if this is a thumbnail
        is_thumb = any(suffix in name_lower for suffix in ['_thumb', 'thumb', '_small', '_tn'])
        
        if is_thumb and filepath.suffix.lower() in IMAGE_EXTENSIONS:
            # Check if full version exists
            base_name = filepath.stem
            for suffix in ['_thumb', 'thumb', '_small', '_tn']:
                base_name = base_name.replace(suffix, '').replace(suffix.upper(), '')
            
            # Look for full version
            parent = filepath.parent
            for ext in IMAGE_EXTENSIONS:
                full_path = parent / f"{base_name}{ext}"
                if full_path.exists() and full_path != filepath:
                    thumbs_to_remove.append((filepath, full_path))
                    break
    
    if thumbs_to_remove:
        total_size = sum(t[0].stat().st_size for t in thumbs_to_remove)
        print(f"    Found {len(thumbs_to_remove)} thumbnail files with full versions")
        print(f"    Potential space savings: {format_size(total_size)}")
        
        print("\n    Thumbnails that can be removed:")
        for thumb, full in thumbs_to_remove[:20]:
            print(f"      - {thumb.relative_to(PROJECT_PATH)}")
        if len(thumbs_to_remove) > 20:
            print(f"      ... and {len(thumbs_to_remove) - 20} more")
    else:
        print("    No removable thumbnails found.")
    
    return thumbs_to_remove

def cleanup_duplicates(dup_list, thumbs_list, dry_run=True):
    """Remove duplicate files."""
    action = "Would remove" if dry_run else "Removing"
    total_saved = 0
    
    # Remove exact duplicates
    for dup_path, orig_path, size in dup_list:
        # Only remove from old-website folder, keep public/images
        if 'old-website' in str(dup_path):
            print(f"  {action}: {dup_path.name}")
            if not dry_run:
                try:
                    dup_path.unlink()
                    total_saved += size
                except Exception as e:
                    print(f"    Error: {e}")
    
    # Remove thumbnails
    for thumb_path, full_path in thumbs_list:
        size = thumb_path.stat().st_size
        print(f"  {action}: {thumb_path.name} (has full version)")
        if not dry_run:
            try:
                thumb_path.unlink()
                total_saved += size
            except Exception as e:
                print(f"    Error: {e}")
    
    return total_saved

def main():
    # Find duplicates
    dup_list = analyze_duplicates()
    thumbs_list = find_thumbs_in_public()
    
    if not dup_list and not thumbs_list:
        print("\n✓ No duplicates or removable thumbnails found!")
        return
    
    # Calculate total potential savings
    dup_size = sum(d[2] for d in dup_list if 'old-website' in str(d[0]))
    thumb_size = sum(t[0].stat().st_size for t in thumbs_list)
    total_potential = dup_size + thumb_size
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  Exact duplicates (in old-website): {len([d for d in dup_list if 'old-website' in str(d[0])])}")
    print(f"  Removable thumbnails: {len(thumbs_list)}")
    print(f"  Potential space savings: {format_size(total_potential)}")
    
    print("\n" + "=" * 60)
    print("OPTIONS")
    print("=" * 60)
    print("  1. DRY RUN - Show what would be removed")
    print("  2. REMOVE DUPLICATES - Delete duplicate files")
    print("  3. EXIT - Do nothing")
    
    try:
        choice = input("\nEnter choice (1/2/3): ").strip()
    except EOFError:
        # Non-interactive mode - just do dry run
        print("\n[DRY RUN - Non-interactive mode]")
        cleanup_duplicates(dup_list, thumbs_list, dry_run=True)
        return
    
    if choice == '1':
        print("\n[DRY RUN]")
        cleanup_duplicates(dup_list, thumbs_list, dry_run=True)
    elif choice == '2':
        confirm = input("\nThis will DELETE files. Type 'DELETE' to confirm: ").strip()
        if confirm == 'DELETE':
            print("\n[REMOVING DUPLICATES]")
            saved = cleanup_duplicates(dup_list, thumbs_list, dry_run=False)
            print(f"\nSaved {format_size(saved)} of disk space!")
        else:
            print("Cancelled.")
    else:
        print("Exiting.")

if __name__ == "__main__":
    main()

