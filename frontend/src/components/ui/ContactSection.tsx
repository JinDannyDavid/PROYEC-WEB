import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

const ContactSection = () => {
  return (
    <section id="contacto" className="py-20 bg-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Contáctanos
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Información de contacto */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <FaMapMarkerAlt className="text-cyan-300 text-xl" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Dirección</h3>
                <p className="text-white/70">Palian, Huancayo - Perú</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <FaPhoneAlt className="text-cyan-300 text-xl" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Teléfono</h3>
                <p className="text-white/70">(064) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <FaEnvelope className="text-cyan-300 text-xl" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Email</h3>
                <p className="text-white/70">info@jasspalian.com</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <FaWhatsapp className="text-green-400 text-xl" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <FaFacebook className="text-blue-400 text-xl" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <FaInstagram className="text-pink-400 text-xl" />
              </a>
            </div>
          </div>

          {/* Mapa simplificado */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15618.5!2d-75.2345!3d-12.0469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x910eb9b5b9b5b9b5%3A0x5b5b5b5b5b5b5b5b!2sHuancayo!5e0!3m2!1ses!2spe!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;