/* =====================================================================
   VIBRANS GOURMET — script.js
   ---------------------------------------------------------------------
   1. CONFIGURACIÓN  → número de WhatsApp, Instagram, correo, etc.
   2. DATOS          → servicios, productos, eventos, galería
   3. WHATSAPP       → mensajes, mini-mensajes del botón flotante
   4. RENDER         → pinta las secciones a partir de los datos
   5. PEDIDO         → selección de productos del catálogo
   6. FORMULARIO     → dos modos (cotizar evento / pedir pasabocas) → WhatsApp
   8. ALQUILER       → torres y bandejas + simulador de mesa
   7. EXPERIENCIA    → menú, animaciones, líneas doradas, parallax
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. CONFIGURACIÓN  (lo único que normalmente tendrás que cambiar)
   --------------------------------------------------------------------- */

// Número con código de país y SIN "+", espacios ni guiones.
const WHATSAPP_NUMBER   = '573053172716';
const WHATSAPP_DISPLAY  = '+57 305 317 2716';           // cómo se muestra en el footer

const INSTAGRAM_URL     = 'https://www.instagram.com/vibransgourmet';
const INSTAGRAM_HANDLE  = '@vibransgourmet';
const EMAIL             = 'hola@vibransgourmet.com';
const CITY              = 'Colombia';

// Enlace de la marca de agua "Diseñado por Sonetix" (pie de página). Si está vacío, se muestra sin enlace.
const SONETIX_URL       = 'https://sonetix.emanuelvillada10.workers.dev/';

// Backend opcional: si pones una URL, el formulario también enviará los datos (POST/JSON)
// además de abrir WhatsApp. Déjalo vacío para usar solo WhatsApp.
const FORM_ENDPOINT     = '';

/* ---------------------------------------------------------------------
   2. DATOS
   Para usar una foto real en cualquier tarjeta añade  img: 'assets/mi-foto.webp'
   (y opcionalmente pos: 'center 30%' para el encuadre). Si no hay `img`,
   se muestra una ilustración dorada sobre borgoña (campo `icon`).
   --------------------------------------------------------------------- */

const SERVICES = [
  { title: 'Pasabocas gourmet',   text: 'Bocados de autor, pensados para acompañar la conversación y sorprender al primer gusto.', img: 'assets/patacon.webp', pos: 'center 55%', alt: 'Patacón con carne desmechada y crema de cilantro' },
  { title: 'Catering para eventos', text: 'Propuestas gastronómicas personalizadas para bodas, eventos corporativos, cumpleaños, celebraciones y otros eventos.', img: 'assets/tostada.webp', pos: 'center 62%', alt: 'Tostada de pan artesanal con jamón serrano y rúcula' },
  { title: 'Alquiler de torres y bandejas', text: 'Torres de 2 y 3 pisos y bandejas para exhibir tus pasabocas, en alquiler con un depósito que cubre posibles daños.', icon: 'torre3' },
  { title: 'Eventos corporativos', text: 'Lanzamientos, reuniones y celebraciones de empresa con una presentación impecable.', icon: 'maletin' },
  { title: 'Celebraciones especiales', text: 'Bodas, cumpleaños y grados con un menú que cuenta tu historia.', img: 'assets/tostada-tomates.webp', pos: 'center', alt: 'Detalle de tomates cherry glaseados sobre una tostada gourmet' },
  { title: 'Eventos privados', text: 'Encuentros íntimos con atención cercana y una propuesta hecha solo para ti.', icon: 'copa' }
];

// Galería "Experiencia gourmet" (7 piezas: las clases t1…t7 definen la composición en style.css)
const EXPERIENCE = [
  { name: 'Patacón de carne desmechada', img: 'assets/patacon.webp',          pos: 'center 55%', alt: 'Patacón relleno de carne desmechada con crema de cilantro' },
  { name: 'Tostada de jamón serrano',    img: 'assets/tostada-tomates.webp',  pos: 'center',     alt: 'Tostada con tomate cherry glaseado y rúcula' },
  { name: 'Mini postres',                icon: 'postre' },
  { name: 'Canapés artesanales',         img: 'assets/tostada.webp',          pos: 'center 62%', alt: 'Canapé sobre pan artesanal con jamón serrano' },
  { name: 'Crema de cilantro',           img: 'assets/patacon-cilantro.webp', pos: 'center',     alt: 'Detalle de la crema de cilantro sobre el patacón' },
  { name: 'Tablas gourmet',              icon: 'tabla' },
  { name: 'Pan artesanal',               img: 'assets/tostada-pan.webp',      pos: 'center',     alt: 'Pan artesanal con queso crema y pesto' }
];

// Catálogo. Los dos primeros usan fotos reales; el resto son EJEMPLOS para reemplazar por tus productos.
const PRODUCTS = [
  { name: 'Patacón de carne desmechada', category: 'Pasabocas', desc: 'Canasta crujiente de patacón con carne desmechada, toque dulce caramelizado y crema de cilantro.', img: 'assets/patacon.webp', pos: 'center 55%', alt: 'Patacón de carne desmechada' },
  { name: 'Tostada de jamón serrano',    category: 'Canapés',   desc: 'Pan artesanal con queso crema, pesto, jamón serrano, rúcula y tomate cherry glaseado.', img: 'assets/tostada.webp', pos: 'center 62%', alt: 'Tostada de jamón serrano' },
  { name: 'Mini cheesecake de frutos rojos', category: 'Mini postres', desc: 'Porción individual cremosa, con base crocante y coulis de frutos rojos.', icon: 'postre' },
  { name: 'Tabla de quesos y charcutería', category: 'Tablas', desc: 'Selección de quesos, embutidos, frutos secos y frutas, montada para compartir.', icon: 'tabla' },
  { name: 'Brocheta caprese', category: 'Pasabocas', desc: 'Tomate cherry, mozzarella fresca y albahaca con reducción de balsámico.', icon: 'canape' },
  { name: 'Tartaleta de chocolate', category: 'Mini postres', desc: 'Masa mantecosa rellena de ganache de chocolate oscuro y sal en escamas.', icon: 'postre' }
];

// Tipos de evento. `single` es el texto que se usa en el mensaje de WhatsApp ("será una boda…").
const EVENTS = [
  { title: 'Bodas',                  single: 'una boda',                 text: 'El menú del día más importante, con detalles que tus invitados recordarán.', icon: 'anillos' },
  { title: 'Cumpleaños',             single: 'un cumpleaños',            text: 'Celebraciones con sabor, desde reuniones íntimas hasta grandes fiestas.',    icon: 'torta' },
  { title: 'Eventos empresariales',  single: 'un evento empresarial',    text: 'Lanzamientos, reuniones y cierres con pasabocas elegantes y fáciles de compartir.', icon: 'maletin' },
  { title: 'Graduaciones',           single: 'una graduación',           text: 'Un brindis a la altura del logro, con pasabocas pensados para compartir.',  icon: 'birrete' },
  { title: 'Reuniones',              single: 'una reunión',              text: 'Encuentros de trabajo o de amigos con bocados prácticos y exquisitos.',     icon: 'grupo' },
  { title: 'Celebraciones privadas', single: 'una celebración privada',  text: 'Momentos íntimos con pasabocas pensados para compartir en buena compañía.',    icon: 'copa' },
  { title: 'Eventos especiales',     single: 'un evento especial',       text: 'Si es único, merece una propuesta única. Cuéntanos tu idea.',               icon: 'estrella' }
];

const SERVICE_TYPES = ['Pasabocas gourmet', 'Catering para eventos', 'Alquiler de torres y bandejas', 'Evento corporativo', 'Aún no lo tengo claro'];

// Galería / Instagram (reemplaza por tus fotos o conecta un feed más adelante)
const GALLERY = [
  { img: 'assets/patacon-cilantro.webp', pos: 'center',     alt: 'Detalle de patacón con carne desmechada' },
  { icon: 'hoja' },
  { img: 'assets/tostada-jamon.webp',    pos: 'center',     alt: 'Detalle de tostada con jamón serrano' },
  { img: 'assets/tostada-pan.webp',      pos: 'center',     alt: 'Pan artesanal de la tostada gourmet' },
  { icon: 'copa' },
  { img: 'assets/patacon-base.webp',     pos: 'center 40%', alt: 'Canasta de patacón sobre tabla de bambú' }
];

