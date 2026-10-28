// Cabeçalho, menu em tela cheia, indicador de capítulos e navegação por âncoras.

export function initNav({ state, getTarget, onJump }) {
  const root = document.documentElement;
  const header = document.querySelector('.hd');
  const btn = header.querySelector('.hd-menu');
  const btnLabel = btn.querySelector('.hd-menu-label');
  const menu = document.getElementById('menu');
  const curtain = document.querySelector('.curtain');
  const progLinks = [...document.querySelectorAll('.prog a')];
  const progFill = document.querySelector('.prog-line i');
  const outside = () => [document.getElementById('conteudo'), document.querySelector('.ft'), document.querySelector('.prog'), header.querySelector('.hd-brand')];
  const reduced = () => root.classList.contains('rm');
  let open = false;
  let lastFocus = null;

  // --- menu -----------------------------------------------------------------
  function setMenu(next, { restoreFocus = true } = {}) {
    if (next === open) return;
    open = next;
    btn.setAttribute('aria-expanded', String(open));
    btnLabel.textContent = open ? 'Fechar' : 'Menu';
    root.classList.toggle('menu-open', open);
    outside().forEach((el) => { el.inert = open; });
    if (open) {
      lastFocus = document.activeElement;
      menu.hidden = false;
      header.classList.remove('is-hidden');
      requestAnimationFrame(() => menu.classList.add('is-open'));
      menu.querySelector('a').focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      const done = () => { if (!open) menu.hidden = true; };
      if (reduced()) done(); else setTimeout(done, 520);
      if (restoreFocus) (lastFocus || btn).focus({ preventScroll: true });
    }
  }
  btn.addEventListener('click', () => setMenu(!open));
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); setMenu(false); return; }
    if (e.key !== 'Tab') return;
    // Foco preso entre o botão Fechar e os itens do menu.
    const items = [btn, ...menu.querySelectorAll('a')];
    const i = items.indexOf(document.activeElement);
    const n = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === items.length - 1 ? 0 : i + 1);
    e.preventDefault();
    items[n].focus();
  });

  // --- navegação ------------------------------------------------------------
  function jump(id, { instant = false } = {}) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = Math.max(0, Math.round(getTarget(id)));
    const far = Math.abs(top - window.scrollY) > state.svh * 1.5;
    const land = () => {
      window.scrollTo({ top, behavior: 'instant' });
      onJump();
      const focusEl = el.matches('section, [tabindex]') ? el : el.closest('section');
      focusEl?.focus({ preventScroll: true });
    };
    if (instant || reduced()) { land(); return; }
    if (!far) { window.scrollTo({ top, behavior: 'smooth' }); setTimeout(() => el.focus({ preventScroll: true }), 600); return; }
    // Distância longa: uma cortina curta evita atravessar todas as cenas.
    curtain.classList.add('is-on');
    setTimeout(() => {
      land();
      requestAnimationFrame(() => curtain.classList.remove('is-on'));
    }, 260);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    const wasOpen = open;
    if (open) setMenu(false, { restoreFocus: false });
    history.pushState(null, '', `#${id}`);
    setTimeout(() => jump(id), wasOpen && !reduced() ? 180 : 0);
  });
  window.addEventListener('popstate', () => jump(location.hash.slice(1) || 'preludio'));

  // --- cabeçalho ------------------------------------------------------------
  // Some ao descer pelas cenas e volta sempre que o usuário sobe.
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (Math.abs(y - lastY) < 6) return;
    const hide = y > lastY && y > state.svh * 0.6 && !open && !header.contains(document.activeElement);
    header.classList.toggle('is-hidden', hide);
    lastY = y;
  }, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  // --- estado ---------------------------------------------------------------
  const prog = document.querySelector('.prog');
  let current = null;
  function setState({ nav, ui, progUi, atStart, progress }) {
    if (header.dataset.ui !== ui) header.dataset.ui = ui;
    if (prog.dataset.ui !== progUi) prog.dataset.ui = progUi;
    root.classList.toggle('at-start', atStart);
    progFill.style.transform = `scaleX(${progress.toFixed(4)})`;
    if (nav === current) return;
    current = nav;
    progLinks.forEach((a) => {
      const on = a.dataset.id === nav;
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    });
  }

  return { setState, jump };
}
