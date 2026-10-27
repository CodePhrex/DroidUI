#!/usr/bin/env python3
"""
Google Play Store Feature Graphic & Screenshot Generator
Generates:
1. Feature Graphic (1024x500 px) banner with modern gradients and typography.
2. Screenshot Device Framing Overlays (1080x1920 px) for Play Store listing previews.
"""

import os
import argparse
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_feature_graphic(title="DroidUI Mobile Studio", subtitle="Next-Gen Mobile UI & Code Exporter", output_path="feature_graphic.png"):
    width, height = 1024, 500
    img = Image.new("RGBA", (width, height), (15, 23, 42, 255)) # Dark slate bg #0f172a
    draw = ImageDraw.Draw(img)

    # Draw diagonal background gradient glow
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([500, -100, 1100, 500], fill=(59, 130, 246, 60)) # Blue glow
    glow_draw.ellipse([-100, 200, 400, 700], fill=(139, 92, 246, 50)) # Purple glow
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Decorative background grid lines
    grid_color = (255, 255, 255, 12)
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)

    # App Badge Container
    badge_x, badge_y, badge_w, badge_h = 60, 100, 160, 36
    draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + badge_h], radius=18, fill=(59, 130, 246, 40), outline=(59, 130, 246, 180), width=1)
    draw.text((badge_x + 16, badge_y + 10), "MOBILE STUDIO", fill=(56, 189, 248, 255))

    # Main Title & Subtitle
    draw.text((60, 160), title, fill=(248, 250, 252, 255))
    draw.text((60, 220), subtitle, fill=(148, 163, 184, 255))

    # Feature Bullets
    bullets = [
        "⚡ React Native (.tsx) & Jetpack Compose (.kt)",
        "💾 Native .dui Project File Storage",
        "📐 Custom SVG Vector Design Studio",
        "🛡️ OWASP MASVS & Target SDK 35 Compliant"
    ]
    y_pos = 280
    for b in bullets:
        draw.text((60, y_pos), b, fill=(203, 213, 225, 255))
        y_pos += 34

    # Simulated Mockup Device Frame on Right Side
    frame_x, frame_y, frame_w, frame_h = 660, 60, 300, 380
    draw.rounded_rectangle([frame_x, frame_y, frame_x + frame_w, frame_y + frame_h], radius=24, fill=(30, 41, 59, 255), outline=(71, 85, 105, 255), width=3)
    # Notch
    draw.rounded_rectangle([frame_x + 110, frame_y + 12, frame_x + 190, frame_y + 20], radius=4, fill=(71, 85, 105, 255))
    # Simulated UI Card Elements
    draw.rounded_rectangle([frame_x + 20, frame_y + 40, frame_x + frame_w - 20, frame_y + 120], radius=12, fill=(15, 23, 42, 255), outline=(59, 130, 246, 100), width=1)
    draw.text((frame_x + 36, frame_y + 60), "Order Summary", fill=(248, 250, 252, 255))
    draw.text((frame_x + 36, frame_y + 84), "$129.99 • Active .dui", fill=(16, 185, 129, 255))
    
    # CTA Button in Mockup
    draw.rounded_rectangle([frame_x + 20, frame_y + 140, frame_x + frame_w - 20, frame_y + 184], radius=8, fill=(37, 99, 235, 255))
    draw.text((frame_x + 80, frame_y + 154), "Checkout Now", fill=(255, 255, 255, 255))

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"  [✓] Feature Graphic created: {output_path} (1024x500 px)")

def create_screenshot_frame(headline="DESIGN MOBILE APPS IN MINUTES", screenshot_path=None, output_path="play_store_screenshot_1.png"):
    width, height = 1080, 1920
    img = Image.new("RGBA", (width, height), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)

    # Background Glow
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([100, 100, 980, 980], fill=(59, 130, 246, 40))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Headline Text
    draw.text((width // 2 - 280, 160), headline, fill=(248, 250, 252, 255))
    draw.text((width // 2 - 220, 220), "Export React Native & Kotlin Compose Code", fill=(56, 189, 248, 255))

    # Device Mockup Frame
    dev_x, dev_y, dev_w, dev_h = 140, 320, 800, 1500
    draw.rounded_rectangle([dev_x, dev_y, dev_x + dev_w, dev_y + dev_h], radius=48, fill=(30, 41, 59, 255), outline=(71, 85, 105, 255), width=6)
    # Notch
    draw.rounded_rectangle([dev_x + 300, dev_y + 20, dev_x + 500, dev_y + 36], radius=8, fill=(71, 85, 105, 255))

    # Inner Canvas Display
    canvas_rect = [dev_x + 24, dev_y + 60, dev_x + dev_w - 24, dev_y + dev_h - 24]
    draw.rounded_rectangle(canvas_rect, radius=32, fill=(15, 23, 42, 255))

    if screenshot_path and os.path.exists(screenshot_path):
        try:
            sc = Image.open(screenshot_path).convert("RGBA")
            sc = sc.resize((dev_w - 48, dev_h - 84), Image.Resampling.LANCZOS)
            img.paste(sc, (dev_x + 24, dev_y + 60), sc)
        except Exception as e:
            print(f"  [!] Failed to paste screenshot: {e}")

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"  [✓] Screenshot Frame created: {output_path} (1080x1920 px)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Google Play Store Feature Graphic & Screenshot Generator")
    parser.add_argument("--feature", action="store_true", help="Generate 1024x500 Feature Graphic")
    parser.add_argument("--screenshot", action="store_true", help="Generate 1080x1920 Screenshot Frame")
    parser.add_argument("--title", type=str, default="DroidUI Mobile Studio", help="App Title")
    parser.add_argument("--output-dir", type=str, default="/workspace/scratch/store_assets", help="Output directory")

    args = parser.parse_args()

    feat_path = os.path.join(args.output_dir, "feature_graphic_1024x500.png")
    sc_path = os.path.join(args.output_dir, "play_store_screenshot_1080x1920.png")

    print("==================================================")
    print(" 🎨 Google Play Store Graphics Generator")
    print("==================================================")

    create_feature_graphic(title=args.title, output_path=feat_path)
    create_screenshot_frame(headline="DESIGN & EXPORT MOBILE APPS", output_path=sc_path)

    print("\n🎉 Google Play Store graphics generated successfully!")