/* Ilustraciones de línea (viewBox 48×48) para tarjetas sin foto */
const ICONS = {
  hoja:     '<path d="M24 6c10 4 14 14 10 24-3 6-8 9-10 12-2-3-7-6-10-12C10 20 14 10 24 6zM24 14v28M24 22l-6-4M24 28l-7-5M24 22l6-4M24 28l7-5"/>',
  tabla:    '<g transform="translate(0 -4)"><rect x="5" y="31" width="38" height="6" rx="3"/><path d="M10 31v-6l10-5 10 5v6M26 31v-4h10v4M16 25v6M30 25v-2"/></g>',
  maletin:  '<rect x="7" y="16" width="34" height="23" rx="2"/><path d="M18 16v-5h12v5M7 26h34M22 26v4h4v-4"/>',
  copa:     '<path d="M14 8h20c0 9-4 15-10 15S14 17 14 8zM24 23v14M16 40h16M16 14h16"/>',
  postre:   '<path d="M13 21h22l-3 18H16zM11 21h26M17 21c0-6 3-9 7-9s7 3 7 9M24 7v5"/><circle cx="24" cy="7" r="1.6"/>',
  canape:   '<rect x="7" y="29" width="34" height="9" rx="3"/><path d="M11 29c0-6 5-9 13-9s13 3 13 9M18 24c2-2 4-3 6-3M30 20v-6M26 16l4-2 4 2"/>',
  anillos:  '<circle cx="18" cy="30" r="9"/><circle cx="30" cy="30" r="9"/><path d="M24 7l4 4-4 5-4-5z"/>',
  torta:    '<path d="M9 39h30M11 39V27h26v12M11 32c4 3 9 3 13 0s9-3 13 0M24 27v-6M24 12c-2.5 2.5-2.5 5 0 7 2.5-2 2.5-4.5 0-7z"/>',
  birrete:  '<path d="M24 11L5 20l19 9 19-9zM13 25v8c0 3.5 22 3.5 22 0v-8M43 20v11"/>',
  grupo:    '<circle cx="17" cy="17" r="5"/><circle cx="32" cy="17" r="5"/><path d="M7 37c0-6 4-10 10-10s10 4 10 10M23 37c0-6 4-10 9-10s9 4 9 10"/>',
  estrella: '<path d="M24 6l3.8 13.2L41 24l-13.2 3.8L24 42l-3.8-14.2L7 24l13.2-4.8z"/>',
  torre3:   '<path d="M24 3c-2.500 0-4 1.500-4 3.500S21.500 9 24 9s4-1 4-2.500S26.500 3 24 3zM24 9v29"/><path d="M16 15c0-2 3.500-3 8-3s8 1 8 3-3.500 3-8 3-8-1-8-3zM12 26c0-2.500 5-4 12-4s12 1.500 12 4-5 4-12 4-12-1.500-12-4zM7 38c0-3 7-5 17-5s17 2 17 5-7 5-17 5-17-2-17-5z"/>',
  torre2:   '<path d="M24 6c-2.500 0-4 1.500-4 3.500S21.500 12 24 12s4-1 4-2.500S26.500 6 24 6zM24 12v26"/><path d="M13 22c0-2.500 5-4 11-4s11 1.500 11 4-5 4-11 4-11-1.500-11-4zM8 38c0-3 7-5 16-5s16 2 16 5-7 5-16 5-16-2-16-5z"/>',
  bandeja:  '<path d="M6 32l6-12h30l-6 12zM9 36l1.500-3M33 36l1.500-3M14 26h22M13 36h22"/><circle cx="19" cy="25" r="1.800"/><circle cx="26" cy="25" r="1.800"/><circle cx="33" cy="25" r="1.800"/>'
};

const icon = (name) =>
  `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.hoja}</svg>`;

/* Foto real si existe `img`; si no, ilustración dorada */
const visual = (item) => item.img
  ? `<img src="${item.img}" alt="${item.alt || item.name || item.title || ''}" loading="lazy" decoding="async" style="object-position:${item.pos || 'center'}">`
  : `<div class="art" role="img" aria-label="${item.name || item.title || 'Vibrans Gourmet'}">${icon(item.icon)}</div>`;

/* ---------------------------------------------------------------------
   3. WHATSAPP
   Todos los botones de la página llevan al formulario de cotización.
   El botón flotante es el único acceso directo a WhatsApp.
   --------------------------------------------------------------------- */

const WA_MESSAGES = {
  default: 'Hola, estoy interesado en conocer la propuesta de Vibrans Gourmet para mi evento.',
  quote:   'Hola, quiero solicitar una cotización para mi evento con Vibrans Gourmet.',
  footer:  'Hola, quisiera más información sobre Vibrans Gourmet.'
};

// Mini-mensajes que aparecen sobre el botón flotante (ejemplos de qué escribir)
const WA_TEASERS = [
  'Hola, me llamo Pablo y quiero un postre para 50 personas.',
  'Hola, necesito pasabocas para una reunión de empresa.',
  'Hola, quiero cotizar el catering de mi boda.',
  'Hola, ¿qué opciones tienen para un cumpleaños de 30 personas?'
];

// Mensajes rápidos del panel (sin nombre propio, listos para enviar)
const WA_CHIPS = [
  { label: 'Quiero cotizar el catering de mi boda',  text: 'Hola, quiero cotizar el catering de mi boda.' },
  { label: 'Pasabocas para una reunión de empresa',  text: 'Hola, necesito pasabocas para una reunión de empresa.' },
  { label: 'Mini postres para 50 personas',          text: 'Hola, quiero cotizar mini postres para 50 personas.' },
  { label: 'Opciones para un cumpleaños',            text: 'Hola, quiero información sobre opciones para un cumpleaños.' },
  { label: 'Escribir mi propio mensaje',             text: WA_MESSAGES.default }
];

const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

function setWaLink(el, text) {
  el.href = waLink(text);
  el.target = '_blank';
  el.rel = 'noopener';
}

