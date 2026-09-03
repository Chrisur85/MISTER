import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  CheckCircle2,
  Lock,
  Calendar as CalendarIcon,
  BookOpen,
  Activity,
  ArrowRightLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachAccessModal } from '../auth/CoachAccessModal';
import { CoachProfileModal } from '../auth/CoachProfileModal';
import { Camera, Edit3 } from 'lucide-react';

export const StaffView: React.FC = () => {
  const { coaches, currentUser, switchCoach, sessions, exercises } = useApp();
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      
      {/* Header */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Cuerpo Técnico & Accesos</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {coaches.length} técnicos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Acceso restringido por correo electrónico y colaboración en el calendario compartido
          </p>
        </div>

        <button
          onClick={() => setIsAccessModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invitar Entrenador por Email</span>
        </button>
      </div>

      {/* Active Coach Session Card */}
      <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.nombre}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{currentUser.nombre}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Sesión Actual
              </span>
              {currentUser.esAdmin && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Admin</span>
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="text-emerald-400 font-medium">{currentUser.rol}</span>
              <span>•</span>
              <span className="font-mono text-slate-300">{currentUser.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Editar Mi Foto & Perfil</span>
          </button>
          <button
            onClick={() => setIsAccessModalOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Cambiar Perfil</span>
          </button>
        </div>
      </div>

      {/* Coaches List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coaches.map((coach) => {
          const coachSessions = sessions.filter(s => s.creadorEmail === coach.email);
          const coachExercises = exercises.filter(e => e.autorEmail === coach.email);
          const isCurrent = coach.id === currentUser.id;

          return (
            <div
              key={coach.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between shadow-lg ${
                isCurrent
                  ? 'bg-slate-900 border-emerald-500/50 shadow-emerald-950/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={coach.avatar}
                      alt={coach.nombre}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-white">{coach.nombre}</h3>
                        {coach.esAdmin && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <span className="text-xs text-emerald-400 font-medium block">
                        {coach.rol}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      coach.activo
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {coach.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Email line */}
                <div className="mt-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{coach.email}</span>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="bg-slate-850 p-2 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px] block">SESIONES CREADAS</span>
                    <span className="font-bold text-white text-sm">{coachSessions.length}</span>
                  </div>
                  <div className="bg-slate-850 p-2 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px] block">TAREAS TÁCTICAS</span>
                    <span className="font-bold text-white text-sm">{coachExercises.length}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Último: {coach.ultimoAcceso || 'Hoy'}</span>
                {!isCurrent && (
                  <button
                    onClick={() => switchCoach(coach.id)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Operar como {coach.nombre.split(' ')[0]}
                  </button>
                )}
                {isCurrent && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>En uso</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CoachAccessModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
      />

      <CoachProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

    </div>
  );
};
