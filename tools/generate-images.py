"""SHEIN with Rejo — original campaign image generator

Generates the site's visual system: an original, coherent "warm studio editorial"
campaign (drapes, silhouettes, tags, cards, packaging) in the brand palette.
No photography is simulated or claimed to be real people/products.

Replace any generated file with client photography by dropping a new file over
the same name (see frontend/src/data/images.js).
"""

import math, random, os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'images')

def pal():
    return dict(cream=(250,247,241), linen=(243,238,229), sand=(231,223,210),
                taupe=(201,187,170), clay=(166,123,91), clayd=(133,89,60),
                ink=(33,29,25), char=(55,49,43))

FONT = dict(
    serif='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf',
    serifb='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',
    sans='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    sansb='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
)

def f(name, size):
    return ImageFont.truetype(FONT[name], size)

def tracked(draw, xy, text, font, fill, tracking=6):
    """Uppercase label with letter spacing (editorial kicker)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textbbox((0,0), ch, font=font)[2] + tracking

def new_canvas(w, h, top, bottom, vertical=True):
    img = Image.new('RGB', (w, h), top)
    d = ImageDraw.Draw(img)
    steps = 160
    for i in range(steps):
        t = i / (steps - 1)
        col = tuple(int(top[j] + (bottom[j] - top[j]) * t) for j in range(3))
        if vertical:
            y0 = int(h * i / steps)
            d.line([(0, y0), (w, y0)], fill=col)
        else:
            x0 = int(w * i / steps)
            d.line([(x0, 0), (x0, h)], fill=col)
    return img

def grain(img, amount=18):
    noise = Image.effect_noise(img.size, amount).convert('L')
    noise = noise.point(lambda v: 128 + (v - 128) * 0.5)
    tinted = Image.merge('RGB', (noise, noise, noise))
    return Image.blend(img, tinted, 0.12)

def vignette(img, strength=90):
    w, h = img.size
    mask = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse([-w*0.25, -h*0.25, w*1.25, h*1.25], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(w // 3))
    black = Image.new('RGB', (w, h), (10, 8, 6))
    return Image.composite(img, black, mask.point(lambda v: 255 - int((255-v) * strength / 255))).convert('RGB')

def soft_ellipse(img, cx, cy, rx, ry, color, alpha=60, blur=None):
    base = img.convert('RGBA')
    layer = Image.new('RGBA', base.size, (0,0,0,0))
    d = ImageDraw.Draw(layer)
    d.ellipse([cx-rx, cy-ry, cx+rx, cy+ry], fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(blur or max(rx, ry)//4))
    return Image.alpha_composite(base, layer)

def bezier(pts, samples=60):
    """Cubic bezier through 4 control points -> list of (x, y)."""
    def cubic(p, t):
        x = (1-t)**3*p[0][0] + 3*(1-t)**2*t*p[1][0] + 3*(1-t)*t**2*p[2][0] + t**3*p[3][0]
        y = (1-t)**3*p[0][1] + 3*(1-t)**2*t*p[1][1] + 3*(1-t)*t**2*p[2][1] + t**3*p[3][1]
        return (x, y)
    return [cubic(pts, t) for t in (i/(samples-1) for i in range(samples))]

def wavy_bez(x0, x1, y_base, amp, freq, phase=0.0):
    pts = [
        (x0, y_base),
        (x0 + (x1-x0)*0.33, y_base - amp),
        (x0 + (x1-x0)*0.66, y_base + amp),
        (x1, y_base + amp*math.sin(freq + phase)),
    ]
    return bezier(pts)

def ribbands(img, base_row, offsets, colors, widths, seed=7):
    """Overlapping horizontal fabric ribbons across the canvas."""
    rnd = random.Random(seed)
    w, h = img.size
    for row, off, color, width in zip(base_row, offsets, colors, widths):
        y0 = row + off
        a = wavy_bez(-w*0.05, w*1.05, y0, width*0.9, rnd.uniform(0, 2*math.pi))
        b = wavy_bez(-w*0.05, w*1.05, y0 + width, width*0.9, rnd.uniform(0, 2*math.pi))
    base = img.convert('RGBA')
    layer = Image.new('RGBA', base.size, (0,0,0,0))
    d = ImageDraw.Draw(layer)
    d.polygon(a + b[::-1], fill=color + (235,))
    layer = layer.filter(ImageFilter.GaussianBlur(6))
    base = Image.alpha_composite(base, layer)
    return base

def silhouette_dress(d, cx, cy, scale, color):
    """Minimal A-line dress silhouette."""
    pts = [
        (cx - 14*scale, cy - 95*scale), (cx - 6*scale, cy - 78*scale),
        (cx - 20*scale, cy - 40*scale), (cx - 58*scale, cy + 70*scale),
        (cx - 34*scale, cy + 78*scale), (cx - 8*scale, cy + 6*scale),
        (cx + 8*scale, cy + 6*scale), (cx + 34*scale, cy + 78*scale),
        (cx + 58*scale, cy + 70*scale), (cx + 20*scale, cy - 40*scale),
        (cx + 6*scale, cy - 78*scale), (cx + 14*scale, cy - 95*scale),
    ]
    d.polygon(pts, fill=color)
    d.arc([cx-8*scale, cy-98*scale, cx+8*scale, cy-70*scale], 180, 360, fill=color, width=max(2,int(5*scale)))

def silhouette_hanger(d, cx, cy, scale, color):
    d.arc([cx-40*scale, cy-18*scale, cx+40*scale, cy+50*scale], 0, 180, fill=color, width=max(2,int(7*scale)))
    d.line([(cx, cy-18*scale), (cx, cy-52*scale)], fill=color, width=max(2,int(5*scale)))
    d.line([(cx-20*scale, cy-64*scale), (cx+20*scale, cy-64*scale)], fill=color, width=max(2,int(5*scale)))
    d.ellipse([cx-7*scale, cy-64*scale, cx+7*scale, cy-52*scale], fill=None, outline=color, width=max(2,int(4*scale)))

def silhouette_tote(d, cx, cy, w, h, color, handles=True):
    d.rounded_rectangle([cx-w/2, cy-h/2, cx+w/2, cy+h/2], radius=w*0.06, fill=color)
    if handles:
        d.arc([cx-w*0.22, cy-h/2 - 16, cx+w*0.22, cy-h/2 + 30], 0, 180, fill=pal()['cream'], width=6)

def silhouette_shoe(d, cx, cy, scale, color):
    # simplified elegant heel
    pts = [
        (cx - 56*scale, cy + 16*scale), (cx - 30*scale, cy), (cx + 14*scale, cy - 4*scale),
        (cx + 58*scale, cy - 26*scale), (cx + 52*scale, cy - 10*scale), (cx + 6*scale, cy + 12*scale),
        (cx - 10*scale, cy + 30*scale),
    ]
    d.polygon(pts, fill=color)
    d.line([(cx - 18*scale, cy + 26*scale), (cx - 52*scale, cy + 62*scale)], fill=color, width=max(3, int(8*scale)))

def looksave(img, name, quality=84):
    os.makedirs(OUT, exist_ok=True)
    img = vignette(img)
    img.save(os.path.join(OUT, name), 'WEBP', quality=quality, method=6)
    print('wrote', name, img.size)

def base_compose(w, h, top, bottom, vertical=True):
    img = new_canvas(w, h, top, bottom, vertical)
    return grain(img)

# ---------- shared drawing helpers ----------

def look_card(w, h, swatch_top, swatch_bottom, label, kicker, bg='cream'):
    """A minimal fashion 'look card' with a fabric-tone swatch and label."""
    card = new_canvas(w, h, pal()[bg], pal()['linen'], True).convert('RGBA')
    sw = new_canvas(w, int(h*0.55), pal()[swatch_top], pal()[swatch_bottom], True).convert('RGBA')
    card.alpha_composite(sw, (0, 0))
    d = ImageDraw.Draw(card)
    d.line([(0, int(h*0.55)), (w, int(h*0.55))], fill=(0,0,0,0))
    d.line([(w*0.08, int(h*0.63)), (w*0.92, int(h*0.63))], fill=pal()['taupe'], width=2)
    d.text((w*0.08, h*0.70), label, font=f('serif', int(h*0.10)), fill=pal()['ink'])
    tracked(d, (int(w*0.08), int(h*0.84)), kicker.upper(), f('sans', int(h*0.055)), pal()['char'], tracking=int(h*0.012))
    return card

def phone(w, h, screen, base=pal()['ink']):
    """Minimal phone frame with a screen image inside."""
    frame = Image.new('RGBA', (w, h), (0,0,0,0))
    d = ImageDraw.Draw(frame)
    r = w*0.12
    d.rounded_rectangle([0, 0, w, h], radius=r, fill=base)
    inner_pad = int(w*0.05)
    sw, sh = w - 2*inner_pad, int(h*0.86)
    inner = screen.convert('RGB').resize((sw, sh), Image.LANCZOS)
    mask = Image.new('L', (sw, sh), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, sw, sh], radius=int(w*0.05), fill=255)
    frame.paste(inner, (inner_pad, int(h*0.07)), mask=mask)
    d = ImageDraw.Draw(frame)
    d.rounded_rectangle([w*0.36, int(h*0.02), w*0.64, int(h*0.05)], radius=int(h*0.02), fill=base)
    return frame

def gift_box(w, h, base=pal()['clay'], band=pal()['cream'], rib=pal()['clayd']):
    img = Image.new('RGBA', (w, h), (0,0,0,0))
    d = ImageDraw.Draw(img)
    body = max(int(h*0.62), w*0.52)
    bx, by = w/2 - body/2, h - body - h*0.06
    r = w*0.03
    d.rounded_rectangle([bx, by, bx+body, by+body], radius=r, fill=base)
    lid_h = body*0.22
    d.rounded_rectangle([bx-w*0.03, by-lid_h*0.42, bx+body+w*0.03, by+lid_h*0.72], radius=r, fill=pal()['taupe'])
    d.rectangle([bx, by-2, bx+body, by+10], fill=pal()['sand'])
    # ribbon cross
    cx = bx + body/2
    d.line([(cx, by-2), (cx, by+body)], fill=rib, width=int(w*0.025))
    d.line([(bx, by + body*0.44), (bx+body, by + body*0.44)], fill=rib, width=int(w*0.025))
    d.arc([cx-body*0.09, by-lid_h-6, cx, by-4], 0, 180, fill=rib, width=int(w*0.02))
    d.arc([cx, by-lid_h-6, cx+body*0.09, by-4], 0, 180, fill=rib, width=int(w*0.02))
    return img

def hang_tag(w, h, color=pal()['cream'], text='RESERVED'):
    img = Image.new('RGBA', (w, h), (0,0,0,0))
    d = ImageDraw.Draw(img)
    r = int(w*0.14)
    d.rounded_rectangle([0, int(h*0.12), w, h], radius=r, fill=color)
    d.ellipse([w*0.38, int(h*0.30), w*0.62, int(h*0.54)], outline=pal()['clayd'], width=3)
    tracked(d, (int(w*0.12), int(h*0.58)), text, f('sansb', int(w*0.09)), pal()['clayd'], tracking=int(w*0.02))
    return img

def weave_tile(w, h, base, line, gap):
    img = new_canvas(w, h, pal()[base], pal()[line], True)
    d = ImageDraw.Draw(img)
    for i in range(0, w, gap):
        d.line([(i, 0), (i, h)], fill=pal()[line], width=2)
    for i in range(0, h, gap):
        d.line([(0, i), (w, i)], fill=pal()[line], width=2)
    return img

# ---------- compositions ----------

def hero_lookbook():
    w, h = 1600, 1000
    img = base_compose(w, h, pal()['linen'], pal()['cream'])
    img = soft_ellipse(img, int(w*0.72), int(h*0.88), int(w*0.34), int(h*0.14), (120, 100, 80), 40, 60)
    img = ribbands(img, [h*0.52, h*0.60, h*0.70, h*0.76], [0, -18, -34, -6],
                   [pal()['sand'], pal()['clay'], pal()['taupe'], pal()['clayd']], [16, 10, 12, 7], seed=3)
    img = img.convert('RGBA')
    # tilted look cards
    cards = [(1410, 430, 300, 400, 'clay', 'sand', 'The set', 'look 01'),
             (1100, 620, 250, 330, 'taupe', 'linen', 'The layer', 'look 02'),
             (1180, 230, 210, 280, 'ink', 'char', 'The finish', 'look 03')]
    for cx, cy, cw, ch, st, sb, lab, kick in cards:
        card = look_card(cw, ch, st, sb, lab, kick)
        card = card.rotate(random.Random(7).uniform(-3, 2), expand=False, resample=Image.BICUBIC)
        shadow = Image.new('RGBA', img.size, (0,0,0,0))
        ImageDraw.Draw(shadow).ellipse([cx-cw*0.55, cy+ch*0.42, cx+cw*0.55, cy+ch*0.62], fill=(33,29,25,70))
        shadow = shadow.filter(ImageFilter.GaussianBlur(22))
        img = Image.alpha_composite(img, shadow)
        img.alpha_composite(card, (int(cx-cw/2), int(cy-ch/2)))
    d = ImageDraw.Draw(img)
    tracked(d, (110, 820), 'A personal fashion service', f('sansb', 20), pal()['clayd'], tracking=4)
    return img.convert('RGB')

def hero_accessories():
    w, h = 1600, 1000
    img = base_compose(w, h, pal()['taupe'], pal()['clay'])
    img = soft_ellipse(img, int(w*0.66), int(h*0.78), int(w*0.22), int(h*0.10), (40, 30, 20), 55, 48)
    img = img.convert('RGBA')
    d = ImageDraw.Draw(img)
    cx, cy, s = int(w*0.66), int(h*0.60), 2.1
    # pearl chain
    center, rad, n = (cx, cy+40*s*0.35), 64*s, 14
    pts = []
    for i in range(n+1):
        t = i/n
        px = center[0] + rad*math.cos(math.pi*0.85 + t*math.pi*1.3)
        py = center[1] + rad*0.7*math.sin(math.pi*0.85 + t*math.pi*1.3) - rad*0.5
        pts.append((px, py))
    for i in range(len(pts)-1):
        d.line([pts[i], pts[i+1]], fill=pal()['cream'], width=3)
    for i in range(1, len(pts)-1, 2):
        d.ellipse([pts[i][0]-9, pts[i][1]-9, pts[i][0]+9, pts[i][1]+9], fill=pal()['cream'], outline=pal()['sand'], width=1)
    silhouette_tote(d, cx+20, cy+95, 300, 230, pal()['ink'])
    img = img.filter(ImageFilter.GaussianBlur(0))
    d = ImageDraw.Draw(img)
    tracked(d, (110, 180), 'The everyday edit', f('serif', 54), pal()['ink'], tracking=2)
    tracked(d, (114, 250), 'pieces you love, delivered', f('sans', 24), pal()['char'], tracking=3)
    return img.convert('RGB')

def hero_discover():
    w, h = 1600, 1000
    img = base_compose(w, h, pal()['cream'], pal()['sand'])
    img = soft_ellipse(img, int(w*0.58), int(h*0.80), int(w*0.28), int(h*0.13), (130, 110, 88), 42, 60)
    scr = base_compose(620, 800, pal()['linen'], pal()['cream'])
    sdc = ImageDraw.Draw(scr)
    sdc.rounded_rectangle([40, 300, 580, 640], radius=18, fill=pal()['cream'] if False else pal()['cream'], outline=pal()['sand'])
    sdc.rounded_rectangle([70, 330, 300, 560], radius=14, fill=pal()['clay'])
    sdc.rounded_rectangle([320, 330, 550, 470], radius=14, fill=pal()['taupe'])
    sdc.rounded_rectangle([320, 500, 550, 560], radius=10, fill=pal()['sand'])
    sdc.ellipse([470, 360, 530, 420], fill=(210, 120, 120))
    img = img.convert('RGBA')
    ph = phone(680, 880, scr, base=pal()['ink'])
    ph = ph.rotate(3, expand=False, resample=Image.BICUBIC)
    img.alpha_composite(ph, (int(w*0.52), int(h*0.10)))
    # tag
    tag = hang_tag(150, 300, pal()['cream'], 'SAVED')
    img.alpha_composite(tag.rotate(-8, resample=Image.BICUBIC), (int(w*0.40), int(h*0.16)))
    d = ImageDraw.Draw(img)
    tracked(d, (110, 150), 'You found it.', f('serif', 64), pal()['ink'], tracking=2)
    tracked(d, (114, 230), 'now send it to rejo.', f('serif', 42), pal()['clayd'], tracking=2)
    return img.convert('RGB')

def hero_arrival():
    w, h = 1600, 1000
    img = base_compose(w, h, pal()['char'], pal()['ink'])
    img = soft_ellipse(img, int(w*0.66), int(h*0.62), int(w*0.26), int(h*0.22), (190, 150, 110), 46, 90)
    img = img.convert('RGBA')
    box = gift_box(520, 420)
    img.alpha_composite(box, (int(w*0.52), int(h*0.36)))
    label = look_card(240, 150, 'linen', 'cream', 'For you', 'with care')
    img.alpha_composite(label, (int(w*0.66), int(h*0.28)))
    d = ImageDraw.Draw(img)
    tracked(d, (110, 170), 'It is on its way.', f('serif', 60), pal()['cream'], tracking=2)
    tracked(d, (114, 245), 'your order arrives in harare', f('sans', 22), pal()['taupe'], tracking=3)
    return img.convert('RGB')

def rail_drape():
    img = base_compose(644, 860, pal()['linen'], pal()['sand'])
    img = ribbands(img, [500, 560, 640, 700], [0, -14, -30, -4],
                   [pal()['clay'], pal()['taupe'], pal()['sand'], pal()['clayd']], [18, 12, 14, 8], seed=4)
    return img

def rail_bag():
    img = base_compose(644, 860, pal()['taupe'], pal()['sand'])
    img = soft_ellipse(img, 322, 700, 240, 60, (60, 50, 38), 50, 30)
    d = ImageDraw.Draw(img)
    silhouette_tote(d, 330, 520, 300, 380, pal()['ink'])
    return img

def rail_dress():
    img = base_compose(644, 860, pal()['cream'], pal()['linen'])
    d = ImageDraw.Draw(img)
    silhouette_hanger(d, 330, 260, 1.15, pal()['ink'])
    silhouette_dress(d, 330, 520, 1.05, pal()['clayd'])
    tracked(d, (120, 770), 'the daily edit', f('sansb', 22), pal()['clayd'], tracking=6)
    return img

def rail_shoes():
    img = base_compose(760, 640, pal()['sand'], pal()['cream'])
    img = soft_ellipse(img, 260, 500, 180, 50, (90, 75, 58), 45, 26)
    img = soft_ellipse(img, 520, 500, 180, 50, (90, 75, 58), 45, 26)
    d = ImageDraw.Draw(img)
    silhouette_shoe(d, 300, 430, 1.0, pal()['clayd'])
    silhouette_shoe(d, 560, 430, 1.0, pal()['ink'])
    return img

def rail_knit():
    img = new_canvas(640, 640, pal()['clay'], pal()['clayd'], True)
    d = ImageDraw.Draw(img)
    random.seed(11)
    for i in range(26):
        y = 40 + i*22
        d.line([(0, y), (640, y)], fill=pal()['cream'], width=4)
        d.line([(0, y+9), (640, y+9)], fill=(0,0,0,0), width=0)
        for x in range(0, 660, 40):
            d.arc([x, y, x+30, y+22], 0, 360, fill=pal()['cream'], width=4)
    return grain(img)

def rail_tag():
    img = base_compose(644, 860, pal()['cream'], pal()['linen'])
    d = ImageDraw.Draw(img)
    silhouette_hanger(d, 330, 210, 1.0, pal()['ink'])
    tag = hang_tag(230, 400, pal()['cream'], 'S · M · L')
    img = img.convert('RGBA'); img.alpha_composite(tag, (210, 330))
    d = ImageDraw.Draw(img)
    for i, chip in enumerate(['ONE SIZE', 'FITS ALL', 'CUSTOM']):
        tracked(d, (120 + i*150, 760), chip, f('sansb', 16), pal()['clayd'], tracking=4)
    return img.convert('RGB')

def rail_totes():
    img = base_compose(820, 620, pal()['linen'], pal()['cream'])
    img = soft_ellipse(img, 260, 480, 200, 50, (80, 66, 50), 46, 26)
    img = soft_ellipse(img, 580, 460, 150, 45, (80, 66, 50), 44, 24)
    d = ImageDraw.Draw(img)
    silhouette_tote(d, 260, 380, 260, 320, pal()['clayd'])
    silhouette_tote(d, 590, 380, 180, 230, pal()['ink'])
    return img

def rail_weave():
    return grain(weave_tile(640, 640, 'cream', 'taupe', 26))

def how_find():
    w, h = 800, 1000
    img = base_compose(w, h, pal()['cream'], pal()['linen'])
    scr = base_compose(560, 700, pal()['linen'], pal()['cream'])
    sdc = ImageDraw.Draw(scr)
    sdc.rounded_rectangle([30, 220, 530, 520], radius=16, fill=pal()['cream'], outline=pal()['sand'])
    sdc.rounded_rectangle([60, 250, 280, 480], radius=12, fill=pal()['clay'])
    sdc.rounded_rectangle([300, 250, 500, 380], radius=12, fill=pal()['taupe'])
    sdc.ellipse([440, 380, 500, 440], fill=(208, 120, 120))
    img = img.convert('RGBA')
    ph = phone(560, 720, scr, base=pal()['ink'])
    img.alpha_composite(ph.rotate(-2, resample=Image.BICUBIC), (120, 170))
    d = ImageDraw.Draw(img)
    tracked(d, (70, 80), 'BROWSE SHEIN', f('sansb', 30), pal()['clayd'], tracking=8)
    tracked(d, (72, 130), 'find something you love', f('serif', 34), pal()['ink'], tracking=2)
    tracked(d, (70, 940), 'no account needed, just looking', f('sans', 22), pal()['char'], tracking=4)
    return img.convert('RGB')

def how_send():
    w, h = 800, 1000
    img = base_compose(w, h, pal()['linen'], pal()['sand'])
    img = img.convert('RGBA')
    card = look_card(420, 300, 'clay', 'sand', 'My find', 'link + shot')
    card = card.rotate(-4, resample=Image.BICUBIC)
    img.alpha_composite(card, (150, 300))
    d = ImageDraw.Draw(img)
    # send arrow
    for i in range(1, 8):
        x0, x1 = 150, 620
        t = i/7
        yy = 660 + 40*math.sin(t*math.pi)
        d.ellipse([x0 + (x1-x0)*t - 4, yy - 4, x0 + (x1-x0)*t + 4, yy + 4], fill=pal()['clayd'])
    d.line([(150, 660), (620, 660)], fill=pal()['clayd'], width=3)
    d.polygon([(620, 660), (596, 642), (596, 678)], fill=pal()['clayd'])
    tracked(d, (70, 90), 'SEND IT', f('sansb', 30), pal()['clayd'], tracking=8)
    tracked(d, (72, 146), 'the link or a screenshot is enough', f('serif', 32), pal()['ink'], tracking=2)
    tracked(d, (70, 900), 'whatsapp-ready, zero fuss', f('sans', 22), pal()['char'], tracking=4)
    return img.convert('RGB')

def how_check():
    w, h = 800, 1000
    img = base_compose(w, h, pal()['cream'], pal()['sand'])
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([180, 260, 620, 700], radius=20, fill=pal()['cream'], outline=pal()['taupe'], width=3)
    d.rounded_rectangle([210, 300, 350, 420], radius=12, fill=pal()['clay'])
    d.rounded_rectangle([390, 300, 480, 380], radius=12, fill=pal()['taupe'])
    d.rounded_rectangle([210, 440, 520, 520], radius=12, fill=pal()['linen'])
    d.ellipse([560, 560, 700, 700], fill=pal()['clayd'])
    d.line([(590, 630), (630, 668), (688, 590)], fill=pal()['cream'], width=14)
    d.ellipse([550, 550, 710, 710], outline=pal()['clayd'], width=8)
    tracked(d, (70, 90), 'WE CHECK IT', f('sansb', 30), pal()['clayd'], tracking=8)
    tracked(d, (72, 150), 'rejo reviews your request', f('serif', 34), pal()['ink'], tracking=2)
    tracked(d, (70, 900), 'size, colour, availability confirmed', f('sans', 22), pal()['char'], tracking=4)
    return img

def how_order():
    w, h = 800, 1000
    img = base_compose(w, h, pal()['char'], pal()['ink'])
    img = soft_ellipse(img, 400, 560, 300, 200, (190, 150, 110), 40, 80)
    img = img.convert('RGBA')
    box = gift_box(430, 350)
    img.alpha_composite(box, (185, 430))
    tag = hang_tag(160, 300, pal()['cream'], 'ORDERED')
    img.alpha_composite(tag.rotate(8, resample=Image.BICUBIC), (430, 560))
    d = ImageDraw.Draw(img)
    tracked(d, (70, 90), 'WE PLACE IT', f('sansb', 30), pal()['taupe'], tracking=8)
    tracked(d, (72, 150), 'into the next 3-day cycle', f('serif', 34), pal()['cream'], tracking=2)
    tracked(d, (70, 900), 'grouped with other requests', f('sans', 22), pal()['taupe'], tracking=4)
    return img.convert('RGB')

def how_receive():
    w, h = 800, 1000
    img = base_compose(w, h, pal()['clay'], pal()['clayd'])
    img = soft_ellipse(img, 520, 240, 320, 200, (255, 230, 170), 70, 60)
    d = ImageDraw.Draw(img)
    # door arch
    d.rounded_rectangle([180, 420, 560, 880], radius=180, fill=pal()['linen'], outline=pal()['sand'], width=6)
    d.rounded_rectangle([300, 560, 440, 880], radius=90, fill=pal()['ink'])
    d.ellipse([300+2, 720-8, 440-2, 880], fill=pal()['ink'])
    # welcome mat
    d.arc([520-110, 850-70, 520+110, 850+70], 0, 180, fill=pal()['ink'], width=10)
    d.rounded_rectangle([520-95, 900, 520+95, 940], radius=10, fill=pal()['char'])
    box = gift_box(230, 190)
    img = img.convert('RGBA'); img.alpha_composite(box, (250, 700))
    d = ImageDraw.Draw(img)
    tracked(d, (70, 90), 'YOU RECEIVE IT', f('sansb', 30), pal()['cream'], tracking=8)
    tracked(d, (72, 150), 'free delivery in harare', f('serif', 34), pal()['cream'], tracking=2)
    tracked(d, (70, 940), 'tracked until it is at your door', f('sans', 22), pal()['cream'], tracking=4)
    return img.convert('RGB')

def about_large():
    w, h = 1400, 1050
    img = base_compose(w, h, pal()['linen'], pal()['cream'])
    img = ribbands(img, [h*0.46, h*0.56, h*0.66, h*0.74, h*0.82], [0, -22, -44, -8, -30],
                   [pal()['sand'], pal()['clay'], pal()['taupe'], pal()['clayd'], pal()['cream']], [18, 12, 14, 8, 16], seed=21)
    img = img.convert('RGBA')
    card = look_card(300, 240, 'linen', 'cream', 'Made in Harare', 'with care')
    img.alpha_composite(card.rotate(3, resample=Image.BICUBIC), (int(w*0.62), int(h*0.60)))
    card2 = look_card(240, 190, 'ink', 'char', 'Since day one', 'personal')
    img.alpha_composite(card2.rotate(-3, resample=Image.BICUBIC), (int(w*0.12), int(h*0.58)))
    d = ImageDraw.Draw(img)
    tracked(d, (int(w*0.08), int(h*0.82)), 'A small service, a big difference', f('serif', 40), pal()['ink'], tracking=2)
    return img.convert('RGB')

def about_secondary():
    img = base_compose(900, 1200, pal()['linen'], pal()['cream'])
    img = ribbands(img, [300, 420, 540, 660, 780, 900], [0, -26, -52, -16, -70, -8],
                   [pal()['sand'], pal()['clay'], pal()['taupe'], pal()['clayd'], pal()['cream'], pal()['clay']], [22, 14, 16, 10, 20, 9], seed=33)
    d = ImageDraw.Draw(img)
    for i, (cx, cy, r) in enumerate([(450, 170, 54), (320, 250, 34), (580, 250, 26)]):
        d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=pal()['clayd'] if i == 0 else pal()['taupe'], outline=pal()['cream'], width=4)
    tracked(d, (70, 1120), 'made to be replaced by real photography', f('sansb', 18), pal()['clayd'], tracking=4)
    return img

def order_side():
    w, h = 900, 1200
    img = base_compose(w, h, pal()['linen'], pal()['cream'])
    img = soft_ellipse(img, 660, 300, 260, 170, (200, 175, 150), 40, 60)
    img = img.convert('RGBA')
    card = look_card(380, 300, 'clay', 'sand', 'The one you saved', 'seen on shein')
    img.alpha_composite(card.rotate(-3, resample=Image.BICUBIC), (110, 220))
    img = ribbands(img.convert('RGB'), [700, 780, 860], [0, -18, -32],
                   [pal()['sand'], pal()['clay'], pal()['taupe']], [16, 11, 12], seed=5).convert('RGBA')
    d = ImageDraw.Draw(img)
    tracked(d, (70, 90), 'FOUND SOMETHING?', f('sansb', 30), pal()['clayd'], tracking=8)
    tracked(d, (72, 150), 'send it to rejo', f('serif', 44), pal()['ink'], tracking=2)
    # arrow
    d.line([(260, 1000), (640, 1000)], fill=pal()['clayd'], width=4)
    d.polygon([(640, 1000), (608, 978), (608, 1022)], fill=pal()['clayd'])
    tracked(d, (70, 1050), 'one link or one screenshot is enough', f('sans', 24), pal()['char'], tracking=4)
    return img.convert('RGB')

def cycle_image():
    w, h = 1600, 900
    img = base_compose(w, h, pal()['char'], pal()['ink'])
    d = ImageDraw.Draw(img)
    labels = [('REQUEST', pal()['sand']), ('REVIEW', pal()['sand']), ('CONFIRM', pal()['sand']), ('ORDER', pal()['sand']), ('DELIVERY', pal()['sand'])]
    t = 64
    tile = (w - t* (len(labels)+1)) / len(labels)
    y = h*0.32
    for i, (lab, col) in enumerate(labels):
        x = t + i*(tile + t)
        d.rounded_rectangle([x, y, x+tile, y+tile], radius=26, fill=pal()['clayd'] if i == 3 else pal()['clay'])
        icon = {0: 'dot', 1: 'eye', 2: 'tick', 3: 'box', 4: 'door'}[i]
        cx, cy = x + tile/2, y + tile/2
        cy_icon = cy - 18
        if icon == 'dot':
            d.ellipse([cx-18, cy_icon-18, cx+18, cy_icon+18], fill=pal()['cream'])
        elif icon == 'eye':
            d.arc([cx-22, cy_icon-14, cx+22, cy_icon+14], 0, 360, fill=pal()['cream'], width=5)
            d.ellipse([cx-6, cy_icon-6, cx+6, cy_icon+6], fill=pal()['cream'])
        elif icon == 'tick':
            d.line([(cx-16, cy_icon), (cx-4, cy_icon+14), (cx+20, cy_icon-14)], fill=pal()['cream'], width=7)
        elif icon == 'box':
            d.rounded_rectangle([cx-24, cy_icon-16, cx+24, cy_icon+20], radius=6, fill=pal()['sand'])
            d.line([(cx-24, cy_icon-4), (cx+24, cy_icon-4)], fill=pal()['clayd'], width=5)
        elif icon == 'door':
            d.rounded_rectangle([cx-22, cy_icon-20, cx-8, cy_icon+20], radius=8, fill=pal()['cream'])
            d.rectangle([cx-8, cy_icon-20, cx+26, cy_icon+10], fill=pal()['sand'])
        tracked(d, (cx - 60, y + tile*0.62), lab, f('sansb', 24), pal()['cream'], tracking=8)
        if i < len(labels) - 1:
            ax = x + tile + 12
            ay = y + tile/2
            d.line([(ax, ay), (ax + 2*t - 24, ay)], fill=pal()['taupe'], width=4)
            d.polygon([(ax + 2*t - 24, ay), (ax + 2*t - 40, ay - 12), (ax + 2*t - 40, ay + 12)], fill=pal()['taupe'])
    return img

def cta_band():
    w, h = 1600, 620
    img = base_compose(w, h, pal()['char'], pal()['ink'])
    img = soft_ellipse(img, int(w*0.2), int(h*0.5), int(w*0.25), int(h*0.7), (130, 100, 70), 34, 160)
    img = ribbands(img, [h*0.88], [0], [pal()['clay']], [22], seed=9)
    d = ImageDraw.Draw(img)
    return img

def main():
    jobs = [
        ('hero-lookbook.webp', hero_lookbook, 84),
        ('hero-accessories.webp', hero_accessories, 84),
        ('hero-discover.webp', hero_discover, 84),
        ('hero-arrival.webp', hero_arrival, 84),
        ('rail-drape.webp', rail_drape, 84),
        ('rail-bag.webp', rail_bag, 84),
        ('rail-dress.webp', rail_dress, 84),
        ('rail-shoes.webp', rail_shoes, 84),
        ('rail-knit.webp', rail_knit, 84),
        ('rail-tag.webp', rail_tag, 84),
        ('rail-totes.webp', rail_totes, 84),
        ('rail-weave.webp', rail_weave, 84),
        ('how-find.webp', how_find, 84),
        ('how-send.webp', how_send, 84),
        ('how-check.webp', how_check, 84),
        ('how-order.webp', how_order, 84),
        ('how-receive.webp', how_receive, 84),
        ('about-large.webp', about_large, 84),
        ('about-secondary.webp', about_secondary, 84),
        ('order-side.webp', order_side, 84),
        ('cycle.webp', cycle_image, 84),
        ('cta.webp', cta_band, 84),
    ]
    total = 0
    for name, fn, q in jobs:
        img = fn()
        looksave(img, name, q)
        total += os.path.getsize(os.path.join(OUT, name))
    print(f'\nGenerated {len(jobs)} images, total {total/1024:.0f} KB')

if __name__ == '__main__':
    main()
