import Link from 'next/link';

const enlaces = [
  { texto: 'Inicio', href: '/' },
  { texto: 'Consultar deuda', href: '/consultar-deuda' },
  { texto: 'Reportar problema', href: '/reportes/nuevo' },
  { texto: 'Reclamos', href: '/reclamos' },
  { texto: 'Iniciar sesion', href: '/login' },
];

const legal = [
  { texto: 'Terminos y condiciones', href: '/terminos' },
  { texto: 'Politica de privacidad', href: '/privacidad' },
  { texto: 'Transparencia', href: '/transparencia' },
];

export default function Footer() {
  return (
    <footer className="bg-paper-900 text-paper-300 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                <img
                  src="/assets/images/logo_jass.png"
                  alt="JASS Palian"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-bold text-lg">JASS Palian</span>
            </div>
            <p className="text-sm text-paper-400 max-w-sm">
              Junta Administradora de Servicios de Saneamiento de Palian.
              Brindamos agua potable y alcantarillado a las familias del centro poblado de Palian, Huancayo.
            </p>
            <div className="mt-4 text-xs text-paper-500 space-y-1">
              <p>RUC: 20XXXXXXX</p>
              <p>Resolucion de Creacion: N. XXXX-XX-XX</p>
              <p>Jr. Palian s/n, Palian, Huancayo</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Servicios</h3>
            <ul className="space-y-2 text-sm">
              {enlaces.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="hover:text-white transition-colors">
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              {legal.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="hover:text-white transition-colors">
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-white font-semibold text-sm mt-5 mb-3">Horario</h3>
            <p className="text-sm text-paper-400">
              Lun-Vie: 8am-4pm<br />
              Sab: 9am-12pm
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-paper-500">
          <p>&copy; {new Date().getFullYear()} JASS Palian. Todos los derechos reservados.</p>
          <p>Hecho para la comunidad de Palian</p>
        </div>
      </div>
    </footer>
  );
}
