'use client';

const statsOperativos = [
  { 
    label: 'Lecturas tomadas', 
    value: '1,247', 
    unit: 'medidores',
    trend: '+12% vs mes anterior',
    trendPositive: true,
    icon: 'lectura'
  },
  { 
    label: 'Facturas emitidas', 
    value: '1,189', 
    unit: 'facturas',
    trend: '94.2% facturación',
    trendPositive: true,
    icon: 'factura'
  },
  { 
    label: 'Consumo promedio', 
    value: '58', 
    unit: 'm³/usuario',
    trend: 'Dentro de rango normal',
    trendPositive: true,
    icon: 'consumo'
  },
  { 
    label: 'Cobranza acumulada', 
    value: '94.2', 
    unit: '%',
    trend: 'S/ 124,580 recolectados',
    trendPositive: true,
    icon: 'cobranza'
  },
  { 
    label: 'Reclamos atendidos', 
    value: '23', 
    unit: '/ 25 recibidos',
    trend: '92% resoluci\u00f3n',
    trendPositive: true,
    icon: 'reclamo'
  },
];

const StatsSection = () => {
  return (
    <section 
      id="estadisticas" 
      className="section bg-paper-raised border-y border-border-subtle"
      aria-labelledby="stats-title"
    >
      <div className="container-page">
        <header className="text-center mb-10">
          <h2 id="stats-title" className="text-display text-3xl sm:text-4xl font-bold text-balance">
            Este mes en <span className="text-pvc-blue">JASS Palian</span>
          </h2>
          <p className="text-body text-ink-secondary mt-3 max-w-2xl mx-auto">
            Datos operativos reales actualizados al {new Date().toLocaleDateString('es-PE', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </header>

        <div className="table-container" role="region" aria-label="Estadísticas operativas del mes">
          <table className="table-base" aria-describedby="stats-title">
            <thead>
              <tr>
                <th scope="col" className="w-10 text-center">#</th>
                <th scope="col">Indicador</th>
                <th scope="col" className="text-right w-48">Valor</th>
                <th scope="col" className="w-56 text-center">Unidad</th>
                <th scope="col" className="w-72">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {statsOperativos.map((stat, index) => (
                <tr key={stat.label}>
                  <td className="text-center text-data font-medium text-ink-tertiary">
                    {index + 1}
                  </td>
                  <td className="font-medium text-ink-primary">
                    {stat.label}
                  </td>
                  <td className="text-right text-data-xl font-mono tabular-nums font-semibold">
                    {stat.value}
                  </td>
                  <td className="text-center text-caption text-ink-tertiary">
                    {stat.unit}
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`badge ${stat.trendPositive ? 'badge-ok' : 'badge-warning'}`}>
                        {stat.trendPositive ? '↑' : '↓'} {stat.trend}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen en móvil */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 md:hidden" role="list" aria-label="Resumen de indicadores">
          {statsOperativos.map((stat, index) => (
            <article 
              key={stat.label} 
              className="card text-center"
              role="listitem"
            >
              <p className="text-data-xl font-mono tabular-nums font-bold text-pvc-blue">
                {stat.value}
              </p>
              <p className="text-caption text-ink-tertiary mt-1 text-balance">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;