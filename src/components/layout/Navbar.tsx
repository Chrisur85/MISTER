import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Layers,
  BookOpen,
  Users,
  Shield,
  Activity,
  HardDrive,
  Shirt,
  UserCheck,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OfflineStatusBadge } from '../common/OfflineStatusBadge';
import { BackupModal } from '../common/BackupModal';
import { CoachAccessModal } from '../auth/CoachAccessModal';
import { CoachProfileModal } from '../auth/CoachProfileModal';

export const Navbar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useApp();
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
                  <span className="font-extrabold text-xl tracking-tighter">AB</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg text-white tracking-tight">AB FÚTBOL</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Mister</span>
                  </div>
                  <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">Planificación & Asistencia</p>
                </div>
              </div>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1 ml-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Hoy / Campo</span>
                </button>

                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'calendar'
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Calendario</span>
                </button>

                <button
                  onClick={() => setActiveTab('periodization')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'periodization'
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Periodización</span>
                </button>

                <button
                  onClick={() => setActiveTab('players')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'players'
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Shirt className="w-4 h-4" />
                  <span>Plantillas</span>
                </button>

                <button
                  onClick={() => setActiveTab('exercises')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'exercises'
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Biblioteca Tareas</span>
                </button>

                <button
                  onClick={() => setActiveTab('staff')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'staff'
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Cuerpo Técnico</span>
                </button>
              </nav>
            </div>

            {/* Right Side: Offline Badge, Backup, Coach Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Offline Badge */}
              <OfflineStatusBadge onClick={() => setShowBackupModal(true)} />

              {/* Quick Backup Modal Button */}
              <button
                onClick={() => setShowBackupModal(true)}
                className="hidden sm:flex p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Gestión de copias y estado sin conexión"
              >
                <HardDrive className="w-4 h-4" />
              </button>

              {/* Coach Pill / Switcher & Profile Button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 rounded-xl transition-all text-left shadow-sm group"
                  title="Haz clic para editar tu perfil o cambiar tu foto"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.nombre}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/60 group-hover:ring-emerald-400"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 text-slate-950 rounded-full">
                      <Edit3 className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-white leading-tight">{currentUser.nombre}</span>
                      {currentUser.esAdmin && <Shield className="w-3 h-3 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-emerald-400 block leading-none">{currentUser.rol}</span>
                  </div>
                </button>

                <button
                  onClick={() => setShowCoachModal(true)}
                  className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                  title="Conmutar de entrenador o invitar miembros"
                >
                  <Users className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Modals */}
      <BackupModal isOpen={showBackupModal} onClose={() => setShowBackupModal(false)} />
      <CoachAccessModal isOpen={showCoachModal} onClose={() => setShowCoachModal(false)} />
      <CoachProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  );
};
