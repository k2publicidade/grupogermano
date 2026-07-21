from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(r'C:\Users\LiPeX\Documents\Germano')
BACKGROUND = ROOT / 'convite_servip_fundo.png'
SERVIP = Path(r'C:\Users\LiPeX\AppData\Local\Temp\codex-clipboard-1b1658c6-6eba-4c11-b1c8-1e5f97e6b0dc.png')
MUNDO = ROOT / 'public' / 'logo_mundo_encantado_color.png'
OUTPUT = ROOT / 'convite_servip_mundo_encantado.png'

W, H = 1080, 1350
INK = '#241d2b'
PLUM = '#65254f'
MUTED = '#5b5360'
MAGENTA = '#ba2f72'
FONT_REG = r'C:\Windows\Fonts\arial.ttf'
FONT_BOLD = r'C:\Windows\Fonts\arialbd.ttf'


def font(path, size):
    return ImageFont.truetype(path, size)


def trim_white(img, threshold=246):
    rgba = img.convert('RGBA')
    pix = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = pix[x, y]
            whiteness = min(r, g, b)
            if whiteness >= threshold:
                pix[x, y] = (r, g, b, 0)
            elif whiteness > 220:
                pix[x, y] = (r, g, b, int(a * (threshold-whiteness)/(threshold-220)))
    box = rgba.getbbox()
    return rgba.crop(box) if box else rgba


def fit_font(draw, text, max_width, start, minimum, bold=True):
    path = FONT_BOLD if bold else FONT_REG
    size = start
    while size >= minimum:
        f = font(path, size)
        if draw.textbbox((0, 0), text, font=f)[2] <= max_width:
            return f
        size -= 1
    raise ValueError(f'Texto não cabe: {text}')


def center_text(draw, y, text, f, fill, spacing=0):
    box = draw.textbbox((0, 0), text, font=f, spacing=spacing, align='center')
    x = (W - (box[2]-box[0])) // 2
    draw.multiline_text((x, y), text, font=f, fill=fill, spacing=spacing, align='center')


def main():
    bg = Image.open(BACKGROUND).convert('RGB').resize((W, H), Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(bg)

    # Logo SERVIP flutua no topo, sem caixa ou moldura.
    servip = trim_white(Image.open(SERVIP))
    servip.thumbnail((190, 160), Image.Resampling.LANCZOS)
    bg.paste(servip, ((W-servip.width)//2 + 95, 92), servip)

    eyebrow = 'MUNDO ENCANTADO NA SERVIP 2026'
    ef = fit_font(draw, eyebrow, 700, 25, 20)
    center_text(draw, 280, eyebrow, ef, PLUM)

    title = 'VOCÊ É\nNOSSO CONVIDADO'
    tf = font(FONT_BOLD, 82)
    center_text(draw, 345, title, tf, INK, spacing=-2)

    # Traço curto e deslocado: um único gesto gráfico, sem criar caixas.
    draw.rounded_rectangle((495, 555, 585, 563), radius=4, fill=MAGENTA)

    body = 'Venha conhecer nossos lançamentos e viver de perto\no universo Mundo Encantado.'
    bf = font(FONT_REG, 29)
    center_text(draw, 610, body, bf, MUTED, spacing=10)

    date = '21 — 23  JULHO'
    df = fit_font(draw, date, 700, 53, 42)
    center_text(draw, 780, date, df, INK)

    place = 'CENTRO DE CONVENÇÕES EXPORIO  •  RIO DE JANEIRO'
    pf = fit_font(draw, place, 780, 23, 18)
    center_text(draw, 858, place, pf, MUTED)

    call = 'VISITE NOSSO ESTANDE'
    cf = fit_font(draw, call, 560, 28, 22)
    center_text(draw, 936, call, cf, PLUM)

    # Assinatura da marca em posição baixa, equilibrando a assimetria do fundo.
    mundo = Image.open(MUNDO).convert('RGBA')
    mundo.thumbnail((460, 205), Image.Resampling.LANCZOS)
    bg.paste(mundo, ((W-mundo.width)//2, 1030), mundo)

    bg.save(OUTPUT, quality=96)
    print(OUTPUT)


if __name__ == '__main__':
    main()
