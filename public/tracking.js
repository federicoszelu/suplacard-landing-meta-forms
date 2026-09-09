/*!
 * Suplacard forms — tracking.js
 * Portado de lp.suplacard.com (assets/js/tracking.js) para dejar el
 * dataLayer alineado: captura attribution (UTMs + gclid + fbclid),
 * genera click_id persistente por sesion, push a dataLayer en cada
 * conversion (whatsapp_click). GTM consume estos eventos para disparar
 * el Lead de Meta (25867), GA4 y la conversion de Google Ads.
 *
 * Dependencias: ninguna. Vanilla JS. Se ejecuta al cargar (IIFE).
 * Expone API en window.SuplacardTracking.
 */
(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  function setCookie(name, value, days) {
    if (value == null || value === "") return;
    try {
      var expires = new Date();
      expires.setTime(expires.getTime() + days * 86400000);
      document.cookie =
        name + "=" + encodeURIComponent(value) +
        ";expires=" + expires.toUTCString() + ";path=/;samesite=lax";
    } catch (e) {}
  }

  function getCookie(name) {
    try {
      var match = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
      );
      return match ? decodeURIComponent(match[1]) : null;
    } catch (e) {
      return null;
    }
  }

  // First-touch wins. gclid/fbclid 90d (alineado con Google Ads), UTMs 30d.
  var ATTR_FIELDS = {
    gclid: 90,
    fbclid: 90,
    utm_source: 30,
    utm_medium: 30,
    utm_campaign: 30,
    utm_term: 30,
    utm_content: 30,
  };

  function captureAttribution() {
    var params;
    try {
      params = new URLSearchParams(location.search);
    } catch (e) {
      return;
    }
    for (var key in ATTR_FIELDS) {
      if (!ATTR_FIELDS.hasOwnProperty(key)) continue;
      var val = params.get(key);
      if (val) setCookie("sup_" + key, val, ATTR_FIELDS[key]);
    }
    if (!getCookie("sup_first_landing")) {
      setCookie("sup_first_landing", location.pathname, 30);
      setCookie("sup_first_ts", new Date().toISOString(), 30);
    }
  }

  function getStoredAttribution() {
    return {
      gclid: getCookie("sup_gclid"),
      fbclid: getCookie("sup_fbclid"),
      utm_source: getCookie("sup_utm_source"),
      utm_medium: getCookie("sup_utm_medium"),
      utm_campaign: getCookie("sup_utm_campaign"),
      utm_term: getCookie("sup_utm_term"),
      utm_content: getCookie("sup_utm_content"),
      first_landing: getCookie("sup_first_landing"),
      first_ts: getCookie("sup_first_ts"),
    };
  }

  // Click ID persistente por sesion: varios envios de la misma visita
  // comparten ID (para que Kapso matchee todos los mensajes del lead).
  var CLICK_ID_KEY = "sup_click_id";

  function generateId() {
    return "sup_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 8);
  }

  function getClickId() {
    try {
      var existing = sessionStorage.getItem(CLICK_ID_KEY);
      if (existing) return existing;
      var id = generateId();
      sessionStorage.setItem(CLICK_ID_KEY, id);
      return id;
    } catch (e) {
      return generateId();
    }
  }

  // Push a dataLayer del evento de conversion. GTM (CE - whatsapp_click)
  // dispara GA4 + Google Ads + Meta Lead. Retorna el click_id para que el
  // caller lo inyecte en el mensaje de WhatsApp.
  function trackWhatsAppClick(opts) {
    opts = opts || {};
    var clickId = getClickId();
    var attr = getStoredAttribution();

    var payload = {
      event: "whatsapp_click",
      wa_click_id: clickId,
      wa_entry_point: opts.entryPoint || "unknown",
      wa_kw_code: opts.kwCode || null,
      wa_cluster: opts.cluster || null,
      wa_keyword: opts.keyword || null,
      wa_phone_provided: !!opts.phone,
      wa_context_provided: !!opts.context,
      wa_page_url: location.pathname + location.search,
      wa_page_path: location.pathname,
      wa_page_title: document.title,
      wa_timestamp: new Date().toISOString(),
      gclid: attr.gclid,
      fbclid: attr.fbclid,
      utm_source: attr.utm_source,
      utm_medium: attr.utm_medium,
      utm_campaign: attr.utm_campaign,
      utm_term: attr.utm_term,
      utm_content: attr.utm_content,
      first_landing: attr.first_landing,
      first_ts: attr.first_ts,
    };

    window.dataLayer.push(payload);
    return clickId;
  }

  captureAttribution();

  window.SuplacardTracking = {
    init: captureAttribution,
    getClickId: getClickId,
    getStoredAttribution: getStoredAttribution,
    trackWhatsAppClick: trackWhatsAppClick,
    _debug: function () {
      return {
        clickId: getClickId(),
        attribution: getStoredAttribution(),
        dataLayer: window.dataLayer,
      };
    },
  };
})();
