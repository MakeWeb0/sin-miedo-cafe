/* Sin Miedo Café — interacciones (GSAP + ScrollTrigger) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  introHero();

  /* ---------- nav: sólida al bajar, se esconde al seguir bajando ---------- */
  // El umbral es el final del hero (no innerHeight, que en móvil cambia con la barra del navegador)
  // y solo se esconde/enseña con un desplazamiento claro, para que no tiemble con la inercia.
  const nav = $('[data-nav]');
  const hero = $('.hero');
  let ultimoY = scrollY;
  const onScroll = () => {
    const y = Math.max(0, scrollY);
    const finHero = hero.offsetHeight - nav.offsetHeight;
    nav.classList.toggle('solida', y > finHero);
    const delta = y - ultimoY;
    if (Math.abs(delta) < 8) return;
    nav.classList.toggle('oculta', delta > 0 && y > finHero + 120 && !document.body.classList.contains('abierto'));
    ultimoY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- menú móvil ---------- */
  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  const cerrarMenu = () => {
    document.body.classList.remove('abierto');
    menu.classList.remove('visible');
    burger.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (!menu.classList.contains('visible')) menu.hidden = true; }, 700);
  };
  burger.addEventListener('click', () => {
    if (menu.classList.contains('visible')) return cerrarMenu();
    menu.hidden = false;
    requestAnimationFrame(() => {
      menu.classList.add('visible');
      document.body.classList.add('abierto');
      burger.setAttribute('aria-expanded', 'true');
    });
  });
  $$('a', menu).forEach(a => a.addEventListener('click', cerrarMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('visible')) cerrarMenu(); });

  const frases = [
    '¿Otro café? Sin miedo.',
    'Aquí lo único que quema no es el café.',
    'Brunch sin reglas, ¿eh?',
    'Pide la limonada de coco. Hazme caso.',
    'No muerdo. El croissant sí.',
    '¡Tócame otra vez, sin miedo!'
  ];
  const sol = $('[data-sol]');
  const bocadillo = $('[data-bocadillo]');
  let iFrase = 0, tBocadillo;
  sol?.addEventListener('click', () => {
    bocadillo.textContent = frases[iFrase++ % frases.length];
    bocadillo.classList.add('ver');
    sol.classList.remove('risa'); void sol.offsetWidth; sol.classList.add('risa');
    clearTimeout(tBocadillo);
    tBocadillo = setTimeout(() => bocadillo.classList.remove('ver'), 2600);
  });

  /* ---------- ¿qué pedir tu primera vez? ---------- */
  const PLANES = {
    hambre: { num: 'Tu pedido', titulo: 'Bacon Mood', mas: '+ un café colombiano', img: 'assets/img/tostada-bacon.webp',
      txt: 'Tostada de pan artesanal con crema de aguacate, huevos revueltos y bacon. Crujiente por fuera, brutal por dentro.' },
    dulce: { num: 'Tu pedido', titulo: 'Tortitas', mas: '+ un iced latte caramel', img: null,
      txt: 'Con dulce de leche, arándanos y plátano. Y si después te cabe un tiramisú casero, aquí nadie te juzga.' },
    colombia: { num: 'Tu pedido', titulo: 'Desayuno Criollo', mas: '+ una limonada de coco', img: null,
      txt: 'Dos huevos revueltos o con guiso, chorizo colombiano, arepa de maíz y mozzarella. Para cerrar, una Pony Malta si eres de los que saben.' },
    cafe: { num: 'Tu pedido', titulo: 'Café colombiano', mas: '+ un croissant recién horneado', img: null,
      txt: 'Venías “solo a por un café”. Ya, claro. Los croissants están recién horneados y huelen demasiado bien.' },
    nuevo: { num: 'Tu pedido', titulo: 'El plato del mes', mas: 'cambia cada mes', img: 'assets/img/huevos-turcos.webp',
      txt: 'Cada mes, un plato que no vuelve. El de septiembre: huevos turcos con mantequilla picante. Pregunta cuál toca hoy.' }
  };
  const receta = $('[data-receta]');
  const rImg = $('[data-receta-img]');
  const rGraf = $('[data-receta-grafico]');
  const pintarReceta = clave => {
    const p = PLANES[clave];
    $('[data-receta-num]').textContent = p.num;
    $('[data-receta-titulo]').textContent = p.titulo;
    $('[data-receta-mas]').textContent = p.mas;
    $('[data-receta-txt]').textContent = p.txt;
    if (p.img) { rImg.src = p.img; rImg.hidden = false; rGraf.hidden = true; }
    else { rImg.hidden = true; rGraf.hidden = false; }
  };
  $$('[data-plan]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-plan]').forEach(b => b.setAttribute('aria-selected', String(b === btn)));
    if (hasGsap && !reduce) {
      gsap.timeline()
        .to(receta, { rotate: -2, y: 14, opacity: 0, duration: .18, ease: 'power2.in' })
        .add(() => pintarReceta(btn.dataset.plan))
        .fromTo(receta, { rotate: 2, y: -14 }, { rotate: 0, y: 0, opacity: 1, duration: .55, ease: 'back.out(2)' });
    } else pintarReceta(btn.dataset.plan);
  }));

  /* ---------- pestañas de la carta ---------- */
  const tabs = $$('.pestanas [role="tab"]');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    const panel = $('#' + tab.getAttribute('aria-controls'));
    if (hasGsap && !reduce) gsap.from($$('li', panel), { y: 24, opacity: 0, stagger: .05, duration: .5, ease: 'power3.out' });
    if (hasGsap) ScrollTrigger.refresh();
  }));

  /* ---------- horario: hoy + abierto/cerrado (hora de Alicante) ---------- */
  const estado = $('[data-estado]');
  const ahoraMadrid = () => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { dia, min: +get('hour') * 60 + +get('minute') };
  };
  const pintarEstado = () => {
    const { dia, min } = ahoraMadrid();
    $$('.horario tr').forEach(tr => tr.classList.toggle('hoy', +tr.dataset.dia === dia));
    const abre = 8 * 60 + 30, cierra = 16 * 60;
    const abiertoHoy = dia !== 1;
    const txt = $('span', estado);
    estado.classList.remove('abierto-ya', 'cerrado-ya');
    if (abiertoHoy && min >= abre && min < cierra) {
      estado.classList.add('abierto-ya');
      txt.textContent = `Abierto ahora · hasta las 16:00`;
    } else {
      estado.classList.add('cerrado-ya');
      let cuando;
      if (abiertoHoy && min < abre) cuando = 'hoy a las 8:30';
      else if (dia === 0) cuando = 'el martes a las 8:30';
      else if (dia === 1) cuando = 'mañana a las 8:30';
      else cuando = 'mañana a las 8:30';
      txt.textContent = `Ahora cerrado · abrimos ${cuando}`;
    }
  };
  pintarEstado();
  setInterval(pintarEstado, 60000);

  $('[data-anio]').textContent = new Date().getFullYear();

  /* ---------- GSAP ---------- */
  function introHero() {
    if (!hasGsap || reduce) return;
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.hero__logo img', { scale: .6, rotate: -8, opacity: 0, duration: 1.1, ease: 'elastic.out(1, .55)' })
      .from('.hero__lema span', { yPercent: 110, duration: .8, stagger: .1 }, '-=.75')
      .from('.hero__ctas .btn', { y: 30, opacity: 0, stagger: .08, duration: .6 }, '-=.5')
      .from('.sol--hero', { scale: 0, rotate: -180, duration: 1.2, ease: 'back.out(1.6)' }, .15)
      .from('.polaroid', { y: -260, rotate: 0, opacity: 0, stagger: .12, duration: 1, ease: 'bounce.out' }, .45)
      .from('.hero .pegatina, .hero__estrella', { scale: 0, stagger: .1, duration: .7, ease: 'back.out(3)' }, .9)
      .from('.hero__hilo path', { strokeDasharray: 3000, strokeDashoffset: 3000, duration: 2.4, ease: 'power2.inOut' }, 0);
  }

  if (!hasGsap) {
    $$('[data-reveal]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  if (reduce) {
    gsap.set('[data-reveal]', { opacity: 1, y: 0 });
    return;
  }

  // titulares: palabra a palabra, letra a letra, con rebote
  $$('[data-split]').forEach(h => {
    const palabras = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.innerHTML = palabras.map(p => `<span class="w" aria-hidden="true">${[...p].map(c => `<span class="c">${c}</span>`).join('')}</span>`).join(' ');
    gsap.from($$('.c', h), {
      yPercent: 120, rotate: () => gsap.utils.random(-25, 25), opacity: 0,
      duration: .8, ease: 'back.out(2.2)', stagger: { amount: .45 },
      scrollTrigger: { trigger: h, start: 'top 85%' }
    });
  });

  // entradas suaves
  $$('[data-reveal]').forEach(el => gsap.to(el, {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  }));

  // parallax
  $$('[data-speed]').forEach(el => gsap.to(el, {
    yPercent: () => parseFloat(el.dataset.speed) * 100,
    ease: 'none',
    scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
  }));

  // el sol del hero se aleja girando al bajar
  gsap.to('.sol--hero', {
    rotate: 90, scale: .8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // tarjetas de planes que se apilan
  const eventos = $$('.evento');
  eventos.forEach((ev, i) => {
    if (i === eventos.length - 1) return;
    gsap.fromTo(ev, { scale: 1, filter: 'brightness(1)' }, {
      scale: .92, filter: 'brightness(.82)', ease: 'none',
      scrollTrigger: { trigger: eventos[i + 1], start: 'top bottom', end: 'top 7rem', scrub: true }
    });
  });

  // galería horizontal fijada (solo en pantallas anchas)
  const mm = gsap.matchMedia();
  mm.add('(min-width: 701px)', () => {
    const galeria = $('[data-galeria]');
    const pistaG = $('[data-galeria-pista]');
    const distancia = () => Math.max(0, pistaG.scrollWidth - innerWidth);
    gsap.to(pistaG, {
      x: () => -distancia(), ease: 'none',
      scrollTrigger: { trigger: galeria, start: 'center center', end: () => '+=' + distancia(), pin: '.local', scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 }
    });
  });

  // notas de opiniones caen como pegatinas
  gsap.from('.nota', {
    y: 80, rotate: () => gsap.utils.random(-14, 14), opacity: 0, stagger: .12, duration: .9, ease: 'back.out(1.6)',
    scrollTrigger: { trigger: '.notas', start: 'top 80%' }
  });

  // contador 0,0 → 5,0
  const cont = $('[data-contador]');
  if (cont) {
    const o = { v: 0 };
    gsap.to(o, {
      v: 5, duration: 1.6, ease: 'power3.out',
      onUpdate: () => { cont.textContent = o.v.toFixed(1).replace('.', ','); },
      scrollTrigger: { trigger: cont, start: 'top 85%' }
    });
  }

  // logo del pie entra estirándose
  gsap.from('.pie__logo', {
    yPercent: 40, scaleY: .4, opacity: 0, ease: 'elastic.out(1, .5)', duration: 1.6, transformOrigin: '50% 100%',
    scrollTrigger: { trigger: '.pie', start: 'top 75%' }
  });
  gsap.to('[data-sol-pie] .sol__cara', {
    rotate: 360, ease: 'none',
    scrollTrigger: { trigger: '.pie', start: 'top bottom', end: 'bottom bottom', scrub: true }
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
