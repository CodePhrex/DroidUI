#!/usr/bin/env python3
"""
Android Mipmap Icon Density Resizer & Asset Pipeline
---------------------------------------------------
Automates resizing app icon source images into standard Android mipmap density buckets:
- launcher icons (ic_launcher.png, ic_launcher_round.png)
- adaptive icon foregrounds (ic_launcher_foreground.png)

Density Bucket Ratios (Base mdpi = 1.0x / 48px):
- mdpi:    48x48 px   (1.0x)   | Adaptive Foreground: 108x108 px
- hdpi:    72x72 px   (1.5x)   | Adaptive Foreground: 162x162 px
- xhdpi:   96x96 px   (2.0x)   | Adaptive Foreground: 216x216 px
- xxhdpi:  144x144 px (3.0x)   | Adaptive Foreground: 324x324 px
- xxxhdpi: 192x192 px (4.0x)   | Adaptive Foreground: 432x432 px
"""

import os
import sys
import argparse
from PIL import Image

MIPMAP_LAUNCHER_SIZES = {
    'mipmap-mdpi': (48, 48),
    'mipmap-hdpi': (72, 72),
    'mipmap-xhdpi': (96, 96),
    'mipmap-xxhdpi': (144, 144),
    'mipmap-xxxhdpi': (192, 192),
}

MIPMAP_ADAPTIVE_FOREGROUND_SIZES = {
    'mipmap-mdpi': (108, 108),
    'mipmap-hdpi': (162, 162),
    'mipmap-xhdpi': (216, 216),
    'mipmap-xxhdpi': (324, 324),
    'mipmap-xxxhdpi': (432, 432),
}

def create_dummy_icon_if_missing(path):
    """Creates a sample 1024x1024 high-res icon if no source image exists."""
    if not os.path.exists(path):
        print(f"[i] Creating sample high-res 1024x1024 source icon at: {path}")
        img = Image.new('RGBA', (1024, 1024), color='#0f172a')
        # Simple sample graphic
        from PIL import ImageDraw
        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle([128, 128, 896, 896], radius=180, fill='#3b82f6')
        draw.ellipse([384, 384, 640, 640], fill='#ffffff')
        os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
        img.save(path, 'PNG')

def generate_mipmaps(source_path, output_dir, is_adaptive_foreground=False, filename="ic_launcher.png"):
    """Resizes source image into all Android mipmap density buckets."""
    if not os.path.exists(source_path):
        create_dummy_icon_if_missing(source_path)

    try:
        source_img = Image.open(source_path).convert('RGBA')
    except Exception as e:
        print(f"❌ Error opening source image {source_path}: {e}")
        return False

    size_map = MIPMAP_ADAPTIVE_FOREGROUND_SIZES if is_adaptive_foreground else MIPMAP_LAUNCHER_SIZES
    mode_name = "Adaptive Foreground" if is_adaptive_foreground else "Standard Launcher"

    print(f"\n==================================================")
    print(f" 🎨 Generating Android Mipmaps ({mode_name})")
    print(f" Source: {source_path} ({source_img.width}x{source_img.height} px)")
    print(f" Target Directory: {output_dir}")
    print(f"==================================================")

    for folder_name, (w, h) in size_map.items():
        folder_path = os.path.join(output_dir, folder_name)
        os.makedirs(folder_path, exist_ok=True)
        target_path = os.path.join(folder_path, filename)

        # High-quality Lanczos resampling
        resized_img = source_img.resize((w, h), Image.Resampling.LANCZOS)
        resized_img.save(target_path, 'PNG', optimize=True)
        print(f"  [✓] {folder_name}/{filename} ➔ {w}x{h} px")

    print(f"\n🎉 Successfully generated all mipmap densities!")
    return True

def main():
    parser = argparse.ArgumentParser(description="Android Mipmap Icon Resizer Pipeline")
    parser.add_argument("--source", type=str, default="assets/icon.png", help="Path to 1024x1024 source PNG icon")
    parser.add_argument("--output", type=str, default="android/app/src/main/res", help="Output Android res/ directory")
    parser.add_argument("--adaptive", action="store_true", help="Generate adaptive icon foregrounds (108dp base)")
    parser.add_argument("--name", type=str, default="ic_launcher.png", help="Output PNG filename")

    args = parser.parse_args()
    generate_mipmaps(args.source, args.output, is_adaptive_foreground=args.adaptive, filename=args.name)

if __name__ == "__main__":
    main()