/* ---------------------------------------------------------------------
   4. RENDER
   --------------------------------------------------------------------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const delay = (i, step = 0.08) => `style="--d:${(i * step).toFixed(2)}s"`;

function renderServices() {
  $('#servicesGrid').innerHTML = SERVICES.map((s, i) => `
    <article class="card line-frame service reveal" ${delay(i % 3)}>
      <div class="card-media">${visual(s)}</div>
      <div class="card-body">
        <h3>${s.title}</h3>
        <p>${s.text}</p>
        <a class="link-arrow" href="#contacto" data-mode="evento" data-service="${s.title}">Cotizar este servicio <span aria-hidden="true">→</span></a>
      </div>
    </article>`).join('');
}

function renderExperience() {
  $('#expGrid').innerHTML = EXPERIENCE.map((e, i) => `
    <figure class="exp-tile t${i + 1} reveal" ${delay(i % 3, 0.07)}>
      ${visual(e)}
      <figcaption><span>${e.name}</span></figcaption>
    </figure>`).join('');
}

function renderProducts(filter = 'Todos') {
  const list = PRODUCTS.filter(p => filter === 'Todos' || p.category === filter);
  $('#productsGrid').innerHTML = list.map((p, i) => `
    <article class="card line-frame product reveal" ${delay(i % 3)}>
      <div class="card-media">${visual(p)}<span class="tag">${p.category}</span></div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <button type="button" class="btn btn-wine btn-sm add-btn" data-add="${p.name}" aria-pressed="false">
          <span class="plus" aria-hidden="true"></span>
          <span class="lbl">Agregar a mi pedido</span>
        </button>
      </div>
    </article>`).join('');

  updateSelectionUI();
  observeReveals($('#productsGrid'));
}

function renderFilters() {
  const cats = ['Todos', ...new Set(PRODUCTS.map(p => p.category))];
  const box = $('#productFilters');
  box.innerHTML = cats.map((c, i) =>
    `<button class="chip${i === 0 ? ' is-active' : ''}" role="tab" aria-selected="${i === 0}" data-cat="${c}">${c}</button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    $$('.chip', box).forEach(c => { c.classList.toggle('is-active', c === b); c.setAttribute('aria-selected', c === b); });
    renderProducts(b.dataset.cat);
  });
}

function renderEvents() {
  const cards = EVENTS.map((ev, i) => `
    <article class="event line-frame reveal" ${delay(i % 4)}>
      <div class="event-art">${icon(ev.icon)}</div>
      <h3>${ev.title}</h3>
      <p>${ev.text}</p>
      <a class="link-arrow" href="#contacto" data-mode="evento" data-event="${ev.title}">Cotizar este evento <span aria-hidden="true">→</span></a>
    </article>`).join('');
  const more = `
    <article class="event event-more line-frame reveal" ${delay(3)}>
      <h3>¿Otro tipo de evento?</h3>
      <p>Cuéntanos qué tienes en mente y lo diseñamos contigo.</p>
      <a class="btn btn-primary btn-sm" data-mode="evento" href="#contacto">Solicitar cotización</a>
    </article>`;
  $('#eventsGrid').innerHTML = cards + more;
}

function renderGallery() {
  $('#igGrid').innerHTML = GALLERY.map((g, i) => `
    <a class="ig-tile reveal" ${delay(i % 3, 0.07)} data-ig href="#" target="_blank" rel="noopener" aria-label="Ver más en Instagram">
      ${visual(g)}
      <span class="ig-hover"><svg class="i-ig" aria-hidden="true"><use href="#ico-ig"/></svg></span>
    </a>`).join('');
}

function fillFormOptions() {
  $('#f-evento').innerHTML = '<option value="">Selecciona una opción</option>' +
    EVENTS.map(e => `<option value="${e.title}">${e.title}</option>`).join('') +
    '<option value="Otro">Otro</option>';
  $('#f-servicio').innerHTML = '<option value="">Selecciona una opción</option>' +
    SERVICE_TYPES.map(s => `<option value="${s}">${s}</option>`).join('');
}

/* Enlaces de contacto repartidos por la página */
function bindContactLinks() {
  $$('[data-wa]').forEach(el => setWaLink(el, WA_MESSAGES[el.dataset.wa] || WA_MESSAGES.default));
  $$('[data-ig]').forEach(el => { el.href = INSTAGRAM_URL; });
  $$('[data-mail]').forEach(el => { el.href = `mailto:${EMAIL}`; });
  $$('[data-text-phone]').forEach(el => { el.textContent = WHATSAPP_DISPLAY; });
  $$('[data-text-ig]').forEach(el => { el.textContent = INSTAGRAM_HANDLE; });
  $$('[data-text-mail]').forEach(el => { el.textContent = EMAIL; });
  $$('[data-text-city]').forEach(el => { el.textContent = CITY; });
  $$('[data-sonetix]').forEach(el => {
    if (!SONETIX_URL) return;
    el.href = SONETIX_URL;
    el.target = '_blank';
    el.rel = 'noopener';
  });
  $('#year').textContent = new Date().getFullYear();
}

/* Preselección en el formulario desde tarjetas de evento / servicio */
function bindPreselect() {
  document.addEventListener('click', (e) => {
    const evBtn = e.target.closest('[data-event]');
    const svBtn = e.target.closest('[data-service]');
    if (evBtn) $('#f-evento').value = evBtn.dataset.event;
    if (svBtn) {
      const map = { 'Pasabocas gourmet': 'Pasabocas gourmet', 'Catering para eventos': 'Catering para eventos',
                    'Alquiler de torres y bandejas': 'Alquiler de torres y bandejas', 'Eventos corporativos': 'Evento corporativo' };
      const v = map[svBtn.dataset.service];
      if (v) $('#f-servicio').value = v;
    }
  });
}

/* ---------------------------------------------------------------------
   5. PEDIDO — selección de productos del catálogo
   --------------------------------------------------------------------- */

const selection = new Set();
let atForm = false;                    // ¿se está viendo el formulario? (oculta la barra flotante)

function saveSelection() {
  try { sessionStorage.setItem('vg-selection', JSON.stringify([...selection])); } catch (_) { /* sin almacenamiento: no pasa nada */ }
}
function loadSelection() {
  try {
    JSON.parse(sessionStorage.getItem('vg-selection') || '[]')
      .filter(n => PRODUCTS.some(p => p.name === n))
      .forEach(n => selection.add(n));
  } catch (_) { /* ignorar */ }
}

function updateSelectionUI() {
  const n = selection.size;

  $$('.add-btn').forEach(b => {
    const on = selection.has(b.dataset.add);
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
    $('.lbl', b).textContent = on ? 'En tu pedido' : 'Agregar a mi pedido';
  });

  const count = $('#selCount');
  count.textContent = n;
  count.hidden = n === 0;

  $('#selBarText').textContent = n === 1 ? '1 producto en tu pedido' : `${n} productos en tu pedido`;
  $('#selBar').classList.toggle('is-visible', n > 0 && !atForm);

  $('#selList').innerHTML = [...selection].map(name => {
    const p = PRODUCTS.find(x => x.name === name);
    return `<li><div><strong>${name}</strong><span>${p ? p.category : ''}</span></div>
            <button type="button" class="sel-remove" data-remove="${name}" aria-label="Quitar ${name}">×</button></li>`;
  }).join('');
  $('#selEmpty').hidden = n > 0;
}

function toggleProduct(name) {
  selection.has(name) ? selection.delete(name) : selection.add(name);
  saveSelection();
  updateSelectionUI();
}

function setupSelection() {
  loadSelection();

  $('#productsGrid').addEventListener('click', (e) => {
    const b = e.target.closest('.add-btn');
    if (b) toggleProduct(b.dataset.add);
  });
  $('#selList').addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]');
    if (b) toggleProduct(b.dataset.remove);
  });

  // La barra flotante se oculta mientras se ve el formulario
  if ('IntersectionObserver' in window) {
    const seen = new Set();                       // secciones donde la barra estorba: formulario y simulador
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => en.isIntersecting ? seen.add(en.target.id) : seen.delete(en.target.id));
      atForm = seen.size > 0;
      updateSelectionUI();
    }, { threshold: 0.12 });
    io.observe($('#contacto'));
    io.observe($('#simulador'));
  }
}

/* ---------------------------------------------------------------------
   6. FORMULARIO → WhatsApp   (modo "evento" o modo "pasabocas")
   --------------------------------------------------------------------- */

const form = () => $('#quoteForm');
const currentMode = () => form().dataset.mode;

function setMode(mode) {
  if (!['evento', 'pasabocas'].includes(mode)) return;
  form().dataset.mode = mode;
  $$('[data-tab]').forEach(t => {
    const on = t.dataset.mode === mode;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', String(on));
  });
  $('#submitLabel').textContent = mode === 'pasabocas' ? 'Enviar mi pedido' : 'Solicitar cotización';
  $$('.field.has-error', form()).forEach(f => { f.classList.remove('has-error'); $('.err', f).textContent = ''; });
}

function bindModeLinks() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-mode]');
    if (!el) return;
    setMode(el.dataset.mode);          // si es un enlace, el navegador continúa hacia #contacto
  });
}

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove('is-visible'), 4200);
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

function buildQuoteMessage(v) {
  const found = EVENTS.find(e => e.title === v.evento);
  const eventText = found ? found.single : 'un evento';

  const lines = [
    `Hola, quiero solicitar una cotización para un evento. Mi nombre es ${v.nombre}, será ${eventText} para aproximadamente ${v.invitados} personas.`,
    '',
    '*Detalles de mi solicitud*'
  ];
  const add = (label, value) => { if (value) lines.push(`• ${label}: ${value}`); };
  add('Tipo de evento', v.evento);
  add('Fecha', formatDate(v.fecha));
  add('Ciudad', v.ciudad);
  add('Servicio de interés', v.servicio);
  add('WhatsApp', v.whatsapp);
  add('Correo', v.correo);
  add('Comentarios', v.mensaje);
  return lines.join('\n');
}

