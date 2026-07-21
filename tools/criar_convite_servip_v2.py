from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r'C:\Users\LiPeX\Documents\Germano')
SERVIP = Path(r'C:\Users\LiPeX\AppData\Local\Temp\codex-clipboard-1b1658c6-6eba-4c11-b1c8-1e5f97e6b0dc.png')
MUNDO = ROOT / 'public' / 'logo_mundo_encantado_color.png'
OUTPUT = ROOT / 'convite_servip_mundo_encantado_v2.png'

W, H = 1080, 1350
TEAL = '#10A098'
TEAL_DARK = '#078B85'
PURPLE = '#602880'
PURPLE_DARK = '#45185F'
GREEN = '#62AC30'
CREAM = '#F8F5EE'
INK = '#29232D'
MUTED = '#5E5762'
WHITE = '#FFFFFF'
FONT_REG = r'C:\Windows\Fonts\arial.ttf'
FONT_BOLD = r'C:\Windows\Fonts\arialbd.ttf'


def ff(path, size):
    return ImageFont.truetype(path, size)


def trim_white(img, threshold=245):
    rgba = img.convert('RGBA')
    data = []
    for r, g, b, a in rgba.getdata():
        lo = min(r, g, b)
        if lo >= threshold:
            data.append((r, g, b, 0))
        elif lo > 218:
            data.append((r, g, b, int(a * (threshold-lo)/(threshold-218))))
        else:
            data.append((r, g, b, a))
    rgba.putdata(data)
    box = rgba.getbbox()
    return rgba.crop(box) if box else rgba


def fit(draw, text, width, start, minimum, bold=True):
    path = FONT_BOLD if bold else FONT_REG
    for size in range(start, minimum-1, -1):
        f = ff(path, size)
        if draw.textbbox((0, 0), text, font=f)[2] <= width:
            return f
    raise ValueError(text)


def centered(draw, text, y, font, fill, spacing=0):
    box = draw.textbbox((0, 0), text, font=font, spacing=spacing, align='center')
    draw.multiline_text(((W-(box[2]-box[0]))/2, y), text, font=font, fill=fill,
                        spacing=spacing, align='center')


def main():
    im = Image.new('RGB', (W, H), TEAL)
    d = ImageDraw.Draw(im)

    # Diagonais tonais inspiradas diretamente na referência vetorial.
    for x in range(-H, W+H, 74):
        d.line((x, 0, x-H, H), fill=TEAL_DARK, width=18)

    # Gestos orbitais grandes e parcialmente cortados: identidade sem poluição.
    d.ellipse((-360, 910, 420, 1690), fill=PURPLE_DARK)
    d.ellipse((-220, 1010, 315, 1545), fill=PURPLE)
    d.ellipse((-85, 1135, 125, 1345), fill=GREEN)
    d.arc((-430, 750, 660, 1780), 248, 354, fill=WHITE, width=3)
    d.arc((-385, 800, 610, 1725), 248, 350, fill=GREEN, width=9)

    # As duas assinaturas formam um único conjunto centralizado e alinhado.
    d.rounded_rectangle((150, 50, 930, 218), radius=62, fill=CREAM)
    mundo = Image.open(MUNDO).convert('RGBA')
    mundo.thumbnail((390, 145), Image.Resampling.LANCZOS)

    servip_source = Image.open(SERVIP)
    servip_source = servip_source.crop((0, 0, int(servip_source.width*.88), servip_source.height))
    servip = trim_white(servip_source)
    servip.thumbnail((170, 125), Image.Resampling.LANCZOS)
    gap = 64
    group_w = mundo.width + gap + servip.width
    group_x = (W-group_w)//2
    center_y = 134
    im.paste(mundo, (group_x, center_y-mundo.height//2), mundo)
    d.line((group_x+mundo.width+gap//2, 82,
            group_x+mundo.width+gap//2, 186), fill=TEAL, width=3)
    im.paste(servip, (group_x+mundo.width+gap, center_y-servip.height//2), servip)

    # Uma única superfície editorial, com hierarquia generosa.
    d.rounded_rectangle((72, 250, 1008, 1128), radius=58, fill=CREAM)
    d.ellipse((858, 216, 1045, 403), fill=PURPLE)
    d.ellipse((913, 271, 979, 337), fill=GREEN)

    eyebrow = 'SERVIP 2026  •  RIO DE JANEIRO'
    centered(d, eyebrow, 320, fit(d, eyebrow, 690, 25, 20), PURPLE)

    title = 'VOCÊ É\nNOSSO CONVIDADO'
    centered(d, title, 388, ff(FONT_BOLD, 78), INK, spacing=-2)

    d.rounded_rectangle((490, 592, 590, 600), radius=4, fill=GREEN)

    body = 'A Mundo Encantado espera você para conhecer\nnossos lançamentos e viver novas possibilidades.'
    centered(d, body, 644, ff(FONT_REG, 28), MUTED, spacing=10)

    date = '21 — 23  JULHO'
    centered(d, date, 790, fit(d, date, 730, 58, 44), PURPLE)

    place = 'CENTRO DE CONVENÇÕES EXPORIO'
    centered(d, place, 875, fit(d, place, 720, 27, 21), INK)
    centered(d, 'RIO DE JANEIRO', 916, ff(FONT_BOLD, 22), TEAL_DARK)

    d.rounded_rectangle((335, 1000, 745, 1008), radius=4, fill=TEAL)
    centered(d, 'VISITE NOSSO ESTANDE', 1034, ff(FONT_BOLD, 29), PURPLE)

    # Pequenos pontos orbitais em uma única sessão visual.
    for x, y, r, color in [(906, 384, 5, GREEN), (943, 410, 3, PURPLE), (884, 423, 2, TEAL)]:
        d.ellipse((x-r, y-r, x+r, y+r), fill=color)

    im.save(OUTPUT, quality=97)
    print(OUTPUT)


if __name__ == '__main__':
    main()
