// frontend/src/components/profile/ProfileStats.tsx
import { FaCalendarAlt, FaClipboardList, FaMoneyBillWave, FaUserPlus } from 'react-icons/fa';

interface Usuario {
  id: number;
  fecha_registro: string;
}

interface ProfileStatsProps {
  usuario: Usuario;
}

export default function ProfileStats({ usuario }: ProfileStatsProps) {
  const fechaRegistro = new Date(usuario.fecha_registro).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <FaUserPlus className="text-cyan-400" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Miembro desde</p>
            <p className="text-white font-semibold">{fechaRegistro}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <FaMoneyBillWave className="text-green-400" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Total pagado</p>
            <p className="text-white font-semibold">S/ 0.00</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <FaClipboardList className="text-orange-400" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Reclamos</p>
            <p className="text-white font-semibold">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <FaCalendarAlt className="text-purple-400" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Último acceso</p>
            <p className="text-white font-semibold">Hoy</p>
          </div>
        </div>
      </div>
    </div>
  );
}