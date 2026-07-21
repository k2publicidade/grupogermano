const fs = require('fs');
const sharp = require('sharp');

const [input, output, variant] = process.argv.slice(2);
if (!input || !output) throw new Error('Uso: node render_logo_color.js entrada.svg saida.png');

let svg = fs.readFileSync(input, 'utf8');
if (variant !== 'light-on-dark') {
  svg = svg.replace(/fill:\s*#fff\s*;/gi, 'fill: #17141b;');
}

sharp(Buffer.from(svg))
  .resize({ width: 1200, height: 533, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(output);
