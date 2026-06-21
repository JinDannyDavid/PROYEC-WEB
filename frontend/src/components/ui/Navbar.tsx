'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-paper-base/95 backdrop-blur-md py-3 shadow-card border-b border-border-subtle' 
            : 'bg-transparent py-4'
        }`}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="container-page flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group focus-ring rounded-control px-2 py-1 -ml-2"
            aria-label="JASS Palian - Inicio"
          >
            <div className="w-9 h-9 rounded-full bg-pvc-blue flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                <path d="M12 12a5 5 0 0 1 0-10" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-heading font-semibold text-lg hidden sm:block">
              JASS <span className="text-pvc-blue">Palian</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-control text-sm font-medium text-ink-secondary hover:text-ink-primary hover:bg-paper-sunken transition-colors duration-200 focus-ring"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="btn-ghost px-4 py-2 text-sm"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="btn-primary px-5 py-2 text-sm"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-control text-ink-secondary hover:text-ink-primary hover:bg-paper-sunken focus-ring"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden bg-paper-base border-t border-border-subtle px-4 pb-4 animate-in"
            role="navigation"
            aria-label="Menú móvil"
          >
            <nav className="space-y-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-3 rounded-control text-ink-secondary hover:text-ink-primary hover:bg-paper-sunken transition-colors duration-200 focus-ring"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t border-border-subtle mt-4">
              <Link
                href="/login"
                className="btn-secondary w-full text-center"
                onClick={() => setIsOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="btn-primary w-full text-center"
                onClick={() => setIsOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;