function buildOrderMessage(v) {
  const lines = [
    `Hola, quiero pedir pasabocas de Vibrans Gourmet. Mi nombre es ${v.nombre}.`,
    '',
    '*Mi selección*',
    ...[...selection].map(n => `• ${n}`),
    '',
    '*Detalles*'
  ];
  const add = (label, value) => { if (value) lines.push(`• ${label}: ${value}`); };
  add('Personas aproximadas', v.invitados);
  add('Fecha', formatDate(v.fecha));
  add('Ciudad', v.ciudad);
  add('WhatsApp', v.whatsapp);
  add('Correo', v.correo);
  add('Comentarios', v.mensaje);
  return lines.join('\n');
}

function setupForm() {
  const f = form();
  const date = $('#f-fecha');
  const today = new Date();
  date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const rules = {
    nombre:    (v) => v.trim().length < 2 ? 'Cuéntanos tu nombre.' : '',
    whatsapp:  (v) => v.replace(/\D/g, '').length < 7 ? 'Ingresa un número de WhatsApp válido.' : '',
    correo:    (v) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Revisa el formato del correo.' : '',
    evento:    (v) => currentMode() === 'evento' && !v ? 'Selecciona el tipo de evento.' : '',
    invitados: (v) => {
      if (currentMode() === 'evento') return !(Number(v) >= 1) ? 'Indica un número aproximado de invitados.' : '';
      return v && !(Number(v) >= 1) ? 'Indica un número válido.' : '';
    }
  };

  const check = (input) => {
    const rule = rules[input.name];
    if (!rule) return true;
    const msg = rule(input.value);
    const field = input.closest('.field');
    field.classList.toggle('has-error', !!msg);
    $('.err', field).textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };

  $$('input, select, textarea', f).forEach(inp => {
    inp.addEventListener('blur', () => check(inp));
    inp.addEventListener('input', () => { if (inp.closest('.field').classList.contains('has-error')) check(inp); });
  });

  // Pestañas "Cotizar mi evento" / "Pedir pasabocas"
  $$('[data-tab]').forEach(t => t.addEventListener('click', () => setMode(t.dataset.mode)));

  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = $$('input, select, textarea', f);
    const results = inputs.map(check);
    if (results.includes(false)) {
      const bad = inputs.find(i => i.getAttribute('aria-invalid') === 'true');
      if (bad) bad.focus();
      showToast('Revisa los campos marcados para continuar.');
      return;
    }

    const mode = currentMode();
    if (mode === 'pasabocas' && selection.size === 0) {
      showToast('Elige al menos un producto del catálogo.');
      $('#selection').classList.add('is-empty-flash');
      setTimeout(() => $('#selection').classList.remove('is-empty-flash'), 1200);
      return;
    }

    const values = Object.fromEntries(new FormData(f).entries());
    const message = mode === 'pasabocas' ? buildOrderMessage(values) : buildQuoteMessage(values);
    const url = waLink(message);

    // Abrir WhatsApp inmediatamente (evita bloqueos de ventanas emergentes)
    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
    showToast('Abriendo WhatsApp con tu solicitud…');

    // Backend opcional
    if (FORM_ENDPOINT) {
      const payload = { ...values, tipo_solicitud: mode, origen: 'web-vibrans', fecha_envio: new Date().toISOString() };
      if (mode === 'pasabocas') payload.productos = [...selection];
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .catch(() => { /* el flujo principal es WhatsApp; ignoramos fallos silenciosamente */ });
    }
  });
}

/* ---------------------------------------------------------------------
   Botón flotante de WhatsApp: mini-mensajes + panel de ayuda
   --------------------------------------------------------------------- */
function setupWaWidget() {
  const widget = $('#waWidget');
  const btn = $('#waBtn');
  const panel = $('#waPanel');
  const teaser = $('#waTeaser');
  const teaserText = $('#waTeaserText');
  let stopped = false;

  $('#waChips').innerHTML = WA_CHIPS.map(c => `<a class="wa-chip" href="#" target="_blank" rel="noopener">${c.label}</a>`).join('');
  $$('.wa-chip').forEach((a, i) => setWaLink(a, WA_CHIPS[i].text));

  const open = (state) => {
    widget.classList.toggle('is-open', state);
    btn.setAttribute('aria-expanded', String(state));
    if (state) { stopped = true; teaser.classList.remove('is-show'); }
  };
  btn.addEventListener('click', () => open(!widget.classList.contains('is-open')));
  teaser.addEventListener('click', () => open(true));
  $('#waClose').addEventListener('click', () => open(false));
  $('.wa-panel-link', panel).addEventListener('click', () => open(false));
  $$('.wa-chip').forEach(a => a.addEventListener('click', () => open(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });
  document.addEventListener('click', (e) => { if (!widget.contains(e.target)) open(false); });

  // Los mini-mensajes aparecen de uno en uno, dos vueltas, y se detienen si la persona abre el panel
  let i = 0;
  const total = WA_TEASERS.length * 2;
  const showNext = () => {
    if (stopped || i >= total) return;
    if (document.hidden) { setTimeout(showNext, 3000); return; }
    teaserText.textContent = WA_TEASERS[i % WA_TEASERS.length];
    teaser.classList.add('is-show');
    setTimeout(() => {
      teaser.classList.remove('is-show');
      i++;
      setTimeout(showNext, 2600);
    }, 5400);
  };
  setTimeout(showNext, 4500);
}

/* ---------------------------------------------------------------------
   7. EXPERIENCIA: menú, animaciones, líneas doradas, parallax
   --------------------------------------------------------------------- */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealObserver;

function observeReveals(root = document) {
  const items = $$('.reveal:not(.is-in)', root);
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }
  revealObserver = revealObserver || new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); revealObserver.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  // Lo que ya está a la vista al cargar aparece enseguida (sin esperar al observer)
  const vh = window.innerHeight;
  const inView = items.filter(el => { const r = el.getBoundingClientRect(); return r.top < vh * 0.92 && r.bottom > 0; });
  setTimeout(() => inView.forEach(el => { el.classList.add('is-in'); revealObserver.unobserve(el); }), 80);
  items.forEach(el => revealObserver.observe(el));
}

/* Los titulares aparecen palabra por palabra */
function splitHeadings() {
  $$('.display, .hero h1').forEach(el => {
    let n = 0;
    const walk = (node) => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = 'w';
            s.style.setProperty('--i', n++);
            s.textContent = part;
            frag.append(s);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && !ch.classList.contains('sr-only')) {
          walk(ch);
        }
      });
    };
    walk(el);
    el.classList.add('split', 'reveal');
  });
}

/* Línea dorada ornamental bajo cada encabezado de sección */
function injectRules() {
  $$('.section-head').forEach(head => {
    const rule = document.createElement('span');
    rule.className = 'rule reveal';
    rule.setAttribute('aria-hidden', 'true');
    rule.innerHTML = '<i></i><b></b><i></i>';
    head.append(rule);
  });
}

function setupHeader() {
  const header = $('#siteHeader');
  const burger = $('#burger');
  const links = $$('#navLinks a');
  const progress = $('#scrollProgress');

  const closeMenu = () => {
    header.classList.remove('nav-open');
    document.body.classList.remove('no-scroll');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  };

  burger.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  links.forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width: 1321px)').addEventListener('change', closeMenu);

  // Fondo sólido + barra dorada de progreso al hacer scroll
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // El logo del menú aparece cuando el logo grande del hero sale de pantalla
  const heroLogo = $('.hero-logo');
  if (heroLogo && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => header.classList.toggle('show-brand', !en.isIntersecting), { threshold: 0 }).observe(heroLogo);
  } else {
    header.classList.add('show-brand');
  }

  // Enlace activo según la sección visible
  const map = new Map(links.filter(a => a.getAttribute('href').startsWith('#') && a.closest('li')).map(a => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting && map.has(en.target.id)) {
          map.forEach(a => a.classList.remove('is-active'));
          map.get(en.target.id).classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }
}

