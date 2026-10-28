import { site, images, sections } from './content.js';
import { plans } from './plans.js';
import { Header, Menu, Progress, Sections, Footer } from './components.js';
import { initNav } from './nav.js';

const app = document.getElementById('app');
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// --- montagem -------------------------------------------------------------
app.innerHTML = `
  ${Header(site)}
  ${Menu(site, sections)}
  ${Progress(sections)}
  <main id="conteudo" tabindex="-1">${Sections(site, sections, images, plans)}</main>
  ${Footer(site, sections)}
  <div class="curtain" aria-hidden="true"></div>`;

root.classList.toggle('rm', reduce.matches);
const probe = Object.assign(document.createElement('div'), { className: 'svh-probe' });
document.body.append(probe);

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (v, a, b) => clamp((v - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const docTop = (n) => n.getBoundingClientRect().top + window.scrollY;

const el = {
  hero: $('.hero'),
  heroMedia: $('.hero-media'),
  heroCover: $('.hero-media .cover'),
  heroHead: $('.hero-head'),
  heroCue: $('.hero-cue'),
  track: $('.track-sec'),
  rail: $('.track'),
  railFill: $('.track-line i'),
  expand: $('.expand'),
  expMedia: $('.expand-media'),
  expCover: $('.expand-media .cover'),
  grid: $('.grid'),
};

const state = {
  vw: 0,
  svh: 0,
  wide: false,
  portrait: false,
  margin: 20,
  trackD: 0,
  geo: {},
  figs: [],
  railFigs: [],
  secs: [],
  heroUi: 'dark',
  expUi: 'dark',
  running: false,
};

const reduced = () => root.classList.contains('rm');

// Seções na ordem do DOM; as que não estão no indicador herdam a anterior.
const navIds = new Set(sections.map((s) => s.id));
{
  let last = sections[0].id;
  state.secs = $$('[data-section]').map((node) => {
    if (navIds.has(node.id)) last = node.id;
    return { node, nav: last, ui: node.dataset.ui || 'dark', top: 0 };
  });
}

// --- medidas ----------------------------------------------------------------
function measure() {
  state.vw = window.innerWidth;
  state.svh = probe.offsetHeight;
  state.portrait = state.vw / state.svh < 0.9;
  state.wide = !reduced() && state.vw >= 1024 && state.vw / state.svh >= 1.15;
  root.classList.toggle('is-wide', state.wide);
  state.margin = parseFloat(getComputedStyle(el.grid).paddingLeft) || 20;

  // Trilho: a distância horizontal vira altura de rolagem, mais um viewport
  // em que a seção seguinte sobe por cima.
  el.rail.style.transform = '';
  el.track.style.height = '';
  state.trackD = state.wide ? Math.max(0, el.rail.scrollWidth - state.vw) : 0;
  // Pausa curta no fim do trilho para o convite ser lido antes da suíte subir.
  if (state.wide) el.track.style.height = `${state.trackD + 2.35 * state.svh}px`;

  state.geo.hero = { top: docTop(el.hero), h: el.hero.offsetHeight };
  state.geo.expand = { top: docTop(el.expand), h: el.expand.offsetHeight };
  state.geo.track = { top: docTop(el.track), h: el.track.offsetHeight };

  const sel = ['[data-fig="reveal"]'];
  if (!state.wide) sel.push('[data-fig="track"]');
  $$('.fig-frame').forEach((f) => { f.style.clipPath = ''; });
  state.figs = $$(sel.join(',')).map((fig) => {
    const frame = $('.fig-frame', fig);
    return {
      frame,
      cover: $('.cover', fig),
      vig: $('.fig-vignette', fig),
      zoom: fig.dataset.zoom ? fig.dataset.zoom.split(',').map(Number) : null,
      top: docTop(frame),
      h: frame.offsetHeight,
      last: '',
    };
  });
  state.railFigs = state.wide
    ? $$('[data-fig="track"]').map((fig) => ({ cover: $('.cover', fig), cx: fig.offsetLeft + fig.offsetWidth / 2 }))
    : [];
  state.plans = $$('[data-plan]').map((node) => ({ node, top: docTop(node), last: '' }));
  state.secs.forEach((s) => { s.top = docTop(s.node); });
  update(true);
}

// --- quadro -----------------------------------------------------------------
// Tudo é função direta do scroll, sem suavização própria: as passagens andam
// junto com a página, em linha reta.
function update(force = false) {
  const y = window.scrollY;
  const { vw, svh: vh } = state;

  if (!reduced()) {
    // Abertura: uma linha de horizonte se abre até a fachada ocupar a tela,
    // enquanto a câmera recua do portão para a casa inteira.
    const H = state.geo.hero;
    if (force || y < H.top + H.h) {
      const A = H.h - 2 * vh;
      const p = clamp((y - H.top) / A);
      const q = clamp((y - H.top - A) / vh);
      const a = seg(p, 0, 0.6);
      const y0 = (state.portrait ? 0.62 : 0.66) * vh;
      const w0 = (state.portrait ? 0.7 : 0.3) * vw;
      const t = lerp(y0 - 1, 0, a);
      const b = lerp(vh - y0 - 1, 0, a);
      const s = lerp((vw - w0) / 2, 0, a);
      el.heroMedia.style.clipPath = `inset(${t.toFixed(1)}px ${s.toFixed(1)}px ${b.toFixed(1)}px ${s.toFixed(1)}px)`;
      el.heroCover.style.transform = `translate3d(0, ${(-q * 0.06 * vh).toFixed(1)}px, 0) scale(${lerp(1.18, 1, p).toFixed(4)})`;
      const hp = seg(p, 0.03, 0.28);
      el.heroHead.style.opacity = (1 - hp).toFixed(3);
      el.heroHead.style.transform = `translate3d(0, ${(-hp * 48).toFixed(1)}px, 0)`;
      el.heroCue.style.opacity = (1 - seg(p, 0, 0.1)).toFixed(3);
      state.heroUi = a > 0.4 ? 'light' : 'dark';
    }

    // Interiores: o trilho anda na horizontal na mesma medida do scroll.
    if (state.wide) {
      const T = state.geo.track;
      // As fotos do trilho ficam fora da tela na horizontal; carrega antes de chegar.
      if (!state.railLoaded && y > T.top - 2 * vh) {
        state.railLoaded = true;
        $$('.fig--track img').forEach((img) => { img.loading = 'eager'; });
      }
      const p = clamp((y - T.top) / Math.max(1, state.trackD));
      const x = -p * state.trackD;
      el.rail.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
      el.railFill.style.transform = `scaleX(${p.toFixed(4)})`;
      state.railFigs.forEach((f) => {
        const off = clamp((f.cx + x - vw / 2) / vw, -1, 1);
        f.cover.style.transform = `translate3d(${(-off * 3.5).toFixed(3)}%, 0, 0) scale(1.08)`;
      });
    }

    // Área externa: a piscina sai da largura da grade e ocupa a tela.
    const E = state.geo.expand;
    if (force || (y > E.top - vh && y < E.top + E.h)) {
      const A = E.h - 2 * vh;
      const p = clamp((y - E.top) / A);
      const q = clamp((y - E.top - A) / vh);
      const e = seg(p, 0, 0.8);
      const w = vw - 2 * state.margin;
      const h = state.portrait ? Math.min(w * 1.25, vh * 0.72) : Math.min(w * (9 / 16), vh * 0.78);
      const ww = state.portrait ? w : Math.min(w, h * (16 / 9));
      const x0 = ((vw - ww) / 2) * (1 - e);
      const y0 = ((vh - h) / 2) * (1 - e);
      el.expMedia.style.clipPath = `inset(${y0.toFixed(1)}px ${x0.toFixed(1)}px ${y0.toFixed(1)}px ${x0.toFixed(1)}px)`;
      el.expCover.style.transform = `translate3d(0, ${(-q * 0.06 * vh).toFixed(1)}px, 0) scale(${lerp(1.12, 1, e).toFixed(4)})`;
      el.expand.classList.toggle('is-full', e >= 1 && q < 1);
      state.expUi = e > 0.55 ? 'light' : 'dark';
    }

    // Figuras do fluxo: abrem a partir da linha central ao entrar na tela.
    state.figs.forEach((f) => {
      const r = clamp((y + vh - f.top) / (0.62 * vh));
      const pass = clamp((y + vh - f.top) / (vh + f.h));
      const key = `${r.toFixed(3)}|${pass.toFixed(3)}`;
      if (!force && key === f.last) return;
      f.last = key;
      const c = ((1 - r) * 50).toFixed(2);
      f.frame.style.clipPath = r >= 1 ? 'none' : `inset(${c}% 0 ${c}% 0)`;
      const sc = f.zoom ? lerp(f.zoom[0], f.zoom[1], pass) : lerp(1.12, 1, r);
      f.cover.style.transform = `scale(${sc.toFixed(4)})`;
      if (f.vig) f.vig.style.opacity = (seg(pass, 0.35, 0.85) * 0.6).toFixed(3);
    });

    // Planta: paredes primeiro, depois vidros e mobiliário, por fim os nomes.
    state.plans.forEach((pl) => {
      const p = clamp((y + vh - pl.top) / (0.9 * vh));
      const key = p.toFixed(3);
      if (!force && key === pl.last) return;
      pl.last = key;
      pl.node.style.setProperty('--d1', seg(p, 0, 0.55).toFixed(3));
      pl.node.style.setProperty('--d2', seg(p, 0.3, 0.85).toFixed(3));
      pl.node.style.setProperty('--d3', seg(p, 0.7, 1).toFixed(3));
    });
  }

  // Cabeçalho, indicador e cor da interface conforme o que está sob eles.
  const at = (sy) => {
    let cur = state.secs[0];
    state.secs.forEach((s) => { if (s.top <= sy) cur = s; });
    return cur;
  };
  const uiOf = (s) => (s.node === el.hero ? state.heroUi : s.node === el.expand ? state.expUi : s.ui);
  const head = at(y + 40);
  const mid = at(y + vh * 0.5);
  nav.setState({
    nav: mid.nav,
    ui: uiOf(head),
    progUi: uiOf(mid),
    atStart: !reduced() && y < state.geo.hero.top + (state.geo.hero.h - 2 * vh) * 0.3,
    progress: clamp(y / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)),
  });
}

function kick() {
  if (state.running) return;
  state.running = true;
  requestAnimationFrame(() => { state.running = false; update(); });
}

// --- texto ------------------------------------------------------------------
function observeText() {
  if (reduced()) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  $$('.tx').forEach((n) => io.observe(n));
}

// --- planta: marcadores e legenda se acendem juntos -------------------------
function linkMap() {
  const mks = $$('.mk');
  const items = $$('.legend li');
  const light = (i) => {
    mks.forEach((m) => m.classList.toggle('is-on', +m.dataset.i === i));
    items.forEach((l) => l.classList.toggle('is-on', +l.dataset.i === i));
  };
  const pressed = () => {
    const m = mks.find((x) => $('button', x).getAttribute('aria-pressed') === 'true');
    return m ? +m.dataset.i : -1;
  };
  items.forEach((li) => {
    li.addEventListener('mouseenter', () => light(+li.dataset.i));
    li.addEventListener('mouseleave', () => light(pressed()));
  });
  mks.forEach((m) => {
    const i = +m.dataset.i;
    const b = $('button', m);
    b.addEventListener('mouseenter', () => light(i));
    b.addEventListener('mouseleave', () => light(pressed()));
    b.addEventListener('focus', () => light(i));
    b.addEventListener('blur', () => light(pressed()));
    // Toque: mostra só o nome da área; outro toque esconde.
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      mks.forEach((x) => $('button', x).setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', String(on));
      light(on ? i : -1);
    });
  });
}

