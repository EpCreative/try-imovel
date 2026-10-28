// Planta da casa: térreo e suíte do pavimento superior, coerentes com as fotos
// (garagem e entrada recuada na frente, escada na torre de pedra, área social
// aberta para a varanda e a piscina; suíte com a porta do banho na marcenaria).
// Sem cotas nem áreas. Tudo é <path> com pathLength="1" para o desenho
// acontecer com o scroll.
//
// Classes: w = parede, w2 = borda da piscina, g = vidro e portas,
// f = mobiliário, l = paisagem e limites, fill = superfícies.

const rect = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const ellipse = (cx, cy, rx, ry) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`;
const rows = (x1, x2, y0, step, n) => Array.from({ length: n }, (_, i) => `M${x1} ${y0 + i * step}H${x2}`).join('');

export const plans = {
  terreo: {
    caption: 'Térreo',
    alt: 'Planta do térreo: garagem e entrada voltadas para a rua, escada, cozinha, jantar e estar integrados, varanda coberta, piscina e jardim.',
    size: [260, 320],
    paths: [
      // superfícies
      ['fill', rect(40, 14, 180, 36)],
      ['fill fill--soft', rect(10, 260, 90, 60)],
      // limites do lote, rua e caminho de entrada
      ['l', 'M0 320V0H260V290'],
      ['l', 'M0 320H260'],
      ['l', 'M124 240V290M134 240V290'],
      // paredes
      ['w', 'M10 100V260'],
      ['w', 'M10 260H18M92 260H100'],
      ['w', 'M100 180V260'],
      ['w', 'M100 240H124M134 240H160'],
      ['w', 'M160 180H200M160 230V260H200'],
      ['w', 'M200 100V260'],
      ['w', 'M10 100H18M192 100H200'],
      ['w', 'M10 180H84M94 180H100'],
      ['w', 'M100 180H106M154 180H160'],
      ['w', 'M105 290H122M136 290H260'],
      // vidros e portas
      ['g', 'M18 98.5H192M18 101.5H192'],
      ['g', 'M47 98.5V101.5M76 98.5V101.5M105 98.5V101.5M134 98.5V101.5M163 98.5V101.5'],
      ['g', 'M18 260H92'],
      ['g', 'M124 240V230A10 10 0 0 1 134 240'],
      ['g', 'M94 180V170A10 10 0 0 0 84 180'],
      ['g', 'M122 290H136'],
      // piscina
      ['w2', rect(40, 14, 180, 36)],
      ['f', 'M47 16V48M54 16V48'],
      // cozinha
      ['f', rect(12, 108, 8, 64)],
      ['f', rect(32, 126, 26, 14)],
      // jantar
      ['f', rect(72, 130, 32, 16)],
      ['f', [rect(76, 123, 6, 5), rect(85, 123, 6, 5), rect(94, 123, 6, 5), rect(76, 148, 6, 5), rect(85, 148, 6, 5), rect(94, 148, 6, 5), rect(65, 135, 5, 6), rect(106, 135, 5, 6)].join('')],
      // estar
      ['l', rect(118, 108, 74, 64)],
      ['f', 'M126 114H184V122H134V162H126Z'],
      ['f', rect(146, 132, 24, 16)],
      ['f', circle(178, 156, 6) + circle(160, 162, 6)],
      // escada
      ['f', rows(166, 194, 186, 6, 12)],
      // varanda
      ['l', 'M8 100V58H202V100'],
      ['f', rect(38, 72, 30, 12)],
      ['f', [rect(42, 66, 5, 4), rect(52, 66, 5, 4), rect(61, 66, 5, 4), rect(42, 86, 5, 4), rect(52, 86, 5, 4), rect(61, 86, 5, 4)].join('')],
      ['f', rect(138, 64, 44, 9)],
      ['f', circle(160, 84, 7) + circle(132, 88, 5) + circle(188, 88, 5)],
      // espreguiçadeiras
      ['f', rect(12, 18, 22, 8) + rect(12, 32, 22, 8)],
      // jardim
      ['l', circle(240, 28, 11) + circle(236, 126, 12) + circle(244, 206, 10)],
      ['l', circle(206, 304, 8) + circle(244, 304, 9) + circle(110, 266, 6) + circle(152, 272, 7)],
    ],
    labels: [
      ['Garagem', 55, 222],
      ['Entrada', 130, 210],
      ['Cozinha', 40, 166],
      ['Jantar', 88, 166],
      ['Estar', 158, 175],
      ['Varanda', 104, 80],
      ['Piscina', 110, 32],
      ['Jardim', 238, 166],
    ],
  },
  suite: {
    caption: 'Pavimento superior · Suíte',
    alt: 'Planta da suíte no pavimento superior: quarto com varanda, armários e a porta do banho integrada à marcenaria; banho com bancada dupla, banheira sob a janela e box.',
    size: [130, 90],
    paths: [
      // varanda
      ['l', 'M0 18V1.5H80V18'],
      ['g', 'M0 1.5H80'],
      // paredes
      ['w', 'M0 18V90H130V18'],
      ['w', 'M0 18H12M74 18H90M110 18H130'],
      ['w', 'M80 18V72M80 82V90'],
      // vidros e porta do banho
      ['g', 'M12 16.5H74M12 19.5H74'],
      ['g', 'M90 16.5H110M90 19.5H110'],
      ['g', 'M80 72H90A10 10 0 0 1 80 82'],
      ['g', 'M106 89V70H129'],
      // quarto
      ['f', rect(72, 22, 7, 48)],
      ['l', rect(14, 30, 44, 38)],
      ['f', rect(2, 38, 24, 20)],
      ['f', rect(4, 40, 5, 7) + rect(4, 49, 5, 7)],
      ['f', rect(1, 31, 6, 5) + rect(1, 60, 6, 5)],
      ['f', rect(29, 40, 4, 16)],
      ['f', circle(62, 30, 5) + circle(66, 41, 2.5)],
      // banho
      ['f', rect(121, 26, 8, 36)],
      ['f', ellipse(125, 35, 2, 3.5) + ellipse(125, 53, 2, 3.5)],
      ['f', ellipse(100, 30, 12, 6)],
      ['f', rect(83, 40, 6, 4) + ellipse(86, 49, 3, 4)],
    ],
    labels: [
      ['Varanda', 40, 9],
      ['Quarto', 40, 80],
      ['Banho', 100, 58],
    ],
  },
};
