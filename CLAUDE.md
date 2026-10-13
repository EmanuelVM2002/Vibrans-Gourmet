# Vibrans Gourmet — contexto del proyecto (leer primero)

Este archivo resume la conversación en la que se construyó la página, para poder retomarla sin el historial.
El usuario habla español; responde y escribe los textos de la página en español (Colombia).

## Qué es
Landing page de **Vibrans Gourmet**, un emprendimiento de **pasabocas gourmet** para eventos que además **alquila torres y bandejas** (soportes de postres) con un **depósito para cubrir posibles daños**.
**No prestan servicio de meseros** ni atienden el evento: no escribir textos que lo sugieran.
Objetivo de la página: convertir visitantes en clientes (cotización por WhatsApp), no solo mostrar información.

- Stack: HTML + CSS + JS puro, sin build. Se abre `index.html` directamente.
- Archivos: `index.html`, `style.css`, `script.js`, `assets/`.
- Repo: https://github.com/EmanuelVM2002/Vibrans-Gourmet (rama `main`). **Solo hacer commit/push cuando el usuario lo pida** ("push").
- Créditos del desarrollador (footer): "© año **Sonetix**. Páginas web a la medida." enlazado a https://sonetix.emanuelvillada10.workers.dev/ (constante `SONETIX_URL`). Sin icono, por pedido del usuario.

## Identidad visual
- Colores: borgoña `#4A0E1C` (principal), borgoña oscuro `#2A0710`, dorado `#C6A15B` (acento), crema `#F5EEE3`, marfil `#FBF8F3`. Variables CSS al inicio de `style.css`.
- Tipografías: Cormorant Garamond (titulares) + Jost (texto), por Google Fonts.
- Estilo: minimalista, elegante, premium; mucho aire; animaciones suaves (revelado al scroll, titulares palabra por palabra, líneas doradas animadas, parallax muy sutil). Todo respeta `prefers-reduced-motion`.
- **El logo no se redibuja.** `assets/logo-gold.png` es el logo original extraído (fondo transparente); `logo-leaf`, `logo-wordmark`, `logo-gourmet` son recortes del mismo; `logo-gold-bright.png` es la variante clara para el destello; `logo-original.webp` es el original sobre borgoña (sección Nosotros).
- Números dentro de círculos: usar fuente Jost con cifras alineadas (Cormorant las deja desalineadas).

## Estructura de la página (en orden)
Hero → "Catering para eventos, a tu manera" (dos caminos) → Nosotros → Propuesta (servicios) → Experiencia gourmet → Productos (catálogo) → **Alquiler** (torres y bandejas) → **Simulador** → Eventos → Cotización (formulario) → Galería/Instagram → Testimonios → CTA final → Footer.

## Decisiones de negocio y de UX (no revertir sin preguntar)
- **Todos los botones llevan al formulario de cotización** (`#contacto`). El **único acceso directo a WhatsApp** es el botón flotante (con mini-mensajes de ejemplo que rotan y un panel de mensajes rápidos) y un enlace discreto dentro del formulario, más el número del footer.
- **Dos flujos**:
  1. *Pedir pasabocas*: catálogo → "Agregar a mi pedido" → barra flotante "Continuar con mi pedido" → formulario en modo `pasabocas` → mensaje de WhatsApp con la lista de productos.
  2. *Cotizar mi evento*: formulario en modo `evento` (tipo de evento, invitados, fecha) → mensaje de WhatsApp estructurado.
- Precios: **no se muestran** (cotización personalizada). El valor del depósito **no está definido**: se dice que "se confirma en la cotización". No inventarlo.
- Simulador: el cliente pone la **mesa propia** (rectangular/redonda, medidas), elige pasabocas (de 6 en 6), torres/bandejas a alquilar y las medidas de su espacio. Vista "Sobre la mesa" (a escala, vista aérea) y "En mi espacio" (plano con mesas arrastrables, avisa solapes y menos de 60 cm para circular). "Cotizar esta configuración" copia todo al formulario.