/* Parallax muy sutil (desactivado con "reducir movimiento") */
function setupParallax() {
  if (reduceMotion) return;
  const items = $$('[data-parallax]');
  const heroBg = $('.hero-bg img');
  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    items.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
      el.style.setProperty('--py', `${offset.toFixed(1)}px`);
    });
    if (heroBg && window.scrollY < vh * 1.2) heroBg.style.setProperty('--py', `${(window.scrollY * 0.12).toFixed(1)}px`);
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---------------------------------------------------------------------
   8. ALQUILER + SIMULADOR DE MESA
   --------------------------------------------------------------------- */

// Torres y bandejas en alquiler.
// ⚠ MEDIDAS Y CAPACIDADES DE EJEMPLO: reemplázalas por las reales de tus piezas.
//   diameter  → diámetro de la base (cm) · w × d → largo y ancho de la bandeja (cm)
//   cap       → cuántas piezas (pasabocas/postres) caben en total
//   tiers     → número de pisos (solo torres)
// Para usar tu foto real añade  img: 'assets/torre-3-pisos.webp'
const STANDS = [
  { id: 'torre3',  name: 'Torre de 3 pisos',    shape: 'round', diameter: 34, tiers: 3, cap: 30, icon: 'torre3',
    text: 'Tres niveles para postres, macarons y pasabocas. Disponible en crema con detalles dorados o en blanco.' },
  { id: 'torre2',  name: 'Torre de 2 pisos',    shape: 'round', diameter: 28, tiers: 2, cap: 20, icon: 'torre2',
    text: 'Una opción compacta y elegante, ideal para mesas más pequeñas.' },
  { id: 'bandeja', name: 'Bandeja rectangular', shape: 'rect',  w: 42, d: 30, tiers: 1, cap: 24, icon: 'bandeja',
    text: 'Borde festoneado, perfecta para mini postres y canapés en una sola capa.' }
];

// Medidas rápidas de la mesa del cliente (cm)
const TABLE_PRESETS = [
  { label: 'Rectangular 180 × 75', shape: 'rect',  w: 180, d: 75 },
  { label: 'Cuadrada 90 × 90',     shape: 'rect',  w: 90,  d: 90 },
  { label: 'Redonda Ø 150',        shape: 'round', w: 150, d: 150 },
  { label: 'Redonda Ø 90',         shape: 'round', w: 90,  d: 90 }
];

const SIM_COLORS = ['#C6A15B', '#B5656F', '#8A8F5B', '#B8734A', '#6E3A5A', '#9A8C78'];
const PIECE_STEP = 6;                       // los pasabocas suben/bajan de media docena en media docena

const standDims = (s) => s.shape === 'round' ? `Ø ${s.diameter} cm` : `${s.w} × ${s.d} cm`;
const standSize = (s) => s.shape === 'round' ? { w: s.diameter, d: s.diameter } : { w: s.w, d: s.d };

function renderStands() {
  $('#standsGrid').innerHTML = STANDS.map((s, i) => `
    <article class="card line-frame stand reveal" ${delay(i)}>
      <div class="card-media">${visual(s)}</div>
      <div class="card-body">
        <h3>${s.name}</h3>
        <p class="stand-meta">${standDims(s)} · hasta ${s.cap} piezas</p>
        <p>${s.text}</p>
        <div class="stand-actions">
          <a class="btn btn-wine btn-sm" href="#simulador" data-sim-stand="${s.id}">Probar en el simulador</a>
          <a class="link-arrow" href="#contacto" data-mode="evento" data-rent="${s.name}">Cotizar alquiler <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </article>`).join('');
}

/* ---- Estado del simulador ---- */
const sim = {
  guests: 50, perGuest: 6,
  qty: {},                                          // piezas por producto
  stands: { torre3: 1, torre2: 0, bandeja: 1 },     // torres/bandejas a alquilar
  table: { shape: 'rect', w: 180, d: 75, n: 1 },    // la mesa del cliente
  room: { w: 6, l: 5 },                             // espacio en metros
  view: 'mesa', pos: [], sel: 0, layout: null
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const tableSize = () => sim.table.shape === 'round' ? { w: sim.table.w, d: sim.table.w } : { w: sim.table.w, d: sim.table.d };
const tableLabel = () => sim.table.shape === 'round' ? `redonda Ø ${sim.table.w} cm` : `rectangular ${sim.table.w} × ${sim.table.d} cm`;
const totalPieces = () => Object.values(sim.qty).reduce((a, b) => a + b, 0);
const totalCap = () => STANDS.reduce((a, s) => a + s.cap * (sim.stands[s.id] || 0), 0);
const piecesNeeded = () => sim.guests * sim.perGuest;

/* ---- Distribución sobre la mesa (primer hueco libre) ---- */
function standItems() {
  const list = [];
  STANDS.forEach(s => {
    for (let k = 0; k < (sim.stands[s.id] || 0); k++) {
      const z = standSize(s);
      list.push({ s, w: z.w, d: z.d, ow: z.w, od: z.d, round: s.shape === 'round', rot: false });
    }
  });
  return list.sort((a, b) => b.w * b.d - a.w * a.d);
}

function insideTable(T, x, y, w, d, round, m) {
  if (T.shape !== 'round') return x >= m && y >= m && x + w <= T.w - m && y + d <= T.d - m;
  const R = T.w / 2;
  if (round) return Math.hypot(x + w / 2 - R, y + d / 2 - R) + w / 2 <= R - m;
  return [[x, y], [x + w, y], [x, y + d], [x + w, y + d]].every(([px, py]) => Math.hypot(px - R, py - R) <= R - m);
}
const overlaps = (placed, x, y, w, d, g) =>
  placed.some(p => x < p.x + p.w + g && x + w + g > p.x && y < p.y + p.d + g && y + d + g > p.y);

function findSpot(T, placed, it) {
  const step = 2, m = 3, g = 2;
  for (const rot of (it.round ? [false] : [false, true])) {
    const w = rot ? it.d : it.w, d = rot ? it.w : it.d;
    for (let y = m; y + d <= T.d - m + 0.01; y += step) {
      for (let x = m; x + w <= T.w - m + 0.01; x += step) {
        if (insideTable(T, x, y, w, d, it.round, m) && !overlaps(placed, x, y, w, d, g)) return { x, y, w, d, rot };
      }
    }
  }
  return null;
}

function pieceColors() {
  const arr = [];
  PRODUCTS.forEach((p, i) => { for (let k = 0; k < (sim.qty[p.name] || 0); k++) arr.push(SIM_COLORS[i % SIM_COLORS.length]); });
  return arr;
}

function computeLayout(n) {
  const T = { shape: sim.table.shape, ...tableSize() };
  const tables = Array.from({ length: n }, () => ({ placed: [] }));
  const left = [];
  standItems().forEach(it => {
    for (const tb of tables) {
      const spot = findSpot(T, tb.placed, it);
      if (spot) { tb.placed.push({ ...it, ...spot }); return; }
    }
    left.push(it);
  });
  // Reparte los pasabocas por las torres, en orden
  const colors = pieceColors();
  let idx = 0;
  tables.forEach(tb => tb.placed.forEach(p => { p.pieces = colors.slice(idx, idx + p.s.cap); idx += p.pieces.length; }));
  return { T, tables, left, unplaced: Math.max(0, colors.length - idx) };
}

function recommendTables(from) {
  for (let k = from; k <= 8; k++) if (computeLayout(k).left.length === 0) return k;
  return null;
}

/* ---- Dibujo ---- */
function slotPositions(s, w, d) {
  const slots = [];
  if (s.shape === 'round') {
    const R = s.diameter / 2;
    const tiers = s.tiers === 3
      ? [{ a: .78, b: 1, wt: .5 }, { a: .55, b: .78, wt: .33 }, { a: 0, b: .55, wt: .17 }]
      : [{ a: .68, b: 1, wt: .6 }, { a: 0, b: .68, wt: .4 }];
    let left = s.cap;
    tiers.forEach((t, ti) => {
      const n = ti === tiers.length - 1 ? left : Math.round(s.cap * t.wt);
      left -= n;
      const rr = t.a === 0 ? (n > 1 ? R * t.b * .5 : 0) : R * (t.a + t.b) / 2;
      const spacing = n > 1 ? (2 * Math.PI * rr) / n : R;
      const r = Math.min(R * .11, spacing * .4);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        slots.push([Math.cos(a) * rr, Math.sin(a) * rr, r]);
      }
    });
  } else {
    const n = s.cap, cols = Math.max(1, Math.round(Math.sqrt(n * w / d))), rows = Math.ceil(n / cols);
    const cw = (w - 7) / cols, cd = (d - 7) / rows, r = Math.min(cw, cd) * .38;
    for (let i = 0; i < n; i++) slots.push([-w / 2 + 3.5 + cw * ((i % cols) + .5), -d / 2 + 3.5 + cd * (Math.floor(i / cols) + .5), r]);
  }
  return slots;
}

