// frontend/src/components/profile/ProfileInfo.tsx
import { FaEnvelope, FaIdCard, FaMapMarkerAlt, FaPhone, FaUserCircle, FaWater } from 'react-icons/fa';

interface Usuario {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email?: string;
  direccion: string;
  sector: string;
  tipo_usuario: string;
  foto_url?: string;
}

interface ProfileInfoProps {
  usuario: Usuario;
}

export default function ProfileInfo({ usuario }: ProfileInfoProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white">Información Personal</h2>
        <p className="text-white/60 text-sm">Tus datos de contacto y dirección</p>
      </div>

      <div className="p-6">
        {/* Foto y nombre */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center">
            {usuario.foto_url ? (
              <img src={usuario.foto_url} alt="Perfil" className="w-full h-full rounded-full object-cover" />
            ) : (
              <FaUserCircle className="text-cyan-400 text-5xl" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{usuario.nombres} {usuario.apellidos}</h3>
            <p className="text-white/60">{usuario.tipo_usuario === 'VECINO' ? 'Vecino' : usuario.tipo_usuario}</p>
          </div>
        </div>

        {/* Datos personales */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaIdCard className="text-cyan-400 w-5" />
            <div>
              <p className="text-white/60 text-sm">DNI</p>
              <p className="text-white font-medium">{usuario.dni}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaPhone className="text-cyan-400 w-5" />
            <div>
              <p className="text-white/60 text-sm">Teléfono</p>
              <p className="text-white font-medium">{usuario.telefono}</p>
            </div>
          </div>

          {usuario.email && (
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-cyan-400 w-5" />
              <div>
                <p className="text-white/60 text-sm">Correo electrónico</p>
                <p className="text-white font-medium">{usuario.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-cyan-400 w-5" />
            <div>
              <p className="text-white/60 text-sm">Dirección</p>
              <p className="text-white font-medium">{usuario.direccion}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaWater className="text-cyan-400 w-5" />
            <div>
              <p className="text-white/60 text-sm">Sector</p>
              <p className="text-white font-medium">{usuario.sector}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}