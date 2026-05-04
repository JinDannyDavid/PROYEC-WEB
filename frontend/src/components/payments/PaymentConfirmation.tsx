// frontend/src/components/payments/PaymentConfirmation.tsx
import { FaArrowLeft } from 'react-icons/fa';

interface Factura {
  id: number;
  numero_factura: string;
  periodo: string;
  monto_total: number;
  fecha_vencimiento: string;
}

interface PaymentConfirmationProps {
  factura: Factura;
  metodoSeleccionado?: string;
  onSelectMetodo?: (metodo: string) => void;
  onConfirm?: () => void;
  onBack: () => void;
  procesando?: boolean;
}

const paymentMethods = [
  { 
    id: 'YAPE', 
    name: 'Yape', 
    icon: '📱', 
    description: 'Paga escaneando el código QR', 
    instructions: [
      '1. Abre Yape',
      '2. Escanea el código QR', 
      '3. Confirma el pago'
    ] 
  },
  { 
    id: 'PLIN', 
    name: 'Plin', 
    icon: '📱', 
    description: 'Paga con tu número de celular', 
    instructions: [
      '1. Abre Plin',
      '2. Selecciona "Pagar servicio"',
      '3. Busca "JASS Palian"',
      '4. Ingresa el monto',
      '5. Confirma'
    ] 
  },
  { 
    id: 'TRANSFERENCIA', 
    name: 'Transferencia', 
    icon: '🏦', 
    description: 'Transferencia bancaria', 
    instructions: [
      '1. Banco: BCP',
      '2. Cuenta: 123-4567890-01',
      '3. Beneficiario: JASS Palian',
      '4. Enviar voucher a WhatsApp'
    ] 
  },
  { 
    id: 'EFECTIVO', 
    name: 'Efectivo', 
    icon: '💵', 
    description: 'Paga en oficina JASS', 
    instructions: [
      '1. Dirección: Palian, Huancayo',
      '2. Horario: Lun-Vie 8am-4pm',
      '3. Llevar DNI y número de medidor'
    ] 
  },
];

// ✅ Función para obtener el método por ID
const getMetodoById = (id: string) => {
  return paymentMethods.find(m => m.id === id);
};

export default function PaymentConfirmation({
  factura,
  metodoSeleccionado,
  onSelectMetodo,
  onConfirm,
  onBack,
  procesando = false,
}: PaymentConfirmationProps) {
  // ✅ Obtener el método seleccionado (si existe)
  const metodo = metodoSeleccionado ? getMetodoById(metodoSeleccionado) : null;

  // Paso 1: Seleccionar método (sin método seleccionado)
  if (!metodoSeleccionado) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-4">Selecciona método de pago</h2>
          
          {/* Resumen de la factura */}
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Factura:</span>
              <span className="text-white font-medium">{factura.numero_factura}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Período:</span>
              <span className="text-white font-medium">{factura.periodo}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-white font-bold">Total:</span>
              <span className="text-2xl font-bold text-cyan-300">S/ {factura.monto_total.toFixed(2)}</span>
            </div>
          </div>

          {/* Lista de métodos de pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => onSelectMetodo?.(method.id)}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition text-left group"
              >
                <div className="text-3xl">{method.icon}</div>
                <div>
                  <p className="text-white font-semibold group-hover:text-cyan-300 transition">
                    {method.name}
                  </p>
                  <p className="text-white/60 text-sm">{method.description}</p>
                </div>
              </button>
            ))}
          </div>
          
          <button
            onClick={onBack}
            className="mt-6 flex items-center gap-2 text-white/70 hover:text-white transition"
          >
            <FaArrowLeft /> Volver a facturas
          </button>
        </div>
      </div>
    );
  }

  // Paso 2: Confirmar pago con instrucciones (método ya seleccionado)
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-4">Confirmar pago</h2>
        
        {/* Resumen */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-white/70">Factura:</span>
            <span className="text-white font-medium">{factura.numero_factura}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-white/70">Período:</span>
            <span className="text-white font-medium">{factura.periodo}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span className="text-white font-bold">Total a pagar:</span>
            <span className="text-2xl font-bold text-cyan-300">
              S/ {factura.monto_total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Instrucciones según método */}
        {metodo && (
          <div className="bg-cyan-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{metodo.icon}</div>
              <div>
                <p className="text-white font-semibold">Pagar con {metodo.name}</p>
                <p className="text-white/70 text-sm">{metodo.description}</p>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              {metodo.instructions.map((instruction, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-300 font-bold">{instruction.charAt(0)}</span>
                  <span className="text-white/80 text-sm">{instruction.substring(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
          >
            Atrás
          </button>
          <button
            onClick={onConfirm}
            disabled={procesando}
            className={`flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl transition ${
              procesando ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-600 hover:to-blue-600'
            }`}
          >
            {procesando ? 'Procesando...' : 'Confirmar Pago'}
          </button>
        </div>
      </div>
    </div>
  );
}