function standMarkup(p, detail) {
  const { s } = p;
  const cx = p.x + p.w / 2, cy = p.y + p.d / 2;
  let g = `<g class="s-stand" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${p.rot ? 90 : 0})"><title>${s.name} · ${p.pieces.length} de ${s.cap} piezas</title>`;
  if (s.shape === 'round') {
    const R = s.diameter / 2;
    g += `<circle r="${R}" class="s-plate s-p1"/>`;
    (s.tiers === 3 ? [.78, .55] : [.68]).forEach((k, i) => { g += `<circle r="${(R * k).toFixed(2)}" class="s-plate s-p${i + 2}"/>`; });
    g += `<circle r="${(R * .05).toFixed(2)}" class="s-handle"/>`;
  } else {
    g += `<rect x="${-p.ow / 2}" y="${-p.od / 2}" width="${p.ow}" height="${p.od}" rx="3" class="s-plate s-p1"/>` +
         `<rect x="${-p.ow / 2 + 2.5}" y="${-p.od / 2 + 2.5}" width="${p.ow - 5}" height="${p.od - 5}" rx="2" class="s-plate s-p2"/>`;
  }
  if (detail) {
    slotPositions(s, p.ow, p.od).forEach(([sx, sy, sr], i) => {
      const col = p.pieces[i];
      g += col
        ? `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${sr.toFixed(2)}" fill="${col}" class="s-piece"/>`
        : `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${sr.toFixed(2)}" class="s-slot"/>`;
    });
  }
  return g + '</g>';
}

function tableMarkup(T, placed, detail) {
  let s = T.shape === 'round'
    ? `<circle class="s-table" cx="${T.w / 2}" cy="${T.w / 2}" r="${T.w / 2}"/>`
    : `<rect class="s-table" width="${T.w}" height="${T.d}" rx="4"/>`;
  placed.forEach(p => { s += standMarkup(p, detail); });
  return s;
}

const itemArea = (p) => p.round ? Math.PI * (p.w / 2) ** 2 : p.w * p.d;

function renderMesaView(layout) {
  const { T, tables } = layout;
  const fs = Math.max(T.w, T.d) * .042, pad = fs * 2.4 + 6;
  const tArea = T.shape === 'round' ? Math.PI * (T.w / 2) ** 2 : T.w * T.d;
  const dimTop = T.shape === 'round' ? `Ø ${T.w} cm` : `${T.w} cm`;

  $('#simMesaView').innerHTML = `<div class="sim-tables">` + tables.map((tb, i) => {
    const pct = Math.round(tb.placed.reduce((a, p) => a + itemArea(p), 0) / tArea * 100);
    const left = T.shape === 'round'
      ? ''
      : `<line class="s-dim" x1="${-fs}" y1="0" x2="${-fs}" y2="${T.d}"/><text class="s-dimtxt" font-size="${fs}" transform="translate(${-fs * 1.5} ${T.d / 2}) rotate(-90)" text-anchor="middle">${T.d} cm</text>`;
    return `<figure class="sim-table">
      <svg viewBox="${-pad} ${-pad} ${T.w + pad * 2} ${T.d + pad * 2}" role="img" aria-label="Mesa ${i + 1} vista desde arriba con ${tb.placed.length} piezas">
        <line class="s-dim" x1="0" y1="${-fs}" x2="${T.w}" y2="${-fs}"/>
        <text class="s-dimtxt" font-size="${fs}" x="${T.w / 2}" y="${-fs * 1.5}" text-anchor="middle">${dimTop}</text>
        ${left}
        ${tableMarkup(T, tb.placed, true)}
      </svg>
      <figcaption>Mesa ${i + 1} · ${tb.placed.length} ${tb.placed.length === 1 ? 'pieza' : 'piezas'} de alquiler · ${pct}% de la superficie</figcaption>
    </figure>`;
  }).join('') + `</div>`;
}

/* ---- Espacio (plano a escala con mesas arrastrables) ---- */
const roomCm = () => ({ W: sim.room.w * 100, L: sim.room.l * 100 });
function bboxOf(i) {
  const T = tableSize();
  const rot = sim.pos[i] && sim.pos[i].rot && sim.table.shape !== 'round';
  return rot ? { w: T.d, d: T.w } : { w: T.w, d: T.d };
}
function clampPositions() {
  const { W, L } = roomCm();
  sim.pos.forEach((p, i) => {
    const b = bboxOf(i);
    p.x = clamp(p.x, 0, Math.max(0, W - b.w));
    p.y = clamp(p.y, 0, Math.max(0, L - b.d));
  });
}
function arrangeTables() {
  const { W } = roomCm(), T = tableSize();
  let x = 60, y = 60, rowH = 0;
  sim.pos = [];
  for (let i = 0; i < sim.table.n; i++) {
    if (x + T.w > W - 60 && x > 60) { x = 60; y += rowH + 90; rowH = 0; }
    sim.pos.push({ x, y, rot: false });
    x += T.w + 90; rowH = Math.max(rowH, T.d);
  }
  clampPositions();
}
const ensurePos = () => { if (sim.pos.length !== sim.table.n) arrangeTables(); };

function renderRoom(layout) {
  ensurePos();
  const { W, L } = roomCm(), T = tableSize(), m = 44;
  const fs = Math.max(W, L) * .03;
  let grid = '';
  for (let x = 100; x < W; x += 100) grid += `<line class="r-grid" x1="${x}" y1="0" x2="${x}" y2="${L}"/>`;
  for (let y = 100; y < L; y += 100) grid += `<line class="r-grid" x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;

  const tablesSvg = sim.pos.map((p, i) => {
    const b = bboxOf(i), tb = layout.tables[i] || { placed: [] };
    const tf = `translate(${b.w / 2} ${b.d / 2}) rotate(${p.rot && sim.table.shape !== 'round' ? 90 : 0}) translate(${-T.w / 2} ${-T.d / 2})`;
    return `<g class="r-item${i === sim.sel ? ' is-sel' : ''}" data-i="${i}" tabindex="0" role="button" aria-label="Mesa ${i + 1}: arrástrala o usa las flechas" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})">
      <rect class="r-clear" x="-30" y="-30" width="${b.w + 60}" height="${b.d + 60}" rx="14"/>
      <g transform="${tf}">${tableMarkup({ shape: sim.table.shape, ...T }, tb.placed, false)}</g>
      <text class="r-label" font-size="${fs * .8}" x="${b.w / 2}" y="${-6}" text-anchor="middle">Mesa ${i + 1}</text>
    </g>`;
  }).join('');

  $('#simRoomSvg').innerHTML = `<svg viewBox="${-m} ${-m} ${W + m * 2} ${L + m * 2}" role="img" aria-label="Plano de tu espacio de ${sim.room.w} por ${sim.room.l} metros">
    <rect class="r-floor" x="0" y="0" width="${W}" height="${L}"/>
    ${grid}
    <rect class="r-wall" x="0" y="0" width="${W}" height="${L}"/>
    <text class="s-dimtxt" font-size="${fs}" x="${W / 2}" y="${-fs * .8}" text-anchor="middle">${sim.room.w} m</text>
    <text class="s-dimtxt" font-size="${fs}" transform="translate(${-fs * .8} ${L / 2}) rotate(-90)" text-anchor="middle">${sim.room.l} m</text>
    ${tablesSvg}
  </svg>`;
  updateIssues();
}

function applyPos(i) {
  const g = $(`#simRoomSvg .r-item[data-i="${i}"]`);
  if (g) g.setAttribute('transform', `translate(${sim.pos[i].x.toFixed(1)} ${sim.pos[i].y.toFixed(1)})`);
}