## Configuración rápida (`script.js`, parte superior)
- `WHATSAPP_NUMBER = '573053172716'` (se muestra como +57 305 317 2716).
- `EMAIL` ya es el real: `vibransstudio@gmail.com`.
- `INSTAGRAM_URL`, `INSTAGRAM_HANDLE`, `CITY`: **placeholders** (`@vibransgourmet`, `Colombia`) por reemplazar.
- `FORM_ENDPOINT`: vacío; si se pone una URL, el formulario también envía JSON a un backend.
- Datos editables: `SERVICES`, `EXPERIENCE`, `PRODUCTS`, `EVENTS`, `GALLERY`, `STANDS`, `TABLE_PRESETS`, `WA_TEASERS`, `WA_CHIPS`.
- Para poner una foto en cualquier tarjeta: añadir `img: 'assets/archivo.webp'` (y opcional `pos: 'center 30%'`). Sin `img` se muestra una ilustración dorada.

## Pendientes / datos por confirmar
1. **Fotos de las torres y bandejas** (torre de 3 pisos crema con dorado o blanca, torre de 2 pisos blanca, bandeja rectangular festoneada): el usuario las mostró en el chat pero **nunca se guardaron como archivo**. Pedirle que las ponga en `assets/` y conectarlas en `STANDS` con `img`. Nota: parecen fotos de marketplace con etiquetas ("2 Color"); recortar sin esas etiquetas.
2. **Medidas y capacidades de `STANDS` son de EJEMPLO**: torre 3 pisos Ø34 cm / 30 piezas, torre 2 pisos Ø28 cm / 20 piezas, bandeja 42×30 cm / 24 piezas. Pedir las reales. También es supuesto `perGuest = 6` pasabocas por persona.
3. **Catálogo real (13/10/2026)**: `PRODUCTS` ya tiene los 11 productos reales (8 salados + Boca di tuna + 2 dulces) (fotos `assets/<nombre-del-producto>.jpg`, textos de `Image/Descripcion de Productos.docx`; la foto se identifica por el número `IMG_xxxx` del documento). Las **categorías** del filtro (Pasabocas / Canapés / Mini sándwiches / **Caprichos dulces** para los postres) las asignamos nosotros, el documento no las trae. Los 3 testimonios siguen siendo inventados. Reemplazarlos por los reales.
4. Instagram, correo y ciudad reales; `canonical` y URL absoluta de `og:image` al publicar.
5. Solo hay 2 fotos de producto: se reutilizan recortadas en galería/servicios. Conviene pedir más fotos.
6. Publicación en línea (GitHub Pages o Cloudflare Workers como la página de Sonetix): aún no hecha; ofrecer ayuda.
7. Eventos y algunos servicios usan ilustración dorada en vez de foto.

## Cómo probar localmente
- Abrir `index.html` en el navegador, o servir la carpeta: `python -m http.server 8741` dentro de `vibrans-gourmet`.
- En la sesión de Claude Code existe la entrada `vibrans` en `../.claude/launch.json` (puerto 8741) para `preview_start`.
- Verificación usada: revisar consola, probar formulario/WhatsApp con `window.open` simulado, comprobar desbordes horizontales en 375 px y capturas en 1440 px.

## Trampas técnicas ya encontradas
- `mask-image: url(...)` falla al abrir con `file://`; por eso el destello del logo usa una segunda imagen con máscara de **degradado** (no `url`).
- Si el header usara `backdrop-filter` directo, rompería el menú móvil `position: fixed`; el fondo está en `::before`.
- `.reveal` usa la propiedad `translate` (no `transform`) para no chocar con los hover de las tarjetas.
- `scheduleSim` usa `setTimeout` y no `requestAnimationFrame` (rAF se pausa en pestañas sin renderizar).
- Menú hamburguesa por debajo de **1320 px** (hay 8 enlaces); si se cambia, actualizar el CSS (`@media (max-width: 1320px)`) y `matchMedia('(min-width: 1321px)')` en `script.js`.
- En el entorno PowerShell de Claude Code, comandos con cadenas como `/*` o `\n` pueden ser bloqueados por falso positivo: escribir el contenido con la herramienta de archivos y ejecutar un script aparte.
- Git avisa de LF→CRLF: es solo un aviso.
