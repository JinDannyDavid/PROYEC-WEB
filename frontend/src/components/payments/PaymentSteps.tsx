interface PaymentStepsProps {
  currentStep: number;
}

const steps = [
  { id: 0, name: 'Seleccionar' },
  { id: 1, name: 'Confirmar' },
  { id: 2, name: 'Comprobante' },
];

export default function PaymentSteps({ currentStep }: PaymentStepsProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all text-sm font-bold ${
                currentStep >= step.id
                  ? 'bg-canal-ok text-white'
                  : 'bg-paper-200 text-paper-400'
              }`}
            >
              {currentStep > step.id ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id + 1
              )}
            </div>
            <span className={`text-xs mt-2 text-center font-medium ${
              currentStep >= step.id ? 'text-paper-900' : 'text-paper-400'
            }`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-paper-200" />
        <div
          className="absolute top-0 left-0 h-0.5 bg-canal-ok transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}