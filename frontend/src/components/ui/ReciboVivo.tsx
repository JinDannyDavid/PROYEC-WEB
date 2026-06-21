'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReciboVivoProps {
  initialState?: 'pending' | 'paid';
  onActionClick?: (action: 'view' | 'pay') => void;
}

const lecturaAnterior = 1189;
const lecturaActual = 1247;
const consumo = lecturaActual - lecturaAnterior;
const monto = 87.50;

export default function ReciboVivo({ 
  initialState = 'pending', 
  onActionClick 
}: ReciboVivoProps) {
  const [estado, setEstado] = useState<'pending' | 'paid'>(initialState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleEstado = () => {
    setEstado(prev => prev === 'pending' ? 'paid' : 'pending');
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    onActionClick?.('view');
  };

  const handlePay = (e: React.MouseEvent) => {
    e.preventDefault();
    onActionClick?.('pay');
  };

  return (
    <div className="card animate-in" role="region" aria-label="Factura actual">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5 pb-4 border-b border-border-subtle">
        <div>
          <p className="text-caption text-adobe uppercase tracking-wider">JASS PALIAN</p>
          <p className="text-heading text-lg font-semibold mt-0.5">FACTURA DE AGUA POTABLE</p>
        </div>
        <div className="text-right sm:text-left">
          <p className="text-caption text-ink-tertiary">Número de factura</p>
          <p className="text-data font-mono font-medium">F-2025-{String(Date.now()).slice(-6)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-caption text-ink-tertiary">Periodo de facturación</p>
          <p className="text-data font-medium">ENERO 2025</p>
        </div>
        <div className="text-right">
          <p className="text-caption text-ink-tertiary">Fecha de vencimiento</p>
          <p className="text-data font-medium">15/02/2025</p>
        </div>
      </div>

      <div className="bg-paper-sunken rounded-control p-4 mb-5 border border-border-subtle">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="border-r border-border-subtle pr-3">
            <p className="text-caption text-ink-tertiary">LECTURA ANTERIOR</p>
            <p className="text-data-xl font-mono tabular-nums">{lecturaAnterior.toLocaleString()} m³</p>
          </div>
          <div className="border-r border-border-subtle px-3">
            <p className="text-caption text-ink-tertiary">LECTURA ACTUAL</p>
            <p className="text-data-xl font-mono tabular-nums">{lecturaActual.toLocaleString()} m³</p>
          </div>
          <div className="pl-3">
            <p className="text-caption text-ink-tertiary">CONSUMO</p>
            <p className="text-data-2xl font-mono tabular-nums text-pvc-blue">{consumo} m³</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pt-4 border-t border-border-subtle">
        <div className="flex items-baseline gap-3">
          <span className="text-heading">TOTAL A PAGAR</span>
          <span className="text-data-2xl font-mono tabular-nums">S/ {monto.toFixed(2)}</span>
        </div>
        <button
          onClick={toggleEstado}
          className="btn-ghost px-3 py-2 text-sm self-start sm:self-center"
          aria-label={estado === 'pending' ? 'Marcar como pagado' : 'Marcar como pendiente'}
          aria-pressed={estado === 'paid'}
        >
          <span className="flex items-center gap-1.5">
            <span 
              className={`w-2.5 h-2.5 rounded-full ${
                estado === 'pending' ? 'bg-stamp-red' : 'bg-stamp-blue'
              }`}
              aria-hidden="true"
            />
            <span className={estado === 'pending' ? 'text-stamp-red' : 'text-stamp-blue'} font-medium>
              {estado === 'pending' ? 'PENDIENTE' : 'PAGADO'}
            </span>
          </span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleView}
          className="btn-secondary w-full sm:w-auto flex-1"
        >
          Ver mi recibo
        </button>
        <button
          onClick={handlePay}
          className={estado === 'pending' ? 'btn-primary w-full sm:w-auto flex-1' : 'btn-secondary w-full sm:w-auto flex-1'}
          disabled={estado === 'paid'}
        >
          {estado === 'pending' ? 'Pagar ahora' : 'Ya pagado'}
        </button>
      </div>

      {!mounted && (
        <div className="sr-only" aria-live="polite">
          Factura interactiva cargada. Estado actual: {estado === 'pending' ? 'pendiente' : 'pagado'}.
        </div>
      )}
    </div>
  );
}