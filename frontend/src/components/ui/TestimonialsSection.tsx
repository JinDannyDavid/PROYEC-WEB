import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'María López',
    role: 'Vecina de Palian',
    text: 'Excelente plataforma, ahora puedo pagar mi agua desde casa sin hacer colas.',
    rating: 5,
  },
  {
    name: 'Juan Pérez',
    role: 'Comerciante',
    text: 'Muy fácil de usar y los reportes de reclamos son atendidos rápidamente.',
    rating: 5,
  },
  {
    name: 'Carmen Rojas',
    role: 'Presidenta de la JASS',
    text: 'La digitalización ha mejorado significativamente nuestra gestión.',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Lo que dicen nuestros <span className="text-cyan-300">vecinos</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2">
              <FaQuoteLeft className="text-cyan-300 text-2xl mb-4 opacity-50" />
              <p className="text-white/80 mb-4 italic">"{testimonial.text}"</p>
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
              </div>
              <p className="text-white font-semibold">{testimonial.name}</p>
              <p className="text-white/60 text-sm">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;