function updateIssues() {
  const { W, L } = roomCm(), T = tableSize(), out = [];
  const rects = sim.pos.map((p, i) => ({ ...p, ...bboxOf(i) }));
  rects.forEach((r, i) => { if (r.w > W || r.d > L) out.push(['warn', `La mesa ${i + 1} es más grande que tu espacio.`]); });
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i], b = rects[j];
      const dx = Math.max(0, a.x - (b.x + b.w), b.x - (a.x + a.w));
      const dy = Math.max(0, a.y - (b.y + b.d), b.y - (a.y + a.d));
      const dist = Math.hypot(dx, dy);
      if (dist === 0) out.push(['warn', `Las mesas ${i + 1} y ${j + 1} se superponen.`]);
      else if (dist < 60) out.push(['warn', `Queda poco espacio para circular entre las mesas ${i + 1} y ${j + 1} (menos de 60 cm).`]);
    }
  }
  const tArea = (sim.table.shape === 'round' ? Math.PI * (T.w / 2) ** 2 : T.w * T.d) * sim.table.n;
  const ratio = tArea / (W * L);
  if (ratio > .35) out.push(['warn', `Las mesas ocupan el ${Math.round(ratio * 100)}% de tu espacio: puede sentirse apretado.`]);
  if (!out.length) out.push(['ok', 'Hay espacio cómodo para moverse alrededor de tus mesas.']);
  $('#simIssues').innerHTML = out.map(([k, m]) => `<li class="${k}">${m}</li>`).join('');
}

function setupRoomDrag() {
  const host = $('#simRoomSvg');
  let drag = null;
  const toSvg = (svg, e) => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
  const select = (i) => { sim.sel = i; $$('.r-item', host).forEach(g => g.classList.toggle('is-sel', +g.dataset.i === i)); };

  host.addEventListener('pointerdown', (e) => {
    const g = e.target.closest('.r-item');
    if (!g) return;
    const i = +g.dataset.i, svg = host.querySelector('svg'), pt = toSvg(svg, e);
    select(i);
    drag = { i, svg, dx: pt.x - sim.pos[i].x, dy: pt.y - sim.pos[i].y };
    g.setPointerCapture && g.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  host.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const pt = toSvg(drag.svg, e);
    sim.pos[drag.i].x = pt.x - drag.dx;
    sim.pos[drag.i].y = pt.y - drag.dy;
    clampPositions();
    applyPos(drag.i);
  });
  const end = () => { if (drag) { drag = null; updateIssues(); } };
  host.addEventListener('pointerup', end);
  host.addEventListener('pointercancel', end);

  host.addEventListener('keydown', (e) => {
    const g = e.target.closest('.r-item');
    const k = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[e.key];
    if (!g || !k) return;
    const i = +g.dataset.i;
    sim.pos[i].x += k[0]; sim.pos[i].y += k[1];
    clampPositions(); applyPos(i); select(i); updateIssues();
    e.preventDefault();
  });

  $('#simRotate').addEventListener('click', () => {
    if (sim.table.shape === 'round' || !sim.pos[sim.sel]) return;
    sim.pos[sim.sel].rot = !sim.pos[sim.sel].rot;
    clampPositions(); scheduleSim();
  });
  $('#simReset').addEventListener('click', () => { arrangeTables(); scheduleSim(); });
}

/* ---- Resumen y avisos ---- */
function renderSummary(layout) {
  const P = totalPieces(), C = totalCap(), need = piecesNeeded();
  const msgs = [];
  if (P === 0) msgs.push(['info', 'Agrega pasabocas en el paso 2 para empezar.']);
  if (P > C) msgs.push(['warn', `Tienes ${P - C} pasabocas sin lugar en las torres. <button type="button" data-act="suggest">Sugerir torres y bandejas</button>`]);
  else if (P > 0) msgs.push(['ok', 'Todos tus pasabocas caben en las torres y bandejas elegidas.']);
  if (P > 0 && P < need * .9) msgs.push(['info', `Para ${sim.guests} invitados sugerimos unos ${need} pasabocas (llevas ${P}).`]);
  if (layout.left.length) {
    const rec = recommendTables(sim.table.n + 1);
    msgs.push(['warn', `${layout.left.length} ${layout.left.length === 1 ? 'pieza no cabe' : 'piezas no caben'} en tu mesa.` +
      (rec ? ` Con ${rec} mesas sí caben. <button type="button" data-act="tables" data-n="${rec}">Usar ${rec} mesas</button>` : ' Prueba con una mesa más grande.')]);
  } else if (standItems().length) {
    const T = layout.T, tArea = T.shape === 'round' ? Math.PI * (T.w / 2) ** 2 : T.w * T.d;
    const worst = Math.max(...layout.tables.map(tb => tb.placed.reduce((a, p) => a + itemArea(p), 0) / tArea));
    msgs.push(worst > .8 ? ['warn', 'Tu mesa quedará muy llena: considera otra mesa.'] : ['ok', `Todo cabe sobre ${sim.table.n === 1 ? 'tu mesa' : 'tus mesas'}.`]);
  }
  $('#simSummary').innerHTML = `
    <dl class="sim-stats">
      <div><dt>Pasabocas</dt><dd>${P}</dd></div>
      <div><dt>Lugares en torres</dt><dd>${C}</dd></div>
      <div><dt>Sugeridos</dt><dd>${need}</dd></div>
    </dl>
    <ul class="sim-msgs">${msgs.map(([k, m]) => `<li class="${k}">${m}</li>`).join('')}</ul>`;
}

/* ---- Cálculos automáticos ---- */
function suggestStands(P) {
  const cap = (id) => STANDS.find(s => s.id === id).cap;
  let rem = P;
  const n3 = Math.floor(rem * .5 / cap('torre3')); rem -= n3 * cap('torre3');
  const n2 = Math.floor(Math.max(rem, 0) * .5 / cap('torre2')); rem -= n2 * cap('torre2');
  const nb = Math.ceil(Math.max(rem, 0) / cap('bandeja'));
  sim.stands = { torre3: clamp(n3, 0, 12), torre2: clamp(n2, 0, 12), bandeja: clamp(nb, 0, 12) };
}
function autoCalc() {
  const need = piecesNeeded();
  let chosen = PRODUCTS.filter(p => (sim.qty[p.name] || 0) > 0);
  if (!chosen.length) chosen = PRODUCTS.slice(0, 3);
  PRODUCTS.forEach(p => { sim.qty[p.name] = 0; });
  const share = need / chosen.length;
  chosen.forEach(p => { sim.qty[p.name] = clamp(Math.round(share / PIECE_STEP) * PIECE_STEP || PIECE_STEP, 0, 600); });
  suggestStands(totalPieces());
  sim.pos = [];
  showToast(`Calculamos ${totalPieces()} pasabocas y las torres para ${sim.guests} invitados.`);
}

