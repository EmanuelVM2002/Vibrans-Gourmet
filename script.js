/* =====================================================================
   VIBRANS GOURMET — script.js
   ---------------------------------------------------------------------
   1. CONFIGURACIÓN  → número de WhatsApp, Instagram, correo, etc.
   2. DATOS          → servicios, productos, eventos, galería
   3. WHATSAPP       → mensajes, mini-mensajes del botón flotante
   4. RENDER         → pinta las secciones a partir de los datos
   5. PEDIDO         → selección de productos del catálogo
   6. FORMULARIO     → dos modos (cotizar evento / pedir pasabocas) → WhatsApp
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
  { title: 'Mesas gastronómicas', text: 'Estaciones y tablas diseñadas como una pieza central: se ven tan bien como saben.', icon: 'tabla' },
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
  { title: 'Eventos empresariales',  single: 'un evento empresarial',    text: 'Lanzamientos, reuniones y cierres con un servicio profesional y elegante.',  icon: 'maletin' },
  { title: 'Graduaciones',           single: 'una graduación',           text: 'Un brindis a la altura del logro, con pasabocas pensados para compartir.',  icon: 'birrete' },
  { title: 'Reuniones',              single: 'una reunión',              text: 'Encuentros de trabajo o de amigos con bocados prácticos y exquisitos.',     icon: 'grupo' },
  { title: 'Celebraciones privadas', single: 'una celebración privada',  text: 'Momentos íntimos, con atención cercana y total discreción.',                icon: 'copa' },
  { title: 'Eventos especiales',     single: 'un evento especial',       text: 'Si es único, merece una propuesta única. Cuéntanos tu idea.',               icon: 'estrella' }
];

const SERVICE_TYPES = ['Pasabocas gourmet', 'Catering para eventos', 'Mesa gastronómica', 'Evento corporativo', 'Aún no lo tengo claro'];

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
  estrella: '<path d="M24 6l3.8 13.2L41 24l-13.2 3.8L24 42l-3.8-14.2L7 24l13.2-4.8z"/>'
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
                    'Mesas gastronómicas': 'Mesa gastronómica', 'Eventos corporativos': 'Evento corporativo' };
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
    new IntersectionObserver(([en]) => { atForm = en.isIntersecting; updateSelectionUI(); }, { threshold: 0.12 })
      .observe($('#contacto'));
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
  window.matchMedia('(min-width: 1201px)').addEventListener('change', closeMenu);

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
   Inicio
   --------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderExperience();
  renderFilters();
  renderProducts();
  renderEvents();
  renderGallery();
  fillFormOptions();
  bindContactLinks();
  bindPreselect();
  bindModeLinks();
  setupSelection();
  updateSelectionUI();
  setupForm();
  setupWaWidget();
  setupHeader();
  splitHeadings();
  injectRules();
  observeReveals();
  setupParallax();
});
