// Componentes: funções que devolvem marcação a partir dos dados de content.js.
// Nenhuma lógica de animação aqui; o movimento lê os atributos data-*.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const poly = (pts) => `polygon(${pts.map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`).join(',')})`;
const pad = (n) => String(n).padStart(2, '0');

// Monograma provisório: duas lajes horizontais e o volume de pedra da fachada.
export const Monogram = (cls = '') => `
  <svg class="monogram ${cls}" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <path d="M4 12.5H27M4 23.5H25M29.5 7V33" fill="none" stroke="currentColor" stroke-width="1.4"/>
  </svg>`;

export function contactHref(contact, intent) {
  const text = intent === 'visita'
    ? 'Olá! Gostaria de agendar uma visita à residência.'
    : 'Olá! Gostaria de receber informações sobre a residência.';
  if (contact.whatsapp) return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;
  if (contact.email) return `mailto:${contact.email}?subject=${encodeURIComponent(intent === 'visita' ? 'Agendar uma visita' : 'Solicitar informações')}`;
  return '#canais';
}

const ctaLink = (site, label, intent, cls = 'cta') => {
  const href = contactHref(site.contact, intent);
  const ext = href.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
  return `<a class="${cls}" href="${href}"${ext}><span>${esc(label)}</span><i aria-hidden="true"></i></a>`;
};

// Imagem que cobre a moldura preservando um ponto de foco.
const Cover = (img, { focus = [0.5, 0.5], eager = false, sizes = '100vw', alt = true, extra = '' } = {}) => {
  const [fl, fp] = Array.isArray(focus) ? [focus, focus] : [focus.landscape, focus.portrait];
  return `
    <div class="cover" style="--fx-l:${fl[0]};--fy-l:${fl[1]};--fx-p:${fp[0]};--fy-p:${fp[1]}">
      <img src="${img.src}-1536.webp" srcset="${img.src}-960.webp 960w, ${img.src}-1536.webp 1536w" sizes="${sizes}"
        alt="${alt ? esc(img.alt) : ''}" width="1536" height="1024" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>
      ${extra}
    </div>`;
};

// Figura do fluxo: abre a partir da linha central conforme entra na tela.
const Figure = (images, f, { cls = '', sizes = '(min-width: 1024px) 92vw, 100vw', extra = '', data = 'reveal' } = {}) => {
  const ratio = typeof f.ratio === 'object' ? f.ratio : { landscape: f.ratio || '3 / 2', portrait: f.ratio || '3 / 2' };
  const zoom = f.zoom ? ` data-zoom="${f.zoom.join(',')}"` : '';
  return `
  <figure class="fig ${cls}" data-fig="${data}"${zoom}>
    <div class="fig-frame" style="--ar-l:${ratio.landscape};--ar-p:${ratio.portrait}">
      ${Cover(images[f.image], { focus: f.focus, sizes, extra })}
      ${f.vignette ? '<span class="fig-vignette" aria-hidden="true"></span>' : ''}
    </div>
    <figcaption>${esc(f.caption)}</figcaption>
  </figure>`;
};

const Head = (s, { title = s.title, body = s.body, id = s.id, label = s.label } = {}) => `
  <div class="grid head">
    <p class="label tx">${esc(label)}</p>
    <h2 class="title tx" id="t-${id}">${esc(title)}</h2>
    ${body ? `<p class="body tx">${esc(body)}</p>` : ''}
  </div>`;

// --- estrutura fixa ---------------------------------------------------------

export function Header(site) {
  return `
  <header class="hd" data-ui="dark">
    <a class="hd-brand" href="#preludio" aria-label="${esc(site.name)}, voltar ao início">
      ${Monogram()}
      <span class="hd-name">${esc(site.name)}</span>
    </a>
    <button class="hd-menu" type="button" aria-expanded="false" aria-controls="menu">
      <span class="hd-menu-label">Menu</span>
    </button>
  </header>`;
}

export function Menu(site, sections) {
  const items = sections.filter((s) => s.menu);
  return `
  <div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
    <nav class="menu-nav" aria-label="Principal">
      <ol class="menu-list">
        ${items.map((s, i) => `
          <li><a href="#${s.id}"><span class="menu-n">${pad(i + 1)}</span><span class="menu-t">${esc(s.menu)}</span></a></li>`).join('')}
      </ol>
    </nav>
    <div class="menu-foot">
      <span>${esc(site.name)}</span>
      <span>${esc(site.city)}</span>
    </div>
  </div>`;
}

export function Progress(sections) {
  return `
  <nav class="prog" aria-label="Seções">
    <ol>
      ${sections.map((s, i) => `
        <li><a href="#${s.id}" data-id="${s.id}"><span class="prog-t">${esc(s.nav)}</span><span class="prog-n">${pad(i + 1)}</span></a></li>`).join('')}
    </ol>
  </nav>
  <div class="prog-line" aria-hidden="true"><i></i></div>`;
}

