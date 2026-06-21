import Link from 'next/link';

const pasos = [
  { n: '1', texto: 'Lleva tu DNI' },
  { n: '2', texto: 'Know your número de medidor' },
  { n: '3', texto: 'Regístrate en 2 minutos' },
];

export default function CTASection() {
  return (
    <section className="surface-3 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <p className="label mb-3">Regístralo</p>
        <h2 className="text-3xl md:text-4xl font-bold text-paper-900 mb-4">
          Crea tu cuenta en minutos
        </h2>
        <p className="text-paper-600 max-w-xl mx-auto mb-8">
          Necesitas tu DNI y el número de medidor que aparece en tu recibo.
          El registro es gratuito y te da acceso inmediato a tu consumo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10">
          {pasos.map((p, i) => (
            <div key={p.n} className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pvc-blue text-white text-sm font-bold flex items-center justify-center">
                {p.n}
              </span>
              <span className="text-sm text-paper-700 font-medium">{p.texto}</span>
              {i < pasos.length - 1 && (
                <span className="hidden sm:block text-paper-300 ml-2">—</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="btn-primary text-base px-8 py-3">
            Crear cuenta
          </Link>
          <Link href="/login" className="btn-outline text-base px-8 py-3">
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </section>
  );
}
