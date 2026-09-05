#!/usr/bin/env python3
"""Turn the store pipeline's plain phone captures into the site's screenshots.

    python3 tools/make-site-shots.py            # every locale in SHOT_LOCALE
    python3 tools/make-site-shots.py de fr      # just these site locales
    python3 tools/make-site-shots.py --check    # measure, write nothing

Reads  ../store-shots/raw/<store-locale>/<01-dashboard…07-family>.png
Writes static/assets/img/shots/<site-locale>/<shot-*>.webp   (640 px wide)

The output is **committed**. The build must succeed on a machine that has no
store-shots/ sibling, so this script runs by hand when the captures change and
never as part of `npm run build`.

Pillow is the only dependency, and it is the one ../store-shots/ already needs
(`pip3 install pillow`). This is Python rather than part of build.mjs because
Node's standard library has no image support and this repo has no npm
dependencies — see README.

The locale map and the raw-name → site-name map are read out of site.config.mjs
so there is exactly one copy of each. If the regex stops matching, the script
fails loudly rather than quietly converting nothing.
"""

import argparse
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is missing.  pip3 install pillow")

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "site.config.mjs"
RAW = ROOT.parent / "store-shots" / "raw"
OUT = ROOT / "static" / "assets" / "img" / "shots"

WIDTH = 640            # the intrinsic width the site has always used
QUALITY = 80           # webp
BUDGET = 45 * 1024     # per-file size budget


def js_map(name):
    """Pull `export const <name> = { … };` out of site.config.mjs.

    A deliberately small parser: both maps it reads are flat string→string
    literals, and anything else in that shape is a mistake worth failing on.
    """
    src = CONFIG.read_text(encoding="utf-8")
    m = re.search(r"export const %s = \{(.*?)\n\};" % name, src, re.S)
    if not m:
        sys.exit(f"{CONFIG.name}: no `export const {name} = {{ … }};` — the map "
                 f"moved or changed shape, and this script reads it from there.")
    body = re.sub(r"//[^\n]*", "", m.group(1))          # drop line comments
    pairs = re.findall(r"['\"]?([\w-]+)['\"]?\s*:\s*'([^']+)'", body)
    if not pairs:
        sys.exit(f"{CONFIG.name}: {name} parsed to nothing.")
    return dict(pairs)


def flatten(im):
    """The captures are RGBA and opaque; every other image on the site is RGB.
    Dropping the dead alpha channel saves a few KB and keeps the set uniform.
    If a capture ever really is transparent, composite it on white rather than
    letting the page colour show through the middle of a phone screen."""
    if im.mode not in ("RGBA", "LA", "P"):
        return im.convert("RGB")
    im = im.convert("RGBA")
    bg = Image.new("RGB", im.size, (255, 255, 255))
    bg.paste(im, mask=im.getchannel("A"))
    return bg


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("locales", nargs="*", help="site locales; default: all mapped")
    ap.add_argument("--check", action="store_true", help="measure, write nothing")
    args = ap.parse_args()

    shot_locale = js_map("SHOT_LOCALE")
    sources = js_map("SHOT_SOURCES")

    wanted = args.locales or list(shot_locale)
    unknown = [loc for loc in wanted if loc not in shot_locale]
    if unknown:
        sys.exit(f"not in SHOT_LOCALE: {', '.join(unknown)}\n"
                 f"mapped locales: {', '.join(shot_locale)}")

    if not RAW.is_dir():
        sys.exit(f"{RAW} does not exist. This script needs the store-shots "
                 f"sibling checkout; the site build does not.")

    rows, sizes, problems = [], set(), []
    for loc in wanted:
        src_dir = RAW / shot_locale[loc]
        if not src_dir.is_dir():
            problems.append(f"{loc}: {src_dir} is missing")
            continue
        dest_dir = OUT / loc
        if not args.check:
            dest_dir.mkdir(parents=True, exist_ok=True)
        for raw, name in sources.items():
            src = src_dir / f"{raw}.png"
            if not src.is_file():
                problems.append(f"{loc}: {src} is missing")
                continue
            with Image.open(src) as im:
                height = round(im.height * WIDTH / im.width)
                out = flatten(im).resize((WIDTH, height), Image.LANCZOS)
            sizes.add((WIDTH, height))
            dest = dest_dir / f"{name}.webp"
            if not args.check:
                out.save(dest, "WEBP", quality=QUALITY, method=6)
            kb = dest.stat().st_size / 1024 if dest.is_file() else 0.0
            rows.append((loc, name, f"{WIDTH}x{height}", kb))

    if rows:
        print(f"{'locale':<8} {'file':<16} {'intrinsic':<11} {'size':>8}")
        print("-" * 46)
        over = 0
        for loc, name, dim, kb in rows:
            flag = "  ← over budget" if kb * 1024 > BUDGET else ""
            over += bool(flag)
            print(f"{loc:<8} {name:<16} {dim:<11} {kb:7.1f}K{flag}")
        print("-" * 46)
        every = [kb for *_, kb in rows]
        print(f"{len(rows)} files · {sum(every):.0f}K total · "
              f"largest {max(every):.1f}K · budget {BUDGET / 1024:.0f}K each")
        if over:
            print(f"⚠ {over} file(s) over budget — lower QUALITY or WIDTH.")
        print(f"\nIntrinsic size produced: "
              f"{', '.join(f'{w}x{h}' for w, h in sorted(sizes))}")
        if len(sizes) > 1:
            print("⚠ the raw captures are not all one aspect ratio; "
                  "IMAGE_SIZES['shot-'] can only carry one.")
        print("→ site.config.mjs IMAGE_SIZES['shot-'] must say exactly that.")

    if problems:
        print("\n" + "\n".join(problems), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
