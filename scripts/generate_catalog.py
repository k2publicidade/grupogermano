from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageCms
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, DecodedStreamObject, DictionaryObject, NameObject, NumberObject, TextStringObject

W, H = 2480, 3508
ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\LiPeX\Documents\MUNDO ENCANTADO\catalogo")
OUT = ROOT / "output" / "catalogo-2026-cmyk"
PDF_OUT = ROOT / "output" / "pdf"
TMP = ROOT / "tmp" / "pdfs"
for folder in (OUT, PDF_OUT, TMP):
    folder.mkdir(parents=True, exist_ok=True)

FONT_DISPLAY = r"C:\Windows\Fonts\bahnschrift.ttf"
FONT_REGULAR = r"C:\Windows\Fonts\arial.ttf"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"

INK = "#151515"
WHITE = "#FFFFFF"
PAPER = "#F7F8F6"
VIOLET = "#873E7F"
LIME = "#62A541"
MINT = "#C5DDB6"
LILAC = "#F0E7EE"
LINE = "#D8D9D5"
MUTED = "#62645F"

SRGB_PROFILE = ImageCms.createProfile("sRGB")
SRGB_ICC = ImageCms.ImageCmsProfile(SRGB_PROFILE).tobytes()
FOGRA39_PATH = Path(r"C:\Windows\System32\spool\drivers\color\CoatedFOGRA39.icc")
FOGRA39_PROFILE = ImageCms.getOpenProfile(str(FOGRA39_PATH))
FOGRA39_ICC = FOGRA39_PATH.read_bytes()
CMS_FLAGS = ImageCms.Flags.BLACKPOINTCOMPENSATION
TO_RGB = ImageCms.buildTransformFromOpenProfiles(
    FOGRA39_PROFILE, SRGB_PROFILE, "CMYK", "RGB",
    renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC, flags=CMS_FLAGS,
)
TO_CMYK = ImageCms.buildTransformFromOpenProfiles(
    SRGB_PROFILE, FOGRA39_PROFILE, "RGB", "CMYK",
    renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC, flags=CMS_FLAGS,
)


def source_to_rgb(img):
    if img.mode == "CMYK":
        return ImageCms.applyTransform(img, TO_RGB)
    return img.convert("RGB")


def rgb_to_cmyk(img):
    return ImageCms.applyTransform(img.convert("RGB"), TO_CMYK)


def cmyk_softproof(img):
    return ImageCms.applyTransform(img, TO_RGB)


def fnt(size, bold=False, display=False):
    path = FONT_DISPLAY if display else (FONT_BOLD if bold else FONT_REGULAR)
    return ImageFont.truetype(path, size)


def text(draw, xy, value, size, fill=INK, bold=False, display=False, anchor=None, spacing=4):
    draw.multiline_text(xy, value, font=fnt(size, bold, display), fill=fill,
                        anchor=anchor, spacing=spacing)


def fit_text(draw, box, value, max_size, min_size=30, fill=INK, bold=False,
             display=False, anchor="la", spacing=6):
    x, y, x2, y2 = box
    for size in range(max_size, min_size - 1, -2):
        font = fnt(size, bold, display)
        bbox = draw.multiline_textbbox((x, y), value, font=font, anchor=anchor, spacing=spacing)
        if bbox[2] - bbox[0] <= x2 - x and bbox[3] - bbox[1] <= y2 - y:
            draw.multiline_text((x, y), value, font=font, fill=fill, anchor=anchor, spacing=spacing)
            return size
    return min_size


def wrap(draw, value, font, max_width):
    words = value.split()
    lines, line = [], ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=font)[2] <= max_width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return "\n".join(lines)


def paragraph(draw, xy, value, size, width, fill=INK, leading=1.36, bold=False):
    font = fnt(size, bold)
    wrapped = wrap(draw, value, font, width)
    draw.multiline_text(xy, wrapped, font=font, fill=fill, spacing=int(size * (leading - 1)))
    bbox = draw.multiline_textbbox(xy, wrapped, font=font, spacing=int(size * (leading - 1)))
    return bbox[3]


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def contain(img, box, padding=0):
    x, y, x2, y2 = box
    bw, bh = x2 - x - padding * 2, y2 - y - padding * 2
    copy = img.copy()
    copy.thumbnail((bw, bh), Image.Resampling.LANCZOS)
    px = x + padding + (bw - copy.width) // 2
    py = y + padding + (bh - copy.height) // 2
    return copy, (px, py)


