import React, { useState, useEffect } from "react";

const LOGO_ISO = "https://media.base44.com/images/public/6a3a783a8f060b08a350b7f4/caf07a380_SP-iso-negro.png";

export default function Navbar({ onCotizar }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F9F8F6]/90 backdrop-blur-xl border-b border-black/5 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          <a
            href="https://www.suplacard.com"
            className="flex items-center gap-2.5"
          >
            <img src={LOGO_ISO} alt="Suplacard" className="h-8 w-auto" />
            <span className="font-['Montserrat'] text-[17px] uppercase text-[#111111]" style={{ fontWeight: 400, letterSpacing: 0 }}>
              SUPLACARD
            </span>
          </a>

          <button
            onClick={onCotizar}
            className="inline-flex items-center justify-center px-7 py-3 bg-[#111111] text-white hover:bg-[#333333] transition-colors" style={{ borderRadius: 1, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}
          >
            Cotizar ahora
          </button>
        </div>
      </div>
    </nav>
  );
}
