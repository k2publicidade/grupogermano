from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen.canvas import Canvas


ROOT = Path(r'C:\Users\LiPeX\Documents\Germano')
LOGO = ROOT / 'public' / 'logo_mundo_encantado_color.png'
OUTPUT = ROOT / 'papel_timbrado_mundo_encantado_a4.pdf'

TEAL = HexColor('#10A098')
TEAL_DARK = HexColor('#078B85')
PURPLE = HexColor('#602880')
GREEN = HexColor('#62AC30')
INK = HexColor('#29232D')


def draw_header(c, w, h):
    # Filete superior de marca.
    c.setFillColor(TEAL)
    c.rect(0, h-5*mm, w, 5*mm, stroke=0, fill=1)
    c.setFillColor(PURPLE)
    c.rect(0, h-5*mm, 42*mm, 5*mm, stroke=0, fill=1)
    c.setFillColor(GREEN)
    c.rect(42*mm, h-5*mm, 16*mm, 5*mm, stroke=0, fill=1)

    # Logo principal com margem generosa.
    c.drawImage(ImageReader(str(LOGO)), 20*mm, h-37*mm,
                width=63*mm, height=28*mm, preserveAspectRatio=True,
                anchor='c', mask='auto')

    # Órbita assimétrica no canto superior direito.
    c.saveState()
    c.setFillColor(TEAL)
    c.circle(w+7*mm, h-22*mm, 29*mm, stroke=0, fill=1)
    c.setFillColor(PURPLE)
    c.circle(w+5*mm, h-22*mm, 18*mm, stroke=0, fill=1)
    c.setFillColor(white)
    c.circle(w+5*mm, h-22*mm, 11*mm, stroke=0, fill=1)
    c.setStrokeColor(GREEN)
    c.setLineWidth(2.2)
    c.arc(w-48*mm, h-53*mm, w+28*mm, h+22*mm, 205, 120)
    c.restoreState()

    # Separador editorial sob o cabeçalho.
    y = h-43*mm
    c.setStrokeColor(TEAL)
    c.setLineWidth(1.15)
    c.line(20*mm, y, w-20*mm, y)
    c.setStrokeColor(GREEN)
    c.setLineWidth(3)
    c.line(20*mm, y, 47*mm, y)


def draw_footer(c, w):
    # Curvas de marca mantidas fora da área útil do documento.
    c.saveState()
    c.setFillColor(PURPLE)
    c.circle(-9*mm, -3*mm, 26*mm, stroke=0, fill=1)
    c.setFillColor(TEAL)
    c.circle(-8*mm, -2*mm, 17*mm, stroke=0, fill=1)
    c.setFillColor(GREEN)
    c.circle(-7*mm, -1*mm, 8*mm, stroke=0, fill=1)
    c.restoreState()

    c.setStrokeColor(TEAL)
    c.setLineWidth(0.9)
    c.line(28*mm, 18*mm, w-20*mm, 18*mm)
    c.setStrokeColor(PURPLE)
    c.setLineWidth(2.4)
    c.line(w-58*mm, 18*mm, w-20*mm, 18*mm)

    c.setFillColor(INK)
    c.setFont('Helvetica-Bold', 7.2)
    c.drawRightString(w-20*mm, 10*mm, 'MUNDO ENCANTADO')


def main():
    w, h = A4
    c = Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle('Papel timbrado — Mundo Encantado')
    c.setAuthor('Mundo Encantado')
    c.setSubject('Papel timbrado A4')
    c.setFillColor(white)
    c.rect(0, 0, w, h, stroke=0, fill=1)
    draw_header(c, w, h)
    draw_footer(c, w)
    c.showPage()
    c.save()
    print(OUTPUT)


if __name__ == '__main__':
    main()
