'use client';

import Link from 'next/link';

const pasos = [
  {
    numero: 1,
    titulo: 'Consulta tu deuda',
    descripcion: 'Ve tu factura actual, historial de lecturas y consumo mensual al instante.',
    items: [
      'Lectura anterior y actual',
      'Consumo en m³ calculado',
      'Monto exacto a pagar',
      'Fecha de vencimiento',
    ],
    cta: { label: 'Ver mi recibo', href: '/register', variant: 'primary' },
    color: 'pvc-blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    ),
  },
  {
    numero: 2,
    titulo: 'Paga sin colas',
    descripcion: 'Paga con los medios que ya usas, desde donde estés.',
    items: [
      'Yape / Plin (al instante)',
      'Transferencia bancaria',
      'Efectivo en agentes/banco',
      'Comprobante automático',
    ],
    cta: { label: 'Pagar ahora', href: '/register', variant: 'secondary' },
    color: 'stamp-blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20M10 5v4M14 5v4" />
        <circle cx="16" cy="14" r="1" />
      </svg>
    ),
  },
  {
    numero: 3,
    titulo: 'Reportas incidencias',
    descripcion: 'Avisa fugas, presión baja o medidor dañado. Le llega directo al técnico.',
    items: [
      'Fuga visible en vía pública',
      'Presión baja o nula',
      'Medidor roto o adulterado',
      'Calidad del agua (color/olor)',
    ],
    cta: { label: 'Hacer reclamo', href: '/register', variant: 'secondary' },
    color: 'rust-warning',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    ),
  },
  {
    numero: 4,
    titulo: 'Te informas',
    descripcion: 'Entérate de cortes programados, calidad del agua y horarios de atención.',
    items: [
      'Cortes programados por sector',
      'Resultados de calidad de agua',
      'Horarios de oficina y agentes',
      'Novedades y comunicados JASS',
    ],
    cta: { label: 'Ver alertas', href: '#contacto', variant: 'ghost' },
    color: 'canal-green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

const FeaturesSection = () => {
  return (
    <section 
      id="servicios" 
      className="section-lg bg-paper-base"
      aria-labelledby="features-title"
    >
      <div className="container-page">
        <header className="text-center mb-12">
          <h2 id="features-title" className="text-display text-3xl sm:text-4xl font-bold text-balance">
            Tu agua en <span className="text-pvc-blue">4 pasos</span>
          </h2>
          <p className="text-body text-ink-secondary mt-3 max-w-2xl mx-auto text-balance">
            Todo lo que necesitas hacer con tu servicio de agua, sin ir a la oficina.
          </p>
        </header>

        <div className="grid md:grid-cols-4 gap-4" role="list" aria-label="Pasos del servicio">
          {pasos.map((paso, index) => (
            <article
              key={paso.numero}
              className="card relative overflow-hidden group"
              role="listitem"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Número de paso */}
              <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4">
                <span className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold text-white/90 shadow-card`}
                  style={{ backgroundColor: `var(--tw-bg-opacity, 1) ${paso.color}` }}>
                  {paso.numero}
                </span>
              </div>

              <div className="relative pr-12">
                {/* Icono */}
                <div className={`w-12 h-12 rounded-card flex items-center justify-center mb-4 ${paso.color}/10 text-${paso.color} group-hover:scale-105 transition-transform duration-300`}>
                  {paso.icon}
                </div>

                {/* Título */}
                <h3 className="text-heading text-xl font-semibold mb-2">
                  {paso.titulo}
                </h3>

                {/* Descripción */}
                <p className="text-body text-sm text-ink-secondary mb-4">
                  {paso.descripcion}
                </p>

                {/* Lista de items */}
                <ul className="space-y-2 mb-6" role="list">
                  {paso.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${paso.color}`} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={paso.cta.href}
                  className={`btn-${paso.cta.variant} w-full justify-center`}
                >
                  {paso.cta.label}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Línea conectora visual en desktop */}
        <div className="hidden md:block absolute left-[14.5%] right-[14.5%] top-[110px] h-0.5 bg-gradient-to-r from-transparent via-border-standard to-transparent -z-10" aria-hidden="true" />
      </div>
    </section>
  );
};

export default FeaturesSection;