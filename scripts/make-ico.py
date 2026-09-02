#!/usr/bin/env python3
"""Wraps favicon-32x32.png in an ICO container.

Vista-era ICO files may embed PNG data verbatim, so this is a 22-byte header
in front of the PNG the Swift renderer already produced — no image library
needed. Run via `npm run icons`.
"""
import struct
import sys
from pathlib import Path

src = Path(sys.argv[1] if len(sys.argv) > 1 else "assets/favicon-32x32.png")
dst = Path(sys.argv[2] if len(sys.argv) > 2 else "assets/favicon.ico")

png = src.read_bytes()
header = struct.pack("<HHH", 0, 1, 1)  # reserved, type=icon, one image
entry = struct.pack(
    "<BBBBHHII",
    32,        # width
    32,        # height
    0,         # palette size (0 = no palette)
    0,         # reserved
    1,         # colour planes
    32,        # bits per pixel
    len(png),  # size of the image data
    22,        # offset: 6-byte header + 16-byte entry
)
dst.write_bytes(header + entry + png)
print(f"wrote {dst} ({dst.stat().st_size} bytes)")