// --- seções -----------------------------------------------------------------

// Abertura: o nome sobre o marfim e, abaixo, uma linha de horizonte que se
// abre até a vista aérea ocupar a tela.
function Hero(site, s, images) {
  return `
  <section class="hero" id="${s.id}" aria-labelledby="t-${s.id}" tabindex="-1" data-section>
    <div class="hero-pin">
      <div class="hero-head">
        ${Monogram('hero-mark')}
        <h1 class="hero-name" id="t-${s.id}">${esc(site.name)}</h1>
        <p class="hero-sentence">${esc(site.sentence)}</p>
      </div>
      <div class="hero-media">${Cover(images[s.image], { focus: s.focus, eager: true })}</div>
      <div class="hero-cue" aria-hidden="true">
        <span class="hero-line"></span>
        <p class="hero-hint">${esc(s.hint)}</p>
      </div>
    </div>
  </section>`;
}

function Intro(s) {
  return `
  <section class="sec intro" id="${s.id}" aria-labelledby="t-${s.id}" tabindex="-1" data-section data-ui="dark">
    <div class="grid">
      <p class="label tx">${esc(s.label)}</p>
      <h2 class="statement tx" id="t-${s.id}">${esc(s.title)}</h2>
      <ul class="facts tx">${s.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
    </div>
  </section>`;
}

function Feature(s, images) {
  return `
  <section class="sec feature" id="${s.id}" aria-labelledby="t-${s.id}" tabindex="-1" data-section data-ui="dark">
    ${Head(s)}
    <div class="grid">${Figure(images, s.figure, { cls: 'fig--wide' })}</div>
  </section>`;
}

// Interiores: no desktop o trilho corre na horizontal enquanto se rola; no
// celular os mesmos itens ficam empilhados.
function Track(site, s, images) {
  const item = (it) => {
    if (it.type === 'text') {
      return `
      <div class="panel" id="${it.id}" tabindex="-1">
        <p class="label tx">${esc(it.label)}</p>
        <h2 class="title tx" id="t-${it.id}">${esc(it.title)}</h2>
        <p class="body tx">${esc(it.body)}</p>
      </div>`;
    }
    if (it.type === 'figure') {
      return Figure(images, { image: it.image, caption: it.caption, ratio: '3 / 2' }, { cls: 'fig--track', sizes: '(min-width: 1024px) 64vw, 100vw', data: 'track' });
    }
    return `<div class="panel panel--cta"><p class="tx">${ctaLink(site, 'Agendar uma visita', 'visita')}</p></div>`;
  };
  return `
  <section class="track-sec" id="${s.id}" aria-label="Interiores" tabindex="-1" data-section data-ui="dark">
    <div class="track-pin">
      <div class="track">${s.items.map(item).join('')}</div>
      <div class="track-line" aria-hidden="true"><i></i></div>
    </div>
  </section>`;
}

function Suite(s, images) {
  const [a, b] = s.blocks;
  return `
  <section class="sec suite" id="${s.id}" aria-label="Suíte" tabindex="-1" data-section data-ui="light">
    <div id="${a.id}" class="block" tabindex="-1">
      ${Head(a)}
      <div class="grid">${Figure(images, a.figure, { cls: 'fig--wide' })}</div>
    </div>
    <div id="${b.id}" class="block grid split" tabindex="-1">
      <div class="split-text">
        <p class="label tx">${esc(b.label)}</p>
        <h2 class="title tx" id="t-${b.id}">${esc(b.title)}</h2>
        <p class="body tx">${esc(b.body)}</p>
      </div>
      ${Figure(images, b.figure, { cls: 'split-media', sizes: '(min-width: 1024px) 60vw, 100vw' })}
    </div>
  </section>`;
}

// Área externa: título, depois a piscina sai da grade e ocupa a tela; o texto
// e o convite sobem por cima da imagem.
function Expand(site, s, images) {
  const water = `<div class="water" style="clip-path:${poly(s.water)}" aria-hidden="true"><i></i></div>`;
  return `
  <section class="sec expand-head" id="${s.id}" aria-labelledby="t-${s.id}" tabindex="-1" data-section data-ui="dark">
    ${Head(s, { body: null })}
  </section>
  <section class="expand" aria-label="${esc(s.caption)}" data-section>
    <div class="expand-pin">
      <figure class="expand-media">
        ${Cover(images[s.image], { focus: s.focus, extra: water })}
        <figcaption class="sr-only">${esc(s.caption)}</figcaption>
      </figure>
    </div>
  </section>
  <section class="sec after" aria-label="Convite" data-section data-ui="dark">
    <div class="grid">
      <p class="body body--lead tx">${esc(s.body)}</p>
      <p class="after-cta tx">${ctaLink(site, 'Agendar uma visita', 'visita')}</p>
    </div>
  </section>`;
}