def cover(img, size):
    target_w, target_h = size
    scale = max(target_w / img.width, target_h / img.height)
    resized = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def remove_white(img, threshold=236, softness=42):
    rgba = img.convert("RGBA")
    pixels = []
    for r, g, b, _ in rgba.getdata():
        distance = 255 - min(r, g, b)
        saturation = max(r, g, b) - min(r, g, b)
        strength = max(distance, saturation * 1.2)
        alpha = max(0, min(255, int((strength - (255 - threshold)) * 255 / softness)))
        pixels.append((r, g, b, alpha))
    rgba.putdata(pixels)
    bbox = rgba.getbbox()
    return rgba.crop(bbox) if bbox else rgba


def dark_to_white(img):
    rgba = img.convert("RGBA")
    pixels = []
    for r, g, b, a in rgba.getdata():
        if max(r, g, b) < 105:
            pixels.append((255, 255, 255, a))
        else:
            pixels.append((r, g, b, a))
    rgba.putdata(pixels)
    return rgba


def paste_rgba(page, asset, box, padding=0):
    fitted, pos = contain(asset, box, padding)
    page.alpha_composite(fitted, pos)


def page_base(color=PAPER):
    return Image.new("RGBA", (W, H), color)


def page_number(draw, number, color=MUTED):
    text(draw, (W - 170, H - 105), f"{number:02d}", 36, color, bold=True, anchor="ra")


def top_label(draw, value, color=MUTED):
    text(draw, (180, 120), value.upper(), 31, color, bold=True)


def logo_from_page7(source):
    page = source_to_rgb(Image.open(source / "CATALOGO MUNDO ENCANTADO OUT25_Página_7.jpg"))
    mundo = remove_white(page.crop((900, 220, 2200, 690)), threshold=230, softness=36)
    germano = remove_white(page.crop((980, 720, 2200, 1100)), threshold=230, softness=34)
    return mundo, germano


def product_cutout(source, page_name, box):
    page = source_to_rgb(Image.open(source / page_name))
    return remove_white(page.crop(box), threshold=232, softness=50)


def pattern_tiles(source, page_name, bboxes):
    img = source_to_rgb(Image.open(source / page_name))
    return [img.crop(box) for box in bboxes]


mundo_logo, germano_logo = logo_from_page7(SOURCE)
page7_source = source_to_rgb(Image.open(SOURCE / "CATALOGO MUNDO ENCANTADO OUT25_Página_7.jpg"))
qr_source = page7_source.crop((1080, 2410, 1995, 3355)).convert("L").point(lambda value: 0 if value < 150 else 255).convert("RGB")
kids_display = product_cutout(SOURCE, "CATALOGO MUNDO ENCANTADO OUT25_Página_3.jpg", (300, 35, 985, 1010))
adult_display = product_cutout(SOURCE, "CATALOGO MUNDO ENCANTADO OUT25_Página_5.jpg", (250, 20, 1150, 1325))

kids_boxes = []
adult_boxes = []
for row in range(4):
    for col in range(3):
        x1s = [95, 885, 1675][col]
        y1s = [995, 1580, 2160, 2740][row]
        kids_boxes.append((x1s, y1s, x1s + 710, y1s + 505))
        x1a = [100, 890, 1685][col]
        y1a = [1000, 1585, 2165, 2750][row]
        adult_boxes.append((x1a, y1a, x1a + 710, y1a + 505))

kids_tiles = pattern_tiles(SOURCE, "CATALOGO MUNDO ENCANTADO OUT25_Página_4.jpg", kids_boxes)
adult_tiles = pattern_tiles(SOURCE, "CATALOGO MUNDO ENCANTADO OUT25_Página_6.jpg", adult_boxes)


