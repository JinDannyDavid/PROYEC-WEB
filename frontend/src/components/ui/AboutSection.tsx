'use client';

import Link from 'next/link';

const valores = [
  {
    titulo: 'Agua de calidad',
    descripcion: 'Monitoreo diario de cloro residual, presión y continuidad. Cumplimos normas DIGESA.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        <path d="M12 12a5 5 0 0 1 0-10" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    titulo: 'Cuentas claras',
    descripcion: 'Facturación por consumo real (lectura de medidor). Sin estimados, sin sorpresas.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    ),
  },
  {
    titulo: 'Trato cercano',
    descripcion: 'Atendemos en oficina, WhatsApp y redes. Vecino habla con vecino, no con bot.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const enlacesInstitucionales = [
  { label: 'Organigrama y directiva', href: '#', externo: false },
  { label: 'Tarifario vigente 2025', href: '#', externo: false },
  { label: 'Plan de negocio anual', href: '#', externo: false },
  { label: 'Estados financieros', href: '#', externo: false },
  { label: 'Actas de asamblea', href: '#', externo: false },
  { label: 'Portal de transparencia SUNARP', href: 'https://www.sunarp.gob.pe', externo: true },
];

const AboutSection = () => {
  return (
    <section 
      id="nosotros" 
      className="section-lg bg-paper-raised border-y border-border-subtle"
      aria-labelledby="about-title"
    >
      <div className="container-page">
        <header className="text-center mb-12">
          <h2 id="about-title" className="text-display text-3xl sm:text-4xl font-bold text-balance">
            <span className="text-pvc-blue">JASS Palian</span> — Oficina de agua de la comunidad
          </h2>
          <p className="text-body text-ink-secondary mt-3 max-w-3xl mx-auto text-balance">
            Junta Administradora de Servicios de Saneamiento de Palian, Huancayo. 
            Constitución legal: RUC 20123456789 | Resolución Directoral N° 456-2018-MVCS
          </p>
        </header>

        {/* Foto/Ilustración de oficina real */}
        <div className="relative mb-12">
          <div className="aspect-[4/3] rounded-card overflow-hidden bg-paper-sunken border border-border-standard relative">
            {/* Placeholder para foto real - en producción reemplazar con imagen real */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-paper-sunken to-paper-base">
              <div className="text-center p-8">
                <svg className="w-20 h-20 mx-auto mb-4 text-border-standard" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M4 8h16M8 3v5M16 3v5" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
                <p className="text-caption text-ink-tertiary">Foto de la oficina JASS Palian</p>
                <p className="text-caption text-ink-muted mt-1">Jr. Los Incas 123, Palian, Huancayo</p>
                <p className="text-xs text-ink-muted mt-2">Reemplazar con fotografía real del equipo / fachada / recibo impreso</p>
              </div>
            </div>
            {/* Badge de ubicación */}
            <div className="absolute bottom-4 left-4 bg-pvc-blue text-white px-3 py-1.5 rounded-control text-sm font-medium shadow-card">
              📍 Jr. Los Incas 123, Palian
            </div>
          </div>
        </div>

        {/* Qué nos define */}
        <div className="grid md:grid-cols-3 gap-6 mb-12" role="list" aria-label="Valores institucionales">
          {valores.map((valor, index) => (
            <article 
              key={valor.titulo} 
              className="card text-center"
              role="listitem"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-card bg-pvc-blue/10 text-pvc-blue flex items-center justify-center">
                {valor.icon}
              </div>
              <h3 className="text-heading text-lg font-semibold mb-2">{valor.titulo}</h3>
              <p className="text-body text-sm text-ink-secondary">{valor.descripcion}</p>
            </article>
          ))}
        </div>

        {/* Misión / Visión compacta */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <article className="card">
            <h3 className="text-heading font-semibold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-pvc-blue/10 text-pvc-blue flex items-center justify-center text-sm font-bold">M</span>
              Misión
            </h3>
            <p className="text-body text-sm text-ink-secondary">
              Garantizar el acceso al agua potable segura, continua y asequible para todas las familias de Palian, 
              mediante una gestión eficiente, transparente y participativa.
            </p>
          </article>
          <article className="card">
            <h3 className="text-heading font-semibold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-canal-green/10 text-canal-green flex items-center justify-center text-sm font-bold">V</span>
              Visión
            </h3>
            <p className="text-body text-sm text-ink-secondary">
              Ser la JASS modelo en la región Junín: 100% medido, 100% facturado, 100% digital, 
              con comunidad informada y participativa en las decisiones del servicio.
            </p>
          </article>
        </div>

        {/* Enlaces institucionales / Transparencia */}
        <div className="card bg-paper-base border-border-emphasis">
          <h3 className="text-heading font-semibold mb-4 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-adobe" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 13h8M8 17h8M4 9h16" />
            </svg>
            Transparencia y acceso a la información pública
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {enlacesInstitucionales.map((enlace, index) => (
              <Link
                key={enlace.label}
                href={enlace.href}
                target={enlace.externo ? '_blank' : undefined}
                rel={enlace.externo ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 px-3 py-2 rounded-control bg-paper-raised border border-border-subtle hover:border-pvc-blue hover:bg-pvc-blue/5 transition-colors duration-200 focus-ring text-sm text-ink-secondary"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-ink-tertiary" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
                <span className="truncate">{enlace.label}</span>
                {enlace.externo && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-ink-muted ml-auto" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;