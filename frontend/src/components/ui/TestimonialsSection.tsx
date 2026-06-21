'use client';

const voces = [
  {
    nombre: 'María López',
    sector: 'Sector 1 — Jr. Arequipa',
    texto: 'Antes perdía la mañana haciendo cola. Ahora veo mi recibo en el celular y pago con Yape en segundos.',
    tipo: 'pago-digital',
  },
  {
    nombre: 'Don Juan Pérez',
    sector: 'Sector 2 — Av. Los Incas',
    texto: 'Reporté una fuga en la vereda por WhatsApp. Al día siguiente ya estaban reparando. Rápido.',
    tipo: 'reclamo-atendido',
  },
  {
    nombre: 'Carmen Rojas',
    sector: 'Sector 3 — Urb. Santa Rosa',
    texto: 'Me gusta ver las lecturas reales. Antes me cobraban estimado y siempre era más. Ahora es justo.',
    tipo: 'lectura-real',
  },
  {
    nombre: 'Sr. Eduardo Quispe',
    sector: 'Sector 4 — Jr. Huancavelica',
    texto: 'La oficina me explicó la tarifa social. Califico y pago la mitad. Nadie me había dicho antes.',
    tipo: 'tarifa-social',
  },
  {
    nombre: 'Rosa Chávez',
    sector: 'Sector 1 — Jr. Arequipa',
    texto: 'Avisaron del corte programado por mensaje. Pude guardar agua con tiempo. Detalle que se agradece.',
    tipo: 'aviso-corte',
  },
  {
    nombre: 'Familia Gutiérrez',
    sector: 'Sector 2 — Av. Los Incas',
    texto: 'Registramos la lectura nosotros mismos por la app. El medidor está alto y no suben a leerlo.',
    tipo: 'autolectura',
  },
];

const iconosTipo = {
  'pago-digital': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M10 5v4M14 5v4" />
      <circle cx="16" cy="14" r="1" />
    </svg>
  ),
  'reclamo-atendido': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  'lectura-real': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  ),
  'tarifa-social': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  'aviso-corte': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  'autolectura': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
};

const TestimonialsSection = () => {
  return (
    <section 
      className="section-lg bg-paper-base"
      aria-labelledby="testimonials-title"
    >
      <div className="container-page">
        <header className="text-center mb-12">
          <h2 id="testimonials-title" className="text-display text-3xl sm:text-4xl font-bold text-balance">
            Vecinos de <span className="text-pvc-blue">Palian cuentan</span>
          </h2>
          <p className="text-body text-ink-secondary mt-3 max-w-2xl mx-auto text-balance">
            Experiencias reales de usuarios del servicio. Sin filtros, sin estrellas.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Voces de vecinos">
          {voces.map((voz, index) => (
            <article
              key={voz.nombre}
              className="card group"
              role="listitem"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-card flex items-center justify-center flex-shrink-0 text-pvc-blue ${voz.tipo === 'pago-digital' || voz.tipo === 'lectura-real' ? 'bg-pvc-blue/10' : voz.tipo === 'reclamo-atendido' || voz.tipo === 'aviso-corte' ? 'bg-stamp-blue/10' : voz.tipo === 'tarifa-social' ? 'bg-canal-green/10' : 'bg-rust-warning/10'}`}>
                  {iconosTipo[voz.tipo as keyof typeof iconosTipo]}
                </div>
                <div>
                  <p className="text-heading font-medium">{voz.nombre}</p>
                  <p className="text-caption text-ink-tertiary">{voz.sector}</p>
                </div>
              </div>
              <blockquote className="text-body text-ink-secondary leading-relaxed italic">
                "{voz.texto}"
              </blockquote>
              <div className="mt-4 pt-4 border-t border-border-subtle flex items-center gap-2 text-caption text-ink-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Usuario verificado JASS Palian</span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA para más testimonios */}
        <div className="text-center mt-10">
          <p className="text-caption text-ink-tertiary mb-3">
            ¿Quieres compartir tu experiencia?
          </p>
          <a href="#contacto" className="btn-ghost">
            Escríbenos →
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;