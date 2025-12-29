#!/usr/bin/env python3
"""
Non-interactive cleanup of duplicate files.
Removes:
1. Duplicate files in old-website folder (keeps public/images)
2. Thumbnail files when full versions exist
"""

import os
import hashlib
from pathlib import Path
from collections import defaultdict

# Configuration
PROJECT_PATH = Path(r"C:\Users\Adir\Desktop\Coding\Dev\silverspringastro-2")
PUBLIC_IMAGES_PATH = PROJECT_PATH / "public" / "images"
OLD_WEBSITE_PATH = PROJECT_PATH / "old-website"

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

def main():
    print("=" * 60)
    print("DUPLICATE CLEANUP")
    print("=" * 60)
    
    total_removed = 0
    total_saved = 0
    
    # Step 1: Remove thumbnails with full versions
    print("\n[1] Removing thumbnails that have full versions...")
    
    thumbs_removed = 0
    for filepath in PUBLIC_IMAGES_PATH.rglob('*'):
        if not filepath.is_file() or filepath.suffix.lower() not in IMAGE_EXTENSIONS:
            continue
        
        name_lower = filepath.stem.lower()
        is_thumb = any(suffix in name_lower for suffix in ['_thumb', 'thumb', '_small', '_tn'])
        
        if not is_thumb:
            continue
        
        # Check if full version exists
        base_name = filepath.stem
        for suffix in ['_thumb', 'thumb', '_small', '_tn']:
            base_name = base_name.replace(suffix, '').replace(suffix.upper(), '')
        
        parent = filepath.parent
        for ext in IMAGE_EXTENSIONS:
            full_path = parent / f"{base_name}{ext}"
            if full_path.exists() and full_path != filepath:
                size = filepath.stat().st_size
                try:
                    filepath.unlink()
                    thumbs_removed += 1
                    total_saved += size
                    print(f"  Removed: {filepath.name}")
                except Exception as e:
                    print(f"  Error removing {filepath.name}: {e}")
                break
    
    print(f"  Removed {thumbs_removed} thumbnails")
    
    # Step 2: Build hash map of public/images
    print("\n[2] Building hash map of public/images...")
    public_hashes = {}
    for filepath in PUBLIC_IMAGES_PATH.rglob('*'):
        if filepath.is_file() and filepath.suffix.lower() in ALL_MEDIA:
            file_hash = get_file_hash(filepath)
            if file_hash:
                public_hashes[file_hash] = filepath
    print(f"  Indexed {len(public_hashes)} files")
    
    # Step 3: Remove duplicates from old-website
    print("\n[3] Removing duplicates from old-website...")
    
    dups_removed = 0
    for filepath in OLD_WEBSITE_PATH.rglob('*'):
        if not filepath.is_file() or filepath.suffix.lower() not in ALL_MEDIA:
            continue
        
        file_hash = get_file_hash(filepath)
        if file_hash and file_hash in public_hashes:
            size = filepath.stat().st_size
            try:
                filepath.unlink()
                dups_removed += 1
                total_saved += size
            except Exception as e:
                pass
    
    print(f"  Removed {dups_removed} duplicates")
    
    # Summary
    print("\n" + "=" * 60)
    print("CLEANUP COMPLETE")
    print("=" * 60)
    print(f"  Thumbnails removed: {thumbs_removed}")
    print(f"  Duplicates removed: {dups_removed}")
    print(f"  Total files removed: {thumbs_removed + dups_removed}")
    print(f"  Space saved: {format_size(total_saved)}")

if __name__ == "__main__":
    main()

