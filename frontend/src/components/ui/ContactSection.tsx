'use client';

import { useState } from 'react';

const canales = [
  {
    id: 'whatsapp',
    titulo: 'WhatsApp',
    descripcion: 'Respuesta inmediata para consultas generales',
    accion: 'Escríbenos',
    href: 'https://wa.me/51987654321?text=Hola%20JASS%20Palian%20tengo%20una%20consulta',
    icono: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: 'presencial',
    titulo: 'Atención Presencial',
    descripcion: 'Oficina principal en Palian',
    accion: 'Cómo llegar',
    href: '#mapa',
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'reclamo',
    titulo: 'Reclamos',
    descripcion: 'Registra tu reclamo formal online',
    accion: 'Abrir reclamo',
    href: '/reclamos/nuevo',
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const horarios = [
  { dia: 'Lunes a Viernes', hora: '8:00 AM — 4:00 PM' },
  { dia: 'Sábados', hora: '9:00 AM — 12:00 PM' },
  { dia: 'Domingos y feriados', hora: 'Cerrado' },
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <section id="contacto" className="surface-2 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-12 text-center">
          <p className="label mb-2">Canal de atención</p>
          <h2 className="text-3xl md:text-4xl font-bold text-paper-900">
            Estamos para servirte
          </h2>
          <p className="text-paper-600 mt-3 max-w-xl mx-auto">
            Elige el canal que más te convenga. Nuestro equipo está listo para atenderte.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {canales.map((canal) => (
            <a
              key={canal.id}
              href={canal.href}
              className="card group flex items-start gap-4 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-pvc-blue/10 text-pvc-blue flex items-center justify-center">
                {canal.icono}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-paper-900">{canal.titulo}</h3>
                <p className="text-sm text-paper-600 mt-0.5">{canal.descripcion}</p>
                <span className="inline-block mt-2 text-sm font-medium text-pvc-blue group-hover:underline">
                  {canal.accion} →
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="font-bold text-lg text-paper-900 mb-4">Formulario de contacto</h3>
            {enviado ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-canal-ok/10 text-canal-ok flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-paper-900">Mensaje enviado</p>
                <p className="text-sm text-paper-600 mt-1">
                  Te responderemos dentro de 24 horas hábiles.
                </p>
                <button
                  onClick={() => { setEnviado(false); setFormData({ nombre: '', dni: '', telefono: '', asunto: '', mensaje: '' }); }}
                  className="btn-outline mt-4"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-paper-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      required
                      className="input-base"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-paper-700 mb-1">
                      DNI
                    </label>
                    <input
                      id="dni"
                      type="text"
                      required
                      maxLength={8}
                      className="input-base"
                      value={formData.dni}
                      onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-paper-700 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    className="input-base"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="asunto" className="block text-sm font-medium text-paper-700 mb-1">
                    Asunto
                  </label>
                  <select
                    id="asunto"
                    required
                    className="input-base"
                    value={formData.asunto}
                    onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="consulta">Consulta general</option>
                    <option value="factura">Problema con factura</option>
                    <option value="servicio">Interrupción de servicio</option>
                    <option value="medidor">Problema con medidor</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-paper-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    required
                    rows={4}
                    className="input-base resize-none"
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg text-paper-900 mb-4">Horario de atención</h3>
              <div className="divide-y divide-paper-200">
                {horarios.map((h) => (
                  <div key={h.dia} className="flex justify-between py-3 first:pt-0 last:pb-0">
                    <span className="text-sm text-paper-700">{h.dia}</span>
                    <span className="text-sm font-medium text-paper-900">{h.hora}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="mapa" className="card overflow-hidden">
              <div className="bg-paper-200 h-48 flex items-center justify-center text-paper-500 text-sm">
                Mapa — Jr. Palian s/n, Huancayo
              </div>
              <div className="p-4">
                <p className="text-sm text-paper-700">
                  <strong>Jr. Palian s/n</strong><br />
                  Centro de Palian, Huancayo — Junín
                </p>
                <a
                  href="https://maps.google.com/?q=Jr+Palian+Huancayo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm font-medium text-pvc-blue hover:underline"
                >
                  Abrir en Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
