// Conteúdo do site, separado do layout e da animação.
// Coordenadas de imagem são frações (0–1) do quadro 1536×1024.

export const site = {
  // Nome provisório: substituir quando houver nome definitivo.
  name: 'Residência Horizonte',
  namePlaceholder: true,
  city: 'São Paulo, Brasil',
  sentence: 'Uma residência contemporânea em São Paulo.',
  // Dados operacionais ainda não fornecidos. Enquanto forem null, os botões
  // levam para a lista de canais e o texto aparece como "a definir".
  contact: {
    email: null,
    phone: null,
    whatsapp: null, // somente dígitos, com DDI e DDD
  },
};

export const images = {
  aerea: {
    src: 'assets/img/aerea',
    alt: 'Vista aérea da residência: cobertura plana com painéis solares, volumes em pedra clara e madeira, garagem, jardim frontal e piscina nos fundos do lote.',
  },
  fachada: {
    src: 'assets/img/fachada',
    alt: 'Fachada frontal: dois pavimentos com lajes horizontais em pedra clara, painéis verticais de madeira, caixilhos pretos, portão de garagem em madeira e portão social preto.',
  },
  convivio: {
    src: 'assets/img/convivio',
    alt: 'Sala de estar integrada ao jantar, com sofá claro, mesa de centro em madeira e tapete natural; ao fundo, a cozinha, e à direita grandes portas de vidro abertas para a varanda e a piscina.',
  },
  cozinha: {
    src: 'assets/img/cozinha',
    alt: 'Cozinha com ilha em pedra e banquetas de madeira, marcenaria em madeira natural e, ao lado, mesa de jantar longa diante dos vidros que dão para o jardim e a área externa.',
  },
  suite: {
    src: 'assets/img/suite',
    alt: 'Suíte principal com parede revestida em madeira, cama clara, poltrona e portas de vidro para uma varanda com vista para as árvores; à direita, a porta do banheiro integrada à marcenaria.',
  },
  banho: {
    src: 'assets/img/banho',
    alt: 'Banheiro principal em pedra clara com bancada dupla, espelho iluminado, box de vidro, banheira e janela vertical; à direita, a porta aberta mostra lateralmente parte do quarto.',
  },
  piscina: {
    src: 'assets/img/piscina',
    alt: 'Piscina retangular diante da casa, com espreguiçadeiras, varanda coberta, sala integrada atrás dos vidros e jardim tropical.',
  },
};

// Seções na ordem do percurso. `nav` alimenta o indicador de progresso,
// `menu` o menu em tela cheia. `focus` é o ponto da imagem que o recorte
// preserva em cada orientação.
export const sections = [
  {
    id: 'preludio',
    kind: 'hero',
    nav: 'Início',
    image: 'fachada',
    focus: { landscape: [0.5, 0.4], portrait: [0.5, 0.5] },
    hint: 'Explore ao rolar',
  },
  {
    id: 'implantacao',
    kind: 'intro',
    nav: 'Visão geral',
    menu: 'Visão geral',
    label: 'Visão geral',
    title: 'Arquitetura, luz e paisagem organizadas como uma única experiência.',
    facts: ['São Paulo, Brasil', 'Residência contemporânea', 'Dois pavimentos', 'Área externa integrada'],
  },
  {
    id: 'chegada',
    kind: 'feature',
    nav: 'Arquitetura',
    menu: 'Arquitetura',
    label: 'Arquitetura',
    title: 'Uma presença marcante, sem excessos.',
    body: 'Pedra clara, madeira natural e planos horizontais definem uma arquitetura reservada para a rua e aberta para o interior.',
    // Vista de cima: fechada para a rua, aberta para o pátio e a piscina.
    // Aproximação lenta de 4% e leve redução de exposição nas bordas.
    figure: { image: 'aerea', caption: 'Vista aérea', ratio: { landscape: '16 / 9', portrait: '4 / 3' }, focus: [0.5, 0.45], zoom: [1, 1.04], vignette: true },
  },
  {
    id: 'interiores',
    kind: 'track',
    nav: 'Interiores',
    menu: 'Interiores',
    // No desktop, sala e cozinha correm numa linha só, como um espaço contínuo.
    items: [
      { type: 'text', id: 'convivio', label: 'Interiores · Sala e jantar', title: 'Ambientes que não terminam nas paredes.', body: 'Sala, jantar e jardim formam um espaço contínuo, pensado para encontros, silêncio e luz natural.' },
      { type: 'figure', image: 'convivio', caption: 'Sala de estar, jantar e varanda' },
      { type: 'text', id: 'encontros', label: 'Interiores · Cozinha', title: 'O cotidiano ocupa o centro da arquitetura.', body: 'Madeira, pedra e proporções generosas criam um ambiente funcional, acolhedor e conectado.' },
      { type: 'figure', image: 'cozinha', caption: 'Cozinha e jantar' },
      { type: 'cta' },
    ],
  },
  {
    id: 'suite',
    kind: 'suite',
    nav: 'Suíte',
    theme: 'brown',
    blocks: [
      {
        id: 'refugio',
        label: 'Suíte · Quarto',
        title: 'Um espaço desenhado para reduzir o ritmo.',
        body: 'Materiais naturais, luz controlada e conexão com o exterior transformam a suíte em um refúgio particular.',
        figure: { image: 'suite', caption: 'Suíte principal', ratio: { landscape: '16 / 9', portrait: '4 / 3' }, focus: [0.46, 0.55] },
      },
      {
        id: 'ritual',
        label: 'Suíte · Banho',
        title: 'O cuidado continua nos detalhes.',
        body: 'Pedra clara, madeira e luz indireta criam uma atmosfera precisa, serena e atemporal.',
        figure: { image: 'banho', caption: 'Banho da suíte', ratio: { landscape: '3 / 2', portrait: '3 / 2' }, focus: [0.5, 0.5] },
      },
    ],
  },
  {
    id: 'respiro',
    kind: 'expand',
    nav: 'Área externa',
    menu: 'Área externa',
    label: 'Área externa',
    title: 'A casa se abre para viver do lado de fora.',
    body: 'Piscina, varanda e áreas sociais compartilham a mesma arquitetura e o mesmo ritmo.',
    image: 'piscina',
    caption: 'Piscina e varanda',
    focus: { landscape: [0.5, 0.45], portrait: [0.56, 0.5] },
    // Só a superfície da água se move.
    water: [[0.128, 0.672], [0.975, 0.655], [0.985, 0.705], [0.845, 1], [0.69, 1], [0.236, 0.745]],
  },
  {
    id: 'planta',
    kind: 'plan',
    nav: 'Planta',
    label: 'Planta',
    title: 'Uma casa de linhas claras, espaços conectados e presença silenciosa.',
    note: 'São Paulo, vista de uma nova perspectiva.',
    // Desenhos em plans.js. Marcadores em frações de cada desenho.
    markers: [
      { label: 'Chegada', plan: 'terreo', point: [0.496, 0.906] },
      { label: 'Convívio', plan: 'terreo', point: [0.608, 0.4375] },
      { label: 'Refúgio', plan: 'suite', point: [0.338, 0.544] },
      { label: 'Piscina', plan: 'terreo', point: [0.754, 0.1] },
    ],
  },
  {
    id: 'contato',
    kind: 'contact',
    nav: 'Contato',
    menu: 'Contato',
    label: 'Contato',
    title: 'Conheça a residência.',
    actions: [
      { label: 'Agendar uma visita', intent: 'visita' },
      { label: 'Solicitar informações', intent: 'informacoes' },
      { label: 'Explorar os ambientes', href: '#interiores' },
    ],
  },
];
