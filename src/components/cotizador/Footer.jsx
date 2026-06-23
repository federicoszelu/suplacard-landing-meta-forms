import React from "react";

const LOGO_ISO = "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/caf07a380_SP-iso-negro.png";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 mt-16">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-10 flex flex-col items-center text-center gap-4">
        <div className="flex items-center gap-2.5">
          <img src={LOGO_ISO} alt="Suplacard" className="h-8 w-auto" />
          <span className="font-['Montserrat'] font-black text-[17px] tracking-[0.05em] uppercase text-[#151515]">
            SUPLACARD
          </span>
        </div>
        <p className="text-[13px] text-[#151515]/40 leading-relaxed max-w-[50ch]">
          Placards, vestidores y cocinas a medida en Buenos Aires. Fábrica propia desde 1993.
        </p>
        <p className="text-[12px] text-[#151515]/30">
          © 2026 Suplacard
        </p>
        <p className="text-[12px] text-[#151515]/30">
          Al enviar tu consulta aceptás nuestros{" "}
          <a
            href="/terminos"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#B38B67] transition-colors"
          >
            Términos y Condiciones
          </a>
        </p>
      </div>
    </footer>
  );
}