/* Mahana Tours — Golden Hour Explorer Navbar */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sun } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/data";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/tours", label: "Tours" },
  { href: "/botes", label: "Botes" },
  { href: "/nosotros", label: "Nosotros" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  const isLightTop = location === "/nosotros" || location === "/not-found";
  const isScrolledOrLight = scrolled || isLightTop;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : isLightTop 
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo-mahana-icon.png" alt="Mahana Tours" className="w-9 h-9 rounded-full object-cover" />
          <div className="flex flex-col leading-tight">
            <span
              className={`text-lg font-bold tracking-tight transition-colors ${
                isScrolledOrLight || open ? "text-deep-blue" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              Mahana Tours
            </span>
            <span
              className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${
                isScrolledOrLight || open ? "text-gold-dark" : "text-gold-light"
              }`}
            >
              Riviera del Pacífico
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-gold ${
                location === link.href
                  ? isScrolledOrLight ? "text-gold-dark" : "text-gold"
                  : isScrolledOrLight ? "text-deep-blue" : "text-white/90"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-gold text-deep-blue text-sm font-semibold rounded-full hover:bg-gold-light transition-colors"
          >
            Reservar
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isScrolledOrLight || open ? "text-deep-blue" : "text-white"
          }`}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-sand-dark">
          <div className="container py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium py-2 ${
                  location === link.href ? "text-gold-dark" : "text-deep-blue"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-5 py-3 bg-gold text-deep-blue text-center font-semibold rounded-full"
            >
              Reservar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
