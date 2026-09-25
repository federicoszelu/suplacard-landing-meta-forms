// ---------------------------------------------------------------
// Boton "WhatsApp" directo (sin completar el formulario).
//
// No dispara el Lead desde el navegador: un clic no es un lead. Lo que
// hace es:
//   1. Generar un ref unico (wa_xxxx) y grabarlo en Supabase
//      (public.wa_clicks) con fbclid, _fbp, UTMs y user agent.
//   2. Agregar "(ref: wa_xxxx)" al final del mensaje de WhatsApp.
//
// Cuando el chat entra en respond.io, un Workflow llama a la edge
// function capi-lead con el mensaje; la funcion busca el ref y manda UN
// Lead a Meta por la API de Conversiones (event_id = ref). Asi Meta
// cuenta solo los chats reales, una sola vez cada uno.
// ---------------------------------------------------------------

const SUPABASE_URL = "https://jeeqyynfurdeitnisupi.supabase.co";
const SUPABASE_KEY = "sb_publishable_F2CXviXhqqaN3zz63sp4mw_sqHnC-wE";
const TELEFONO = "5491151359303";

const nuevoRef = () => {
  const r = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  return ("wa_" + r).slice(0, 27);
};

const leerCookie = (nombre) => {
  const m = document.cookie.match(new RegExp("(?:^|; )" + nombre + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
};

const atribucion = () => {
  try {
    if (window.SuplacardTracking && window.SuplacardTracking.getStoredAttribution) {
      return window.SuplacardTracking.getStoredAttribution() || {};
    }
  } catch { /* sigue con {} */ }
  return {};
};

const corto = (v, n) => (v ? String(v).slice(0, n) : null);

// Devuelve la URL de wa.me con el ref ya agregado. El grabado va con
// keepalive para que termine aunque la pagina se vaya a WhatsApp.
export function urlWhatsAppConRef(texto, entryPoint) {
  const ref = nuevoRef();
  const a = atribucion();

  try {
    fetch(`${SUPABASE_URL}/rest/v1/wa_clicks`, {
      method: "POST",
      keepalive: true,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        ref,
        entry_point: corto(entryPoint, 40),
        fbclid: corto(a.fbclid, 500),
        fbp: corto(leerCookie("_fbp"), 200),
        user_agent: corto(navigator.userAgent, 500),
        page_url: corto(location.href, 1000),
        utm_source: corto(a.utm_source, 200),
        utm_campaign: corto(a.utm_campaign, 200),
        utm_content: corto(a.utm_content, 200),
        utm_term: corto(a.utm_term, 200),
      }),
    }).catch(() => {});
  } catch { /* nunca bloquear el WhatsApp */ }

  const mensaje = `${texto}\n\n(ref: ${ref})`;
  return `https://wa.me/${TELEFONO}?text=${encodeURIComponent(mensaje)}`;
}
