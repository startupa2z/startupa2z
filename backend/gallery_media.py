"""Install bundled, optimized gallery files into the persistent image volume.

Existing files are deliberately preserved. New revisions use new filenames.
"""
from pathlib import Path
import shutil


def install_gallery_media(source: Path | None = None, destination: Path | None = None) -> int:
    root = Path(__file__).resolve().parent
    source = source or root / "gallery_assets"
    destination = destination or root / "static" / "images" / "events"
    copied = 0
    for file in sorted(source.rglob("*.jpg")):
        target = destination / file.relative_to(source)
        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            with target.open("xb") as output, file.open("rb") as original:
                shutil.copyfileobj(original, output)
            copied += 1
        except FileExistsError:
            pass
    return copied
