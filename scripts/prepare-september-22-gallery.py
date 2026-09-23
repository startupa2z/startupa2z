"""Create resized, metadata-free copies; never modify source photographs."""
from pathlib import Path
import shutil
from PIL import Image, ImageOps

source = Path("/Users/satz/myfiles/startupa2z-event-gallery/e5-sept22")
target = Path(__file__).resolve().parents[1] / "backend/gallery_assets/2026-09-22"
photos = [
    "PXL_20260923_021537702.jpg",
    "PXL_20260923_005223122.jpg",
    "PXL_20260923_005339439.jpg",
    "PXL_20260923_005440976.jpg",
    "PXL_20260923_005421819.jpg",
    "PXL_20260923_011509074.jpg",
    "PXL_20260923_011704854.jpg",
    "PXL_20260923_012332255.jpg",
    "PXL_20260923_012355332.jpg",
    "PXL_20260923_015134060.jpg",
    "PXL_20260923_015618807.jpg",
    "PXL_20260923_020405903.jpg",
]

target.mkdir(parents=True, exist_ok=True)
for number, filename in enumerate(photos, 1):
    with Image.open(source / filename) as original:
        oriented = ImageOps.exif_transpose(original).convert("RGB")
        for suffix, width, quality in [("", 2000, 85), ("-thumb", 800, 80)]:
            resized = oriented.copy()
            resized.thumbnail((width, width), Image.Resampling.LANCZOS)
            clean = Image.new("RGB", resized.size)
            clean.paste(resized)
            output = target / f"event-05-{number:02d}-v1{suffix}.jpg"
            clean.save(output, "JPEG", quality=quality, optimize=True, progressive=True)
            preview = Path(__file__).resolve().parents[1] / "frontend/public/static/images/events/2026-09-22" / output.name
            preview.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(output, preview)
            print(f"{output.name}: {output.stat().st_size:,} bytes, {clean.size}")
