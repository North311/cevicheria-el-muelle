// =========================================================
// Cevichería El Muelle — comportamiento compartido del sitio
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Header sólido al hacer scroll ---- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('solid', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Menú móvil (entrada/salida) ---- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---- Revelado al hacer scroll (una sola vez, intencional) ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- WhatsApp flotante: aparece tras un pequeño scroll ---- */
  const wa = document.querySelector('.whatsapp-float');
  if (wa) {
    const onScrollWA = () => wa.classList.toggle('show', window.scrollY > 260 || document.body.scrollHeight < 1200);
    onScrollWA();
    window.addEventListener('scroll', onScrollWA, { passive: true });
  }

  /* ---- Testimonios: carrusel simple con fundido ---- */
  const testis = document.querySelectorAll('.testi');
  const dots = document.querySelectorAll('.testi-dots button');
  if (testis.length) {
    let idx = 0;
    const show = (i) => {
      testis.forEach((t, n) => t.classList.toggle('active', n === i));
      dots.forEach((d, n) => d.classList.toggle('active', n === i));
      idx = i;
    };
    dots.forEach((d, n) => d.addEventListener('click', () => show(n)));
    setInterval(() => show((idx + 1) % testis.length), 5500);
  }

  /* ---- Carta: tabs por categoría ---- */
  const tabs = document.querySelectorAll('.menu-tab');
  const cats = document.querySelectorAll('.menu-category');
  if (tabs.length) {
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.target;
      cats.forEach(c => c.classList.toggle('active', c.id === target));
    }));
  }

  /* ---- Galería: lightbox liviano ---- */
  const lightbox = document.querySelector('.lightbox');
  const gItems = document.querySelectorAll('.g-item');
  if (lightbox && gItems.length) {
    const title = lightbox.querySelector('.lightbox-title');
    const desc = lightbox.querySelector('.lightbox-desc');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const bigImg = lightbox.querySelector('.lightbox-img');
    const open = (item) => {
      title.textContent = item.dataset.title || '';
      desc.textContent = item.dataset.desc || '';
      bigImg.src = item.dataset.img || '';
      bigImg.alt = item.dataset.title || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    gItems.forEach(item => item.addEventListener('click', () => open(item)));
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ---- Formularios: validación simple + confirmación animada ----
     Por ahora quedan en el navegador (sin backend). Los campos ya
     están nombrados igual que las tablas de la base de datos
     (reservas / contactos / suscriptores) para conectar el backend
     más adelante sin cambiar el HTML. */
  document.querySelectorAll('form[data-local-form]').forEach(form => {
    const card = form.closest('.form-card');
    const success = card ? card.querySelector('.form-success') : null;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (success) {
        form.style.display = 'none';
        success.classList.add('show');
      }
      form.reset();
    });
  });

  /* Reservas: no permitir fechas pasadas */
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  document.querySelectorAll('input[type="date"]').forEach(i => i.min = today);

  document.querySelectorAll('form[data-newsletter]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = '¡Listo!';
      form.reset();
      setTimeout(() => { btn.textContent = original; }, 2200);
    });
  });
});
