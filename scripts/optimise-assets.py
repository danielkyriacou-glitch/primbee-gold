#!/usr/bin/env python3
"""Create 512x512 transparent WebP derivatives (requires Pillow)."""
from pathlib import Path
from PIL import Image
out=Path('assets/symbols'); out.mkdir(parents=True,exist_ok=True)
for src in Path('design-assets').glob('*.png'):
 im=Image.open(src).convert('RGBA'); im.thumbnail((480,480),Image.Resampling.LANCZOS)
 canvas=Image.new('RGBA',(512,512)); canvas.alpha_composite(im,((512-im.width)//2,(512-im.height)//2))
 canvas.save(out/(src.stem+'.webp'),'WEBP',lossless=False,quality=84,method=6)
