'use client';

import Link from 'next/link';
import ReciboVivo from './ReciboVivo';

const HeroSection = () => {
  const handleReciboAction = (action: 'view' | 'pay') => {
    if (action === 'view') {
      window.location.href = '/register';
    } else if (action === 'pay') {
      window.location.href = '/register';
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Fondo sutil con textura papel */}
      <div className="absolute inset-0 bg-paper-base" />
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'var(--tw-bg-opacity, 1), url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")' }} />

      {/* Acento superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pvc-blue to-transparent" />

      <div className="container-page relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header informativo */}
          <div className="text-center mb-8 sm:mb-10 animate-in">
            <p className="text-caption text-adobe uppercase tracking-wider font-medium mb-3">
              Junta Administradora de Servicios de Saneamiento
            </p>
            <h1 id="hero-title" className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Tu agua, tu recibo,{' '}
              <span className="text-pvc-blue">en un clic</span>
            </h1>
            <p className="text-body text-lg sm:text-xl text-ink-secondary mt-4 max-w-2xl mx-auto text-balance">
              Consulta tu consumo, paga sin colas y avisa si hay fuga. 
              La oficina de agua de Palian ahora en tu bolsillo.
            </p>
          </div>

          {/* Recibo Vivo - Componente firma */}
          <div className="animate-in-delayed" style={{ animationDelay: '100ms' }}>
            <ReciboVivo 
              initialState="pending" 
              onActionClick={handleReciboAction}
            />
          </div>

          {/* Indicador de scroll */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in-delayed" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-col items-center gap-2 text-ink-tertiary">
              <span className="text-caption uppercase tracking-wider">Explora</span>
              <svg 
                className="w-6 h-6 animate-bounce" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;