// --- início -----------------------------------------------------------------
function getTarget(id) {
  const node = document.getElementById(id);
  if (!node || node === el.hero) return 0;
  // Painéis do trilho: o ponto do scroll em que o painel chega à margem.
  if (state.wide && node.classList.contains('panel')) {
    return state.geo.track.top + Math.min(state.trackD, Math.max(0, node.offsetLeft - state.margin));
  }
  return docTop(node);
}

const nav = initNav({ state, getTarget, onJump: () => update() });

// Teclado no trilho: focar um item fora da tela leva o scroll até ele.
function linkRailFocus() {
  el.rail.addEventListener('focusin', (e) => {
    if (!state.wide) return;
    const item = e.target.closest('.panel, .fig');
    if (!item) return;
    const x = clamp(item.offsetLeft - state.margin, 0, state.trackD);
    window.scrollTo({ top: state.geo.track.top + x, behavior: 'instant' });
  });
}

function boot() {
  measure();
  observeText();
  linkMap();
  linkRailFocus();
  window.addEventListener('scroll', kick, { passive: true });
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 120);
  });
  reduce.addEventListener('change', () => window.location.reload());
  if (location.hash) nav.jump(location.hash.slice(1), { instant: true });
  root.classList.add('is-ready');
}

if (document.fonts?.ready) document.fonts.ready.then(boot); else boot();
