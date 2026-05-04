// frontend/src/components/payments/PaymentSteps.tsx
import { FaCheckCircle, FaCreditCard, FaFileInvoice } from 'react-icons/fa';

interface PaymentStepsProps {
  currentStep: number;
}

const steps = [
  { id: 0, name: 'Seleccionar', icon: FaFileInvoice },
  { id: 1, name: 'Confirmar', icon: FaCreditCard },
  { id: 2, name: 'Comprobante', icon: FaCheckCircle },
];

export default function PaymentSteps({ currentStep }: PaymentStepsProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep >= step.id
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 text-white/50'
              }`}
            >
              {currentStep > step.id ? (
                <FaCheckCircle className="text-white" />
              ) : (
                <step.icon className="text-lg" />
              )}
            </div>
            <span
              className={`text-xs mt-2 text-center ${
                currentStep >= step.id ? 'text-white' : 'text-white/50'
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-white/20" />
        <div
          className="absolute top-0 left-0 h-0.5 bg-green-500 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}