def make_cover():
    p = page_base(WHITE)
    d = ImageDraw.Draw(p)
    d.rectangle((0, 0, 112, H), fill=VIOLET)
    d.rectangle((112, H - 460, W, H), fill=INK)
    rounded(d, (1460, 390, 2360, 2330), 80, LILAC)
    paste_rgba(p, adult_display, (1360, 350, 2380, 2450), 40)
    paste_rgba(p, mundo_logo, (245, 165, 1120, 485))
    top_label(d, "Coleção outubro · Grupo Germano", MUTED)
    text(d, (245, 785), "CATÁLOGO", 245, INK, bold=True, display=True)
    text(d, (245, 1000), "2026", 390, VIOLET, bold=True, display=True)
    d.rectangle((245, 1485, 1260, 1598), fill=LIME)
    text(d, (285, 1508), "PAPEL DE PRESENTE", 65, INK, bold=True)
    paragraph(d, (250, 1715), "Coleções infantis e casuais para transformar cada presente em uma experiência memorável.", 48, 920, MUTED, 1.38)
    text(d, (245, H - 300), "MUNDO ENCANTADO", 42, WHITE, bold=True)
    text(d, (245, H - 235), "Design, cor e cuidado em cada folha.", 34, "#C7C8C4")
    paste_rgba(p, dark_to_white(germano_logo), (1730, H - 335, 2270, H - 150))
    return p


def make_manifesto():
    p = page_base(WHITE)
    d = ImageDraw.Draw(p)
    d.rectangle((0, 0, 1010, H), fill=VIOLET)
    d.rectangle((1010, 0, W, 20), fill=LIME)
    paste_rgba(p, dark_to_white(mundo_logo), (155, 145, 825, 390))
    text(d, (155, 690), "Criar bem\né cuidar de\ncada etapa.", 170, WHITE, bold=True, display=True, spacing=18)
    paragraph(d, (160, 1450), "No Grupo Germano, simplicidade significa fazer o essencial com excelência: bom design, produção cuidadosa e entrega no tempo certo.", 48, 690, "#EEE8FF", 1.45)
    text(d, (160, H - 270), "MUNDO ENCANTADO · NOSSO JEITO DE FAZER", 29, MINT, bold=True)

    x = 1180
    text(d, (x, 220), "Nosso jeito de fazer", 102, INK, bold=True, display=True)
    sections = [
        ("01", "Do traço ao produto", "Do primeiro desenho ao último retoque, cada papel Mundo Encantado recebe atenção técnica e uma identidade capaz de valorizar o ponto de venda."),
        ("02", "Matéria-prima responsável", "Trabalhamos com fornecedores certificados FSC® e processos em conformidade com a ISO 14001. As tintas seguem normas de baixas emissões, garantindo cores vivas com menor impacto."),
        ("03", "Por que isso importa", "O lojista recebe um produto bonito e confiável. O consumidor leva um embrulho que encanta, enquanto escolhas responsáveis ajudam a orientar as próximas coleções."),
    ]
    y = 650
    for idx, title_value, body in sections:
        text(d, (x, y), idx, 42, VIOLET, bold=True)
        text(d, (x + 120, y - 6), title_value, 64, INK, bold=True)
        y2 = paragraph(d, (x + 120, y + 105), body, 41, 1010, MUTED, 1.45)
        d.line((x + 120, y2 + 58, W - 160, y2 + 58), fill=LINE, width=3)
        y = y2 + 150
    page_number(d, 2)
    return p


def spec_rows(draw, x, y, width, rows, dark=False):
    fg = WHITE if dark else INK
    muted = "#BFC0BC" if dark else MUTED
    for label, value in rows:
        text(draw, (x, y), label, 29, muted, bold=True)
        text(draw, (x + width, y), value, 39, fg, bold=True, anchor="ra")
        draw.line((x, y + 68, x + width, y + 68), fill="#444444" if dark else LINE, width=2)
        y += 112
    return y


def make_product_page(kind):
    kids = kind == "kids"
    p = page_base(WHITE if kids else INK)
    d = ImageDraw.Draw(p)
    fg = INK if kids else WHITE
    muted = MUTED if kids else "#BFC0BC"
    accent = LIME if kids else VIOLET
    top_label(d, "Papel de presente · Linha 2026", muted)
    text(d, (180, 255), "PAPEL DE PRESENTE", 88, fg, bold=True)
    text(d, (180, 370), "KIDS / INFANTIL" if kids else "ADULTO / CASUAL", 180, accent, bold=True, display=True)
    text(d, (185, 565), "100 x 70 cm · 80 g/m²", 42, muted, bold=True)

    image_box = (120, 760, 1410, 2700)
    rounded(d, image_box, 70, LILAC if kids else "#252525")
    paste_rgba(p, kids_display if kids else adult_display, image_box, 65)

    x = 1570
    rounded(d, (x, 770, 2295, 925), 70, accent)
    text(d, (x + 365, 848), "ME25001" if kids else "ME25002", 60, INK if kids else WHITE, bold=True, anchor="mm")
    text(d, (x, 1035), "Condição especial de lançamento", 31, accent, bold=True)
    text(d, (x, 1105), "Produto sem ST", 55, fg, bold=True)

    rows = [
        ("NCM", "4810.13.89"),
        ("IPI", "3,25%"),
        ("EMBALAGEM", "Display"),
        ("DISPLAY", "39 x 39 x 50 cm"),
        ("POR DISPLAY", "156 unidades"),
        ("EAN-13", "7898973004056" if kids else "7898973004063"),
        ("CAIXA", "40 x 40 x 72 cm"),
        ("POR CAIXA", "1 display"),
        ("DUN-14", "17898973004053" if kids else "17898973004060"),
    ]
    spec_rows(d, x, 1300, 725, rows, dark=not kids)
    d.rectangle((120, 2910, 2295, 2914), fill=accent)
    text(d, (120, 3010), "Imagem ilustrativa. Padrões sujeitos à disponibilidade.", 31, muted)
    footer_logo = germano_logo if kids else dark_to_white(germano_logo)
    paste_rgba(p, footer_logo, (120, 3180, 655, 3370))
    page_number(d, 3 if kids else 5, muted)
    return p


def make_grid_page(kids=True):
    p = page_base(PAPER)
    d = ImageDraw.Draw(p)
    accent = LIME if kids else VIOLET
    top_label(d, "Coleção de estampas · 12 opções", MUTED)
    text(d, (160, 250), "KIDS / INFANTIL" if kids else "ADULTO / CASUAL", 150, INK, bold=True, display=True)
    text(d, (165, 430), "ME25001" if kids else "ME25002", 42, VIOLET if kids else LIME, bold=True)
    text(d, (W - 165, 430), "100 x 70 cm · 80 g/m²", 38, MUTED, bold=True, anchor="ra")
    d.rectangle((160, 525, W - 160, 533), fill=accent)

    tiles = kids_tiles if kids else adult_tiles
    margin_x, gap_x = 160, 42
    tile_w = (W - margin_x * 2 - gap_x * 2) // 3
    tile_h, gap_y = 485, 78
    y0 = 655
    for i, tile in enumerate(tiles):
        row, col = divmod(i, 3)
        x = margin_x + col * (tile_w + gap_x)
        y = y0 + row * (tile_h + gap_y)
        img = cover(tile, (tile_w, tile_h))
        p.paste(img, (x, y))
        rounded(d, (x + 18, y + 18, x + 92, y + 78), 25, WHITE)
        text(d, (x + 55, y + 49), f"{i + 1:02d}", 25, INK, bold=True, anchor="mm")
    page_number(d, 4 if kids else 6)
    return p


def make_back_cover():
    p = page_base(VIOLET)
    d = ImageDraw.Draw(p)
    d.rectangle((0, 0, W, 22), fill=LIME)
    paste_rgba(p, dark_to_white(mundo_logo), (180, 155, 1000, 450))
    paste_rgba(p, dark_to_white(germano_logo), (1600, 190, 2260, 420))
    text(d, (180, 710), "Veja a\ncoleção\ncompleta.", 175, WHITE, bold=True, display=True, spacing=14)
    paragraph(d, (185, 1450), "Aponte a câmera para o QR code e acesse o catálogo digital atualizado.", 52, 840, "#E8DFFF", 1.4)

    rounded(d, (1450, 760, 2280, 1760), 65, WHITE)
    qr_img = qr_source.resize((650, 650), Image.Resampling.NEAREST)
    p.paste(qr_img, (1540, 875))
    text(d, (1865, 1615), "grupogermano.app.br", 31, INK, bold=True, anchor="mm")

    d.line((180, 2130, W - 180, 2130), fill="#8E63EF", width=3)
    text(d, (180, 2250), "Contato comercial", 43, MINT, bold=True)
    text(d, (180, 2350), "comercial@grupogermano.app.br", 52, WHITE, bold=True)
    text(d, (180, 2440), "sac@grupogermano.app.br", 43, "#E8DFFF")
    text(d, (180, 2520), "(21) 96424-9896", 43, "#E8DFFF")

    rounded(d, (180, 2920, W - 180, 3260), 70, LIME)
    text(d, (260, 3005), "GERMANO IMPORTAÇÃO E EXPORTAÇÃO LTDA.", 47, INK, bold=True)
    text(d, (260, 3090), "48.159.471/0001-73", 42, INK)
    text(d, (W - 260, 3090), "CATÁLOGO 2026", 42, INK, bold=True, anchor="ra")
    page_number(d, 7, "#D8CAFF")
    return p