// Planta: o desenho acontece com o scroll; os marcadores levam o nome das
// partes do percurso e acendem junto com a legenda.
function PlanSection(s, plans) {
  const drawing = (key) => {
    const p = plans[key];
    const [w, h] = p.size;
    const marks = s.markers.map((m, i) => ({ ...m, i })).filter((m) => m.plan === key);
    return `
      <figure class="plan plan--${key}">
        <div class="plan-draw" style="aspect-ratio:${w} / ${h}" data-plan>
          <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(p.alt)}">
            ${p.paths.map(([cls, d]) => `<path class="${cls.split(' ').map((c) => `pl-${c}`).join(' ')}" pathLength="1" d="${d}"/>`).join('')}
          </svg>
          ${p.labels.map(([t, x, y]) => `<span class="plan-label" style="left:${((x / w) * 100).toFixed(2)}%;top:${((y / h) * 100).toFixed(2)}%" aria-hidden="true">${esc(t)}</span>`).join('')}
          ${marks.length ? `
          <ul class="markers" aria-label="Partes do percurso">
            ${marks.map((m) => `
              <li class="mk mk--plan" data-i="${m.i}" style="left:${m.point[0] * 100}%;top:${m.point[1] * 100}%">
                <button type="button" aria-pressed="false">
                  <span class="mk-dot" aria-hidden="true">${m.i + 1}</span><span class="mk-label">${esc(m.label)}</span>
                </button>
              </li>`).join('')}
          </ul>` : ''}
        </div>
        <figcaption>${esc(p.caption)}</figcaption>
      </figure>`;
  };
  return `
  <section class="sec plan-sec" id="${s.id}" aria-labelledby="t-${s.id}" tabindex="-1" data-section data-ui="dark">
    ${Head(s, { body: s.note })}
    <div class="grid plans">
      ${drawing('terreo')}
      <div class="plans-side">
        ${drawing('suite')}
        <ol class="legend" aria-label="Legenda">
          ${s.markers.map((m, i) => `<li data-i="${i}"><span class="legend-n">${pad(i + 1)}</span>${esc(m.label)}</li>`).join('')}
        </ol>
      </div>
    </div>
  </section>`;
}

function Contact(site, s) {
  const c = site.contact;
  const row = (label, value, href) => `
    <div class="canal"><dt>${label}</dt><dd>${value
      ? (href ? `<a href="${href}">${esc(value)}</a>` : esc(value))
      : '<span class="tbd">A definir</span>'}</dd></div>`;
  return `
  <section class="sec conv" id="${s.id}" aria-labelledby="t-${s.id}" tabindex="-1" data-section data-ui="dark">
    <div class="grid">
      <p class="label tx">${esc(s.label)}</p>
      <h2 class="conv-title tx" id="t-${s.id}">${esc(s.title)}</h2>
      <ul class="conv-actions tx">
        ${s.actions.map((a) => `<li>${a.href
          ? `<a class="cta cta--large" href="${a.href}"><span>${esc(a.label)}</span><i aria-hidden="true"></i></a>`
          : ctaLink(site, a.label, a.intent, 'cta cta--large')}</li>`).join('')}
      </ul>
      <dl class="canais tx" id="canais" tabindex="-1">
        ${row('WhatsApp', c.whatsapp && `+${c.whatsapp}`, c.whatsapp && `https://wa.me/${c.whatsapp}`)}
        ${row('Telefone', c.phone, c.phone && `tel:${c.phone.replace(/\D/g, '')}`)}
        ${row('E-mail', c.email, c.email && `mailto:${c.email}`)}
        ${row('Cidade', site.city)}
      </dl>
      ${!c.whatsapp && !c.email && !c.phone ? '<p class="conv-note tx">Canais de atendimento ainda não definidos. Os dados serão publicados aqui.</p>' : ''}
    </div>
  </section>`;
}

export function Sections(site, sections, images, plans) {
  return sections.map((s) => {
    switch (s.kind) {
      case 'hero': return Hero(site, s, images);
      case 'intro': return Intro(s);
      case 'feature': return Feature(s, images);
      case 'track': return Track(site, s, images);
      case 'suite': return Suite(s, images);
      case 'expand': return Expand(site, s, images);
      case 'plan': return PlanSection(s, plans);
      case 'contact': return Contact(site, s);
      default: return '';
    }
  }).join('');
}

export function Footer(site, sections) {
  const items = sections.filter((s) => s.menu);
  return `
  <footer class="ft">
    <div class="grid">
      <p class="ft-brand">${Monogram()}<span>${esc(site.name)}</span></p>
      <p class="ft-city">${esc(site.city)}</p>
      <nav class="ft-nav" aria-label="Rodapé">
        <ul>${items.map((s) => `<li><a href="#${s.id}">${esc(s.menu)}</a></li>`).join('')}</ul>
      </nav>
      <p class="ft-legal">Imagens ilustrativas. Este site não usa cookies nem coleta dados pessoais.</p>
      <a class="ft-top" href="#preludio">Voltar ao topo</a>
    </div>
  </footer>`;
}
