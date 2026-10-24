// ---------------------------------------------------------------
// Huella para saber de dónde vino una venta.
//
// Cuando alguien manda la cotización (o toca un botón de WhatsApp), se
// guarda en el sistema (tabla atribucion_leads del presupuestador) el
// código que viaja en el WhatsApp, el canal, la campaña y el contacto que
// dejó. Cuando el vendedor convierte en orden, el sistema la busca por
// teléfono, email, nombre o el código y marca solo el origen de la venta.
//
// La llave es la pública del presupuestador: la tabla solo acepta
// agregar filas, no deja leer. Va con keepalive y nunca bloquea el envío.
// ---------------------------------------------------------------
const URL_SISTEMA = "https://bbwqzvuhtovuujaovanb.supabase.co/rest/v1/atribucion_leads";
const LLAVE_SISTEMA = "sb_publishable_QhbWVFgSn_o216-5KZVY6w_O1wsCtMI";

const corto = (v, n) => (v ? String(v).slice(0, n) : null);

const normTel = (t) => {
  let d = String(t || "").replace(/\D/g, "");
  if (/^54/.test(d) && d.length > 10) d = d.slice(2);
  if (/^9/.test(d) && d.length === 11) d = d.slice(1);
  if (/^0/.test(d)) d = d.slice(1);
  if (d.length > 10) d = d.slice(-10);
  if (d.length === 10 && /^15/.test(d)) d = "11" + d.slice(2);
  return d.length >= 8 ? d : null;
};

const normNombre = (n) =>
  String(n || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim() || null;

// Mismo criterio que la web y las landings.
const canalDe = (a) => {
  const src = String(a.utm_source || "").toLowerCase();
  const med = String(a.utm_medium || "").toLowerCase();
  const pago = /cpc|ppc|paid|ads|cpm/.test(med);
  if (a.gclid || (/google/.test(src) && pago)) return "Google Ads";
  if (/facebook|instagram|meta|^fb$|^ig$/.test(src) && pago) return "Meta Ads";
  if (a.fbclid) return "Meta Ads";
  if (src) return pago ? `Anuncio (${src})` : `Campaña (${src})`;
  return "Directo";
};

export function enviarHuella({ ref, nombre, telefono, email, atribucion = {}, datos = {} }) {
  try {
    const a = atribucion || {};
    fetch(URL_SISTEMA, {
      method: "POST",
      keepalive: true,
      headers: {
        apikey: LLAVE_SISTEMA,
        Authorization: `Bearer ${LLAVE_SISTEMA}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        fuente: "cotizador",
        canal: canalDe(a),
        ref: corto(ref, 120),
        tel_norm: normTel(telefono),
        email_norm: email ? String(email).trim().toLowerCase().slice(0, 200) : null,
        nombre_norm: corto(normNombre(nombre), 120),
        campana: corto(a.utm_campaign, 200),
        anuncio: corto(a.utm_content, 200),
        gclid: corto(a.gclid, 300),
        fbclid: corto(a.fbclid, 500),
        utm_source: corto(a.utm_source, 200),
        utm_medium: corto(a.utm_medium, 200),
        utm_campaign: corto(a.utm_campaign, 200),
        utm_content: corto(a.utm_content, 200),
        utm_term: corto(a.utm_term, 200),
        pagina: corto(a.landing_url || location.href, 500),
        referrer: corto(a.referrer, 500),
        datos,
      }),
    }).catch(() => {});
  } catch { /* nunca bloquear el envío */ }
}
