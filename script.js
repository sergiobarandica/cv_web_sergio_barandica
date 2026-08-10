/**
 * script.js
 * Componentes gráficos e interactivos del sitio web tipo curriculum vitae
 * de Sergio Andrés Barandica Pérez.
 *
 * Evidencia GA7-220501102-AA1-EV01 — Codificación de los elementos y
 * componentes gráficos e interactivos necesarios para la elaboración
 * del producto multimedia — Tecnólogo en Desarrollo Multimedia y Web (SENA).
 *
 * Componentes codificados en este archivo:
 *   1. Menú de navegación adaptable (hamburguesa) para pantallas pequeñas
 *   2. Resaltado de la sección activa en el menú (scroll-spy)
 *   3. Botón "Volver arriba"
 *   4. Revelado progresivo de secciones al hacer scroll
 *   5. Filtro interactivo de certificaciones por categoría
 *
 * No se usan librerías externas: todo el código está escrito en
 * JavaScript nativo (vanilla JS), coherente con la decisión de HTML5 +
 * CSS3 + JS nativo tomada en el informe de estructura del proyecto
 * (evidencia GA6-220501102-AA1-EV03).
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initScrollSpy();
  initBackToTop();
  initScrollReveal();
  initCertFilters();
});

/* ------------------------------------------------------------------ *
 * 1. Menú de navegación adaptable (hamburguesa)
 * ------------------------------------------------------------------ *
 * Algoritmo:
 *   1. Obtener el botón toggle (#navToggle) y el contenedor de
 *      enlaces (#navLinks).
 *   2. Al hacer clic en el botón:
 *        a. Alternar la clase "is-open" en el contenedor de enlaces.
 *        b. Alternar la clase "is-active" en el botón (anima el
 *           ícono de tres líneas hacia una "X").
 *        c. Actualizar el atributo aria-expanded según el nuevo estado.
 *   3. Al hacer clic en cualquier enlace del menú, cerrarlo (para que
 *      no quede abierto tras navegar a una sección).
 * ------------------------------------------------------------------ */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.classList.toggle('is-active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ------------------------------------------------------------------ *
 * 2. Resaltado de la sección activa en el menú (scroll-spy)
 * ------------------------------------------------------------------ *
 * Algoritmo:
 *   1. Seleccionar todas las <section> que tienen id (perfil,
 *      educacion, experiencia, formacion, contacto) y los enlaces
 *      del menú que apuntan a ellas.
 *   2. Crear un IntersectionObserver cuyo margen de intersección
 *      (rootMargin) define una franja angosta hacia el centro de la
 *      pantalla: una sección se considera "activa" cuando cruza esa
 *      franja al hacer scroll.
 *   3. Cada vez que el observer notifica un cambio:
 *        a. Quitar la clase "is-active" de todos los enlaces.
 *        b. Añadir "is-active" solo al enlace cuyo href coincide con
 *           el id de la sección que está intersectando.
 * ------------------------------------------------------------------ */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const linkFor = (id) => document.querySelector(`.nav-links a[href="#${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('is-active'));
          const activeLink = linkFor(entry.target.id);
          if (activeLink) activeLink.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ------------------------------------------------------------------ *
 * 3. Botón "Volver arriba"
 * ------------------------------------------------------------------ *
 * Algoritmo:
 *   1. Obtener el botón #backToTop.
 *   2. Escuchar el evento "scroll" de la ventana.
 *   3. En cada evento: si la posición vertical del scroll supera un
 *      umbral (480px), mostrar el botón (clase "is-visible");
 *      de lo contrario, ocultarlo.
 *   4. Al hacer clic en el botón, desplazar la ventana suavemente
 *      hasta la parte superior de la página.
 * ------------------------------------------------------------------ */
function initBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) return;

  const UMBRAL_PX = 480;

  const toggleVisibility = () => {
    button.classList.toggle('is-visible', window.scrollY > UMBRAL_PX);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ------------------------------------------------------------------ *
 * 4. Revelado progresivo de secciones al hacer scroll
 * ------------------------------------------------------------------ *
 * Algoritmo:
 *   1. Seleccionar todos los elementos con la clase "reveal"
 *      (aplicada a cada <section> del sitio).
 *   2. Si el usuario tiene activada la preferencia del sistema
 *      "prefers-reduced-motion", mostrar todos los elementos de
 *      inmediato y omitir la animación.
 *   3. En caso contrario, crear un IntersectionObserver que, cuando
 *      un elemento "reveal" entra en el viewport:
 *        a. Le añade la clase "is-visible" (dispara la transición
 *           CSS de opacidad y desplazamiento definida en style.css).
 *        b. Deja de observarlo (unobserve), para que el efecto
 *           ocurra una única vez por elemento.
 * ------------------------------------------------------------------ */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/* ------------------------------------------------------------------ *
 * 5. Filtro interactivo de certificaciones por categoría
 * ------------------------------------------------------------------ *
 * Algoritmo:
 *   1. Seleccionar los botones de filtro (.filter-btn) y las columnas
 *      de certificados que tienen un atributo data-category
 *      (pedagogia, tics, investigacion).
 *   2. Al hacer clic en un botón de filtro:
 *        a. Quitar la clase "is-active" de todos los botones y
 *           añadirla solo al presionado.
 *        b. Leer el valor de su atributo data-filter.
 *        c. Recorrer las columnas de certificados: si el filtro es
 *           "todas" o coincide con el data-category de la columna,
 *           mostrarla; en caso contrario, ocultarla con la clase
 *           "is-hidden".
 * ------------------------------------------------------------------ */
function initCertFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const categoryColumns = document.querySelectorAll(
    '.formacion-grid > div[data-category]'
  );
  if (!filterButtons.length || !categoryColumns.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('is-active'));
      button.classList.add('is-active');

      const filter = button.dataset.filter;
      categoryColumns.forEach((column) => {
        const matches = filter === 'todas' || column.dataset.category === filter;
        column.classList.toggle('is-hidden', !matches);
      });
    });
  });
}