pages = [
    make_cover(),
    make_manifesto(),
    make_product_page("kids"),
    make_grid_page(True),
    make_product_page("adult"),
    make_grid_page(False),
    make_back_cover(),
]

softproof_paths = []
cmyk_jpg_paths = []
for i, page in enumerate(pages, 1):
    rgb = page.convert("RGB")
    cmyk = rgb_to_cmyk(rgb)
    softproof = cmyk_softproof(cmyk)
    softproof_path = OUT / f"catalogo-mundo-encantado-2026-pagina-{i}-softproof-rgb.png"
    jpg_path = OUT / f"catalogo-mundo-encantado-2026-pagina-{i}-cmyk.jpg"
    tif_path = OUT / f"catalogo-mundo-encantado-2026-pagina-{i}-cmyk.tif"
    softproof.save(softproof_path, "PNG", dpi=(300, 300), optimize=True, icc_profile=SRGB_ICC)
    cmyk.save(jpg_path, "JPEG", quality=95, subsampling=0, dpi=(300, 300), optimize=True, icc_profile=FOGRA39_ICC)
    cmyk.save(tif_path, "TIFF", compression="tiff_lzw", dpi=(300, 300), icc_profile=FOGRA39_ICC)
    softproof_paths.append(softproof_path)
    cmyk_jpg_paths.append(jpg_path)

pdf_path = PDF_OUT / "catalogo-mundo-encantado-2026-cmyk-fogra39.pdf"
temp_pdf_path = TMP / "catalogo-mundo-encantado-2026-cmyk-base.pdf"
c = canvas.Canvas(str(temp_pdf_path), pagesize=A4)
c.setTitle("Catálogo Mundo Encantado 2026")
c.setAuthor("Grupo Germano")
c.setSubject("Catálogo de papel de presente Mundo Encantado")
page_w, page_h = A4
for jpg_path in cmyk_jpg_paths:
    c.drawImage(str(jpg_path), 0, 0, width=page_w, height=page_h, preserveAspectRatio=False, mask="auto")
    c.showPage()
c.save()

reader = PdfReader(str(temp_pdf_path))
writer = PdfWriter()
writer.append_pages_from_reader(reader)
profile_stream = DecodedStreamObject()
profile_stream.set_data(FOGRA39_ICC)
profile_stream.update({NameObject("/N"): NumberObject(4)})
profile_ref = writer._add_object(profile_stream)
intent = DictionaryObject({
    NameObject("/Type"): NameObject("/OutputIntent"),
    NameObject("/S"): NameObject("/GTS_PDFX"),
    NameObject("/OutputConditionIdentifier"): TextStringObject("Coated FOGRA39"),
    NameObject("/Info"): TextStringObject("ISO Coated v2 / FOGRA39 CMYK"),
    NameObject("/RegistryName"): TextStringObject("http://www.color.org"),
    NameObject("/DestOutputProfile"): profile_ref,
})
intent_ref = writer._add_object(intent)
writer._root_object.update({NameObject("/OutputIntents"): ArrayObject([intent_ref])})
writer.add_metadata({
    "/Title": "Catálogo Mundo Encantado 2026 - CMYK FOGRA39",
    "/Author": "Grupo Germano",
    "/Subject": "Catálogo de papel de presente para impressão",
})
with pdf_path.open("wb") as output_file:
    writer.write(output_file)

print(pdf_path)
for path in softproof_paths:
    print(path)
