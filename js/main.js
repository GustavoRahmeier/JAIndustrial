(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const header = $('#header'), burger = $('#burger'), nav = $('#nav');
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    header.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12 });
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add('in'));

  document.querySelectorAll('[data-product]').forEach(b =>
    b.addEventListener('click', () => { $('#produto').value = b.dataset.product; }));

  const form = $('#form'), msg = $('#msg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = [...form.querySelectorAll('[required]')].filter(i => !i.value.trim() || !i.checkValidity());
    form.querySelectorAll('input').forEach(i => i.removeAttribute('aria-invalid'));
    msg.className = 'form__msg';
    if (bad.length) {
      bad.forEach(i => i.setAttribute('aria-invalid', 'true'));
      msg.textContent = 'Preencha nome, e-mail válido e telefone para continuar.';
      msg.classList.add('err'); bad[0].focus(); return;
    }
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      // Integração pendente: configure data-endpoint (e-mail/serviço de formulário) ou WhatsApp.
      msg.textContent = 'O envio online ainda não está ativo. Nenhuma solicitação foi enviada.';
      msg.classList.add('err'); return;
    }
    fetch(endpoint, { method: 'POST', body: new FormData(form) })
      .then(r => { if (!r.ok) throw 0; msg.textContent = 'Solicitação enviada. Retornaremos em breve.'; msg.classList.add('ok'); form.reset(); })
      .catch(() => { msg.textContent = 'Não foi possível enviar. Tente novamente.'; msg.classList.add('err'); });
  });
  $('#ano').textContent = new Date().getFullYear();
})();
