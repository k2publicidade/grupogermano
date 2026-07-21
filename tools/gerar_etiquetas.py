from pathlib import Path
import re

from pypdf import PdfReader
from reportlab.graphics.barcode.eanbc import Ean13BarcodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from reportlab.lib.colors import black, white, Color
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.utils import ImageReader


SOURCE = Path(r"C:\Users\LiPeX\Downloads\etiquetas_produtos.pdf")
LOGO = Path(r"C:\Users\LiPeX\Documents\Germano\public\logo_mundo_encantado_bw.png")
OUTPUT = Path(r"C:\Users\LiPeX\Documents\Germano\etiquetas_produtos_corrigidas_v3.pdf")

PAGE_W, PAGE_H = 170.08, 113.39
M = 7.5  # 2,65 mm de respiro interno


def fit_text(c, text, x, y, max_width, font='Helvetica-Bold', max_size=7.2, min_size=5.2):
    size = max_size
    while size > min_size and stringWidth(text, font, size) > max_width:
        size -= 0.15
    c.setFont(font, size)
    c.drawString(x, y, text)


def wrap_to_width(text, font, size, max_width, max_lines=3):
    rows = []
    current = ''
    for word in text.split():
        candidate = f'{current} {word}'.strip()
        if not current or stringWidth(candidate, font, size) <= max_width:
            current = candidate
        else:
            rows.append(current)
            current = word
    if current:
        rows.append(current)
    if len(rows) <= max_lines and all(stringWidth(r, font, size) <= max_width for r in rows):
        return rows
    return None


def fitted_rows(text, max_width, font='Helvetica-Bold'):
    size = 6.4
    while size >= 4.5:
        rows = wrap_to_width(text, font, size, max_width, 3)
        if rows:
            return rows, size
        size -= 0.1
    raise ValueError(f'Texto não cabe na área reservada: {text}')


def fit_size(text, max_width, font='Helvetica-Bold', max_size=6.4, min_size=4.2):
    size = max_size
    while size >= min_size and stringWidth(text, font, size) > max_width:
        size -= .1
    if stringWidth(text, font, size) > max_width:
        raise ValueError(f'Linha não cabe na área reservada: {text}')
    return size


def parse_labels():
    labels = []
    for page in PdfReader(str(SOURCE)).pages:
        lines = [x.strip() for x in (page.extract_text() or '').splitlines() if x.strip()]
        ref = next(x.split(':', 1)[1].strip() for x in lines if x.startswith('REF:'))
        ean = next(x for x in lines if re.fullmatch(r'\d{13}', x))
        title_parts = [x for x in lines if not x.startswith('REF:') and x != ean]
        title = ' '.join(title_parts).replace(' - - ', ' - ').replace('  ', ' ')
        labels.append((title, ref, ean))
    return labels


def draw_star(c, x, y, r=1.25):
    c.setLineWidth(0.45)
    c.line(x-r, y, x+r, y)
    c.line(x, y-r, x, y+r)


def draw_label(c, title, ref, ean):
    # Fundo, moldura e detalhes inspirados nos brilhos/orbitais da marca.
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setStrokeColor(black)
    c.setLineWidth(0.65)
    c.roundRect(M, M, PAGE_W-2*M, PAGE_H-2*M, 4, stroke=1, fill=0)
    draw_star(c, PAGE_W-M-5, PAGE_H-M-6, 1.15)
    draw_star(c, M+5, M+6, 0.9)

    # Cabeçalho de marca em tons de cinza, sem perda dos detalhes do símbolo.
    header_bottom = PAGE_H-M-38
    header_top = PAGE_H-M-5
    c.setStrokeColor(Color(.55, .55, .55))
    c.setFillColor(white)
    c.setLineWidth(0.5)
    c.roundRect(M+5, header_bottom, PAGE_W-2*M-10, header_top-header_bottom, 2.6, stroke=1, fill=1)
    logo = ImageReader(str(LOGO))
    c.drawImage(logo, M+7, header_bottom+5.5, width=44, height=21.5,
                preserveAspectRatio=True, anchor='c', mask='auto')
    c.setStrokeColor(Color(.55, .55, .55))
    c.setLineWidth(0.45)
    c.line(M+57, header_bottom+4, M+57, header_top-4)

    # Título do produto em duas linhas controladas.
    right_x = M+62
    right_w = PAGE_W-M-right_x-5
    c.setFillColor(black)
    match = re.fullmatch(r'KIT PRESENTE ENCANTADO\s+([^\s]+)\s*-?\s*(.+)', title)
    if not match:
        raise ValueError(f'Título fora do padrão esperado: {title}')
    size_text, category = match.groups()
    title_rows = [f'KIT PRESENTE {size_text} -', f'ENCANTADO {category}']
    title_sizes = [fit_size(row, right_w) for row in title_rows]
    for idx, (row, size) in enumerate(zip(title_rows, title_sizes)):
        assert stringWidth(row, 'Helvetica-Bold', size) <= right_w + .01
        c.setFont('Helvetica-Bold', size)
        c.drawString(right_x, header_top - 9 - idx*9, row)
    c.setFont('Helvetica', 5.3)
    c.drawString(right_x, header_bottom+4.5, f'REF. {ref}')

    # Faixa central com código de barras EAN-13.
    sep_y = 65
    c.setLineWidth(0.45)
    c.line(M+5, sep_y, PAGE_W-M-5, sep_y)
    barcode = Ean13BarcodeWidget(ean)
    barcode.barHeight = 23
    barcode.barWidth = 0.72
    barcode.humanReadable = True
    bounds = barcode.getBounds()
    drawing = Drawing(bounds[2]-bounds[0], bounds[3]-bounds[1])
    drawing.add(barcode)
    scale = min(1.0, 112 / drawing.width)
    drawing.width *= scale
    drawing.height *= scale
    drawing.scale(scale, scale)
    renderPDF.draw(drawing, c, (PAGE_W-drawing.width)/2, 37)

    # Rodapé legal, claramente separado e dentro da margem de segurança.
    c.setFillColor(black)
    c.roundRect(M+5, M+5, PAGE_W-2*M-10, 22, 2.6, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont('Helvetica-Bold', 4.35)
    c.drawCentredString(PAGE_W/2, M+19, 'EMBALADO E DISTRIBUÍDO POR:')
    c.setFont('Helvetica', 4.2)
    c.drawCentredString(PAGE_W/2, M+12.7, 'GERMANO IMPORTAÇÃO E EXPORTAÇÃO LTDA')
    c.setFont('Helvetica-Bold', 4.45)
    c.drawCentredString(PAGE_W/2, M+6.4, 'CNPJ 48.159.471/000-73')


def main():
    labels = parse_labels()
    c = Canvas(str(OUTPUT), pagesize=(PAGE_W, PAGE_H), pageCompression=1)
    c.setTitle('Etiquetas de produtos — Mundo Encantado')
    c.setAuthor('Germano Importação e Exportação Ltda')
    for title, ref, ean in labels:
        draw_label(c, title, ref, ean)
        c.showPage()
    c.save()
    print(f'{len(labels)} etiquetas geradas em {OUTPUT}')


if __name__ == '__main__':
    main()
