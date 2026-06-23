import React from "react";

const SECCIONES = [
  {
    titulo: "1. Identificación del Responsable",
    cuerpo: [
      "El presente formulario de cotización online es operado por BRIELVA S.A., con domicilio en la República Argentina, CUIT N.º 30-71177578-8, en adelante denominada Suplacard. Para consultas relacionadas con el tratamiento de sus datos personales, puede comunicarse a presupuestos@suplacard.com o al WhatsApp +54 9 11 5135-9303.",
    ],
  },
  {
    titulo: "2. Objeto y Alcance",
    cuerpo: [
      "El formulario de cotización tiene como único propósito permitir al usuario solicitar un presupuesto estimado para muebles a medida (placards, vestidores, cocinas y vanitorios). La información suministrada será utilizada exclusivamente para preparar una propuesta comercial y contactar al usuario a través de los medios indicados.",
    ],
  },
  {
    titulo: "3. Datos Personales — Ley 25.326 de Protección de Datos Personales",
    cuerpo: [
      "En cumplimiento de la Ley N.° 25.326 de Protección de los Datos Personales de la República Argentina y sus normas complementarias, se informa al usuario:",
      "a) Los datos personales recabados (nombre, teléfono, email, localidad y cualquier información suministrada en el formulario) serán incorporados a una base de datos de titularidad de BRIELVA S.A.",
      "b) La finalidad de la recolección es exclusivamente comercial: elaborar presupuestos y realizar el seguimiento de la consulta.",
      "c) Los datos no serán cedidos, vendidos ni transferidos a terceros sin el consentimiento expreso del titular.",
      "d) El titular de los datos tiene derecho a acceder, rectificar, actualizar y suprimir sus datos en cualquier momento, mediante solicitud dirigida a presupuestos@suplacard.com.",
      "e) La Agencia de Acceso a la Información Pública (AAIP) es el organismo de control en materia de protección de datos personales en Argentina. Para mayor información: www.argentina.gob.ar/aaip",
    ],
  },
  {
    titulo: "4. Confidencialidad de la Información",
    cuerpo: [
      "Toda la información suministrada por el usuario —incluyendo medidas, planos, fotografías, referencias visuales y descripciones del proyecto— es tratada con carácter estrictamente confidencial. Será accesible únicamente por el equipo comercial de Suplacard con el fin exclusivo de elaborar la cotización solicitada.",
    ],
  },
  {
    titulo: "5. Archivos Adjuntos",
    cuerpo: [
      "Los archivos adjuntados por el usuario (planos en PDF, fotografías en JPG/PNG u otros formatos) serán almacenados en servidores seguros con acceso restringido. No serán utilizados con fines distintos a la preparación del presupuesto solicitado, ni compartidos con terceros.",
    ],
  },
  {
    titulo: "6. Carácter No Vinculante de la Cotización",
    cuerpo: [
      "El presupuesto generado a partir del formulario tiene carácter orientativo y no constituye una oferta comercial vinculante. Los precios finales estarán sujetos a confirmación por parte del asesor comercial de Suplacard.",
    ],
  },
  {
    titulo: "7. Comunicaciones Comerciales",
    cuerpo: [
      "Al completar y enviar el formulario, el usuario presta su consentimiento para ser contactado por Suplacard a través de WhatsApp, teléfono o correo electrónico, con el único fin de dar respuesta a la consulta realizada. El usuario podrá revocar este consentimiento en cualquier momento comunicándose a presupuestos@suplacard.com.",
    ],
  },
  {
    titulo: "8. Seguridad de la Información",
    cuerpo: [
      "Suplacard adopta medidas técnicas y organizativas razonables para proteger los datos personales contra el acceso no autorizado, la alteración, divulgación o destrucción.",
    ],
  },
  {
    titulo: "9. Menores de Edad",
    cuerpo: [
      "El presente formulario está destinado exclusivamente a personas mayores de 18 años. Si tuviéramos conocimiento de que se han recopilado datos de un menor sin consentimiento parental, procederemos a su eliminación de inmediato.",
    ],
  },
  {
    titulo: "10. Modificaciones",
    cuerpo: [
      "Suplacard se reserva el derecho de modificar los presentes Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación en el sitio web.",
    ],
  },
  {
    titulo: "11. Jurisdicción y Ley Aplicable",
    cuerpo: [
      "Los presentes Términos y Condiciones se rigen por las leyes de la República Argentina. Ante cualquier controversia, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires.",
    ],
  },
];

export default function Terminos() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[800px] mx-auto px-6 sm:px-10 py-16 sm:py-24">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B38B67] mb-4">
          Documento legal
        </p>

        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#151515] mb-2">
          Términos y Condiciones
        </h1>
        <p className="text-[15px] text-[#151515]/50 mb-1">
          Formulario de Cotización Online — Suplacard
        </p>
        <p className="text-[13px] text-[#151515]/40 mb-12">
          BRIELVA S.A. · presupuestos@suplacard.com · Última actualización: Junio 2025
        </p>

        <div className="space-y-10">
          {SECCIONES.map((sec) => (
            <section key={sec.titulo}>
              <h2 className="font-display text-[20px] font-medium text-[#151515] mb-3">
                {sec.titulo}
              </h2>
              <div className="space-y-2">
                {sec.cuerpo.map((p, i) => (
                  <p key={i} className="text-[14px] sm:text-[15px] leading-[1.7] text-[#151515]/70">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-black/8 text-center">
          <p className="font-display text-[18px] font-medium text-[#151515] mb-1">
            BRIELVA S.A. — SUPLACARD
          </p>
          <p className="text-[13px] text-[#151515]/50">
            presupuestos@suplacard.com · +54 9 11 5135-9303 · www.suplacard.com
          </p>
          <p className="text-[12px] text-[#151515]/35 mt-3">Versión Junio 2025</p>
        </div>
      </div>
    </div>
  );
}