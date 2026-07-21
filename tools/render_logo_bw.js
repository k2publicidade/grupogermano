const fs = require('fs');
const sharp = require('sharp');

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error('Uso: node render_logo_bw.js entrada.svg saida.png');

let svg = fs.readFileSync(input, 'utf8');
const grayMap = {
  '#45403d': '#2f2f2f',
  '#8b529a': '#666666',
  '#fff': '#161616',
  '#62ac30': '#858585',
  '#b4d28f': '#b8b8b8',
  '#8b3a8a': '#555555',
};
for (const [from, to] of Object.entries(grayMap)) {
  svg = svg.replace(new RegExp(`fill:\\s*${from}\\s*;`, 'gi'), `fill: ${to};`);
}

sharp(Buffer.from(svg))
  .resize({ width: 1350, height: 600, fit: 'contain', background: '#ffffff' })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile(output);
