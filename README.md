# Sin Miedo Café

Web de una página para Sin Miedo Café · Café & Brunch (Carrer Poeta Campos Vasallo, 9, 03004 Alicante).
Personalidad de la marca: rojo de la puerta, crema del sol, negro de la fachada y el azul cielo de los carteles de "Arte"; humor, toque colombiano y planes de arte y merienda.

## Cómo verla

    python -m http.server 8000

y entra en http://localhost:8000. No hay nada que instalar: fuentes (Titan One, Questrial, DM Serif Display, Caveat Brush) y GSAP van en `assets/`, sin CDN.

## Estructura

    index.html        Toda la página
    css/style.css     Estilos (tokens de color y tipografía arriba)
    js/main.js        Interacciones (GSAP + ScrollTrigger), selector "primera vez", horario en vivo
    assets/img/       Logo y sol vectorizados desde los originales (rojo y crema), fotos en WebP
    assets/fonts/     woff2
    raw/              Material original (fotos del cliente e Instagram). No hace falta publicarlo.

El logo (`logo.svg`, `logo-crema.svg`) está trazado a vector desde el PNG limpio del cliente (`raw/cliente/logo-limpio.png`). El sol (`sun-rays.svg` + `sun-face.svg`) también: los rayos giran y, al pulsar el sol del hero, suelta frases. La cara no sigue al ratón (decisión del cliente).

## Secciones

1. **Hero** — logo gigante, "Café sin filtros / Brunch sin reglas / Planes sin miedo", sol interactivo, polaroids, 5,0 en Google y pet friendly.
2. **A domicilio** — franja negra de una línea con el botón de Glovo.
3. **¿Qué pedir tu primera vez?** — selector con 5 estados de ánimo (versión web de su carrusel de Instagram).
4. **La carta** — salado, dulce y bebidas con descripciones pensadas para SEO (también en JSON-LD como `hasMenu`) y el plato del mes.
5. **Planes sin miedo** — talleres de arte y merienda en tarjetas apiladas.
6. **El local** — galería horizontal fijada (en móvil, carrusel con snap).
7. **Opiniones** — 5,0 · 169 reseñas de Google, cinco reseñas reales.
8. **Visítanos** — horario con el día de hoy marcado y estado abierto/cerrado (hora de Madrid), mapa, Glovo.

## Datos y fuentes (octubre 2026)

- Horario (Google): martes a domingo 8:30–16:00, lunes cerrado. Teléfono 965 22 04 60.
- Platos: Glovo e Instagram. Reseñas: Google Maps.
- **Sin precios a propósito**: los de Glovo no son los de barra. Si el cliente pasa la carta del local, añadirlos en `index.html` (sección `#carta`).

## Pendiente de confirmar con el cliente

- Precios en barra y carta de cafés completa.
- Plato del mes actual (la web cita los huevos turcos de septiembre).
- Si quieren mostrar los nombres del equipo (Laura y Daniela salen en las reseñas).
- Enlace de TikTok y si tienen WhatsApp para reservas de talleres (ahora se reserva por DM de Instagram).
- Fotos en alta resolución: las de Instagram están a 640 px.