/* ---- Pasar la simulación al formulario de cotización ---- */
function simToQuote() {
  const lines = ['Configuración de mi simulación:', `• Invitados: ${sim.guests}`];
  const prods = PRODUCTS.filter(p => (sim.qty[p.name] || 0) > 0).map(p => `${p.name} (${sim.qty[p.name]})`);
  if (prods.length) lines.push(`• Pasabocas: ${prods.join(', ')}`);
  const stands = STANDS.filter(s => (sim.stands[s.id] || 0) > 0).map(s => `${sim.stands[s.id]} × ${s.name}`);
  if (stands.length) lines.push(`• Alquiler: ${stands.join(', ')}`);
  lines.push(`• Mesa: ${sim.table.n} × ${tableLabel()}`);
  lines.push(`• Espacio: ${sim.room.w} × ${sim.room.l} m`);
  setMode('evento');
  $('#f-servicio').value = 'Alquiler de torres y bandejas';
  $('#f-invitados').value = sim.guests;
  $('#f-mensaje').value = lines.join('\n');
  showToast('Agregamos tu simulación al formulario.');
  document.getElementById('contacto').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

/* ---- Controles ---- */
let simTimer;
const scheduleSim = () => { clearTimeout(simTimer); simTimer = setTimeout(updateSim, 20); };

function renderSimControls() {
  $('#simProducts').innerHTML = PRODUCTS.map((p, i) => `
    <li>
      <span class="dot" style="background:${SIM_COLORS[i % SIM_COLORS.length]}"></span>
      <div><strong>${p.name}</strong><small>${p.category}</small></div>
      <div class="stepper" role="group" aria-label="${p.name}">
        <button type="button" data-prod="${i}" data-d="-1" aria-label="Menos ${p.name}">−</button>
        <output data-out-prod="${i}">0</output>
        <button type="button" data-prod="${i}" data-d="1" aria-label="Más ${p.name}">+</button>
      </div>
    </li>`).join('');

  $('#simStands').innerHTML = STANDS.map(s => `
    <li>
      <span class="mini">${icon(s.icon)}</span>
      <div><strong>${s.name}</strong><small>${standDims(s)} · ${s.cap} piezas</small></div>
      <div class="stepper" role="group" aria-label="${s.name}">
        <button type="button" data-stand="${s.id}" data-d="-1" aria-label="Menos ${s.name}">−</button>
        <output data-out-stand="${s.id}">0</output>
        <button type="button" data-stand="${s.id}" data-d="1" aria-label="Más ${s.name}">+</button>
      </div>
    </li>`).join('');

  $('#simTablePresets').innerHTML = TABLE_PRESETS.map((t, i) => `<button type="button" class="chip" data-preset="${i}">${t.label}</button>`).join('');
}

function updateSim() {
  // Valores en los controles
  PRODUCTS.forEach((p, i) => { $(`[data-out-prod="${i}"]`).textContent = sim.qty[p.name] || 0; });
  STANDS.forEach(s => { $(`[data-out-stand="${s.id}"]`).textContent = sim.stands[s.id] || 0; });
  $('#simTableQty').textContent = sim.table.n;
  const round = sim.table.shape === 'round';
  $('#simDField').hidden = round;
  $('#simWLabel').textContent = round ? 'Diámetro (cm)' : 'Largo (cm)';
  $$('#simTablePresets .chip').forEach((c, i) => {
    const t = TABLE_PRESETS[i];
    c.classList.toggle('is-active', t.shape === sim.table.shape && t.w === sim.table.w && (round || t.d === sim.table.d));
  });
  $('#simNeed').textContent = `≈ ${piecesNeeded()} pasabocas en total (${sim.guests} invitados × ${sim.perGuest}).`;
  $('#simRotate').disabled = round;

  const layout = computeLayout(sim.table.n);
  sim.layout = layout;
  renderSummary(layout);
  if (sim.view === 'mesa') renderMesaView(layout); else renderRoom(layout);
}

function setupSimulator() {
  PRODUCTS.forEach((p, i) => { sim.qty[p.name] = i < 2 ? 24 : 0; });
  renderSimControls();
  setupRoomDrag();

  const panel = $('.sim-panel');
  panel.addEventListener('click', (e) => {
    const prod = e.target.closest('[data-prod]');
    const stand = e.target.closest('[data-stand]');
    const tbl = e.target.closest('[data-tables]');
    const preset = e.target.closest('[data-preset]');
    if (prod) {
      const name = PRODUCTS[+prod.dataset.prod].name;
      sim.qty[name] = clamp((sim.qty[name] || 0) + PIECE_STEP * +prod.dataset.d, 0, 600);
    } else if (stand) {
      const id = stand.dataset.stand;
      sim.stands[id] = clamp((sim.stands[id] || 0) + +stand.dataset.d, 0, 12);
    } else if (tbl) {
      sim.table.n = clamp(sim.table.n + +tbl.dataset.tables, 1, 8);
      sim.pos = [];
    } else if (preset) {
      const t = TABLE_PRESETS[+preset.dataset.preset];
      Object.assign(sim.table, { shape: t.shape, w: t.w, d: t.d });
      $('#simShape').value = t.shape; $('#simTW').value = t.w; $('#simTD').value = t.d;
      sim.pos = [];
    } else if (e.target.closest('#simAuto')) {
      autoCalc();
    } else return;
    scheduleSim();
  });

  const num = (el, min, max, fallback) => clamp(Number(el.value) || fallback, min, max);
  $('#simGuests').addEventListener('input', (e) => { sim.guests = num(e.target, 1, 1000, 1); scheduleSim(); });
  $('#simPerGuest').addEventListener('input', (e) => { sim.perGuest = num(e.target, 1, 20, 1); scheduleSim(); });
  $('#simShape').addEventListener('change', (e) => { sim.table.shape = e.target.value; sim.pos = []; scheduleSim(); });
  $('#simTW').addEventListener('input', (e) => { sim.table.w = num(e.target, 40, 500, 40); sim.pos = []; scheduleSim(); });
  $('#simTD').addEventListener('input', (e) => { sim.table.d = num(e.target, 40, 300, 40); sim.pos = []; scheduleSim(); });
  $('#simRoomW').addEventListener('input', (e) => { sim.room.w = num(e.target, 1, 40, 1); clampPositions(); scheduleSim(); });
  $('#simRoomL').addEventListener('input', (e) => { sim.room.l = num(e.target, 1, 40, 1); clampPositions(); scheduleSim(); });

  // Pestañas "Sobre la mesa" / "En mi espacio"
  $$('.sim-tabs [data-view]').forEach(b => b.addEventListener('click', () => {
    sim.view = b.dataset.view;
    $$('.sim-tabs [data-view]').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', String(x === b)); });
    $('#simMesaView').hidden = sim.view !== 'mesa';
    $('#simRoomView').hidden = sim.view !== 'espacio';
    scheduleSim();
  }));

  // Botones dentro de los avisos
  $('#simSummary').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'suggest') suggestStands(totalPieces());
    if (b.dataset.act === 'tables') { sim.table.n = clamp(+b.dataset.n, 1, 8); sim.pos = []; }
    scheduleSim();
  });

  $('#simQuote').addEventListener('click', simToQuote);

  // Desde las tarjetas de alquiler
  document.addEventListener('click', (e) => {
    const st = e.target.closest('[data-sim-stand]');
    if (st && !(sim.stands[st.dataset.simStand] > 0)) { sim.stands[st.dataset.simStand] = 1; scheduleSim(); }
    const rent = e.target.closest('[data-rent]');
    if (rent) {
      $('#f-servicio').value = 'Alquiler de torres y bandejas';
      const box = $('#f-mensaje');
      if (!box.value.includes(rent.dataset.rent)) box.value = `Me interesa alquilar: ${rent.dataset.rent}.` + (box.value ? '\n' + box.value : '');
    }
  });

  updateSim();
}

/* ---------------------------------------------------------------------
   Inicio
   --------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderExperience();
  renderFilters();
  renderProducts();
  renderEvents();
  renderGallery();
  renderStands();
  fillFormOptions();
  bindContactLinks();
  bindPreselect();
  bindModeLinks();
  setupSelection();
  updateSelectionUI();
  setupForm();
  setupSimulator();
  setupWaWidget();
  setupHeader();
  splitHeadings();
  injectRules();
  observeReveals();
  setupParallax();
});
