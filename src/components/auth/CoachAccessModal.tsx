import React, { useState } from 'react';
import {
  X,
  Users,
  UserPlus,
  Mail,
  Shield,
  Check,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachRole, UserCoach } from '../../types';

interface CoachAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoachAccessModal: React.FC<CoachAccessModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, coaches, switchCoach, inviteCoach, toggleCoachStatus } = useApp();

  const [activeTab, setActiveTab] = useState<'switch' | 'invite' | 'permissions'>('switch');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<CoachRole>('Segundo Entrenador');
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);

    if (!newEmail.includes('@') || !newName.trim()) {
      setInviteError('Introduce un nombre y un correo electrónico válido');
      return;
    }

    const success = inviteCoach(newEmail.trim(), newName.trim(), newRole);
    if (success) {
      setInviteSuccess(`Invitación enviada y acceso concedido a ${newEmail}`);
      setNewEmail('');
      setNewName('');
      setTimeout(() => {
        setInviteSuccess(null);
        setActiveTab('switch');
      }, 2000);
    } else {
      setInviteError('Ya existe un entrenador registrado con este correo electrónico');
    }
  };

  const rolesList: { role: CoachRole; desc: string; badgeColor: string }[] = [
    {
      role: 'Primer Entrenador',
      desc: 'Acceso total: creación y modificación de macrociclos, aprobación de sesiones y administración de accesos.',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      role: 'Segundo Entrenador',
      desc: 'Planificación de sesiones de entrenamiento, diseño de microciclos y gestión de la biblioteca de tareas.',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      role: 'Preparador Físico',
      desc: 'Supervisión de cargas de entrenamiento (sRPE Foster), dinamización física de microciclos y prevención.',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      role: 'Entrenador de Porteros',
      desc: 'Planificación de tareas específicas de porteros y asistencia en sesiones conjuntas.',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      role: 'Analista Táctico',
      desc: 'Anotaciones tácticas, análisis de rivales e informes de modelo de juego.',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Cuerpo Técnico & Control de Acceso</h3>
              <p className="text-xs text-slate-400">Acceso restringido por correo electrónico y roles del club</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-5 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('switch')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'switch'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Entrenadores Activos ({coaches.length})
          </button>
          <button
            onClick={() => setActiveTab('invite')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'invite'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invitar por Email</span>
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'permissions'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Matriz de Roles
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB: SWITCH / LIST */}
          {activeTab === 'switch' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Selecciona tu perfil de entrenador para operar:</span>
                <span className="text-emerald-400 font-medium">Sesión activa: {currentUser.nombre}</span>
              </div>

              <div className="space-y-2">
                {coaches.map((coach) => {
                  const isCurrent = coach.id === currentUser.id;
                  return (
                    <div
                      key={coach.id}
                      onClick={() => {
                        switchCoach(coach.id);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-950/30'
                          : 'bg-slate-800/40 border-slate-750 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={coach.avatar}
                            alt={coach.nombre}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          {isCurrent && (
                            <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 text-slate-950 rounded-full">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">{coach.nombre}</span>
                            {coach.esAdmin && (
                              <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="text-emerald-400 font-medium">{coach.rol}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-slate-300">{coach.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCurrent ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40">
                            En Uso
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-colors"
                          >
                            Entrar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>El acceso al calendario compartido se registra por cada correo.</span>
                <button
                  onClick={() => setActiveTab('invite')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Nuevo Entrenador</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: INVITE */}
          {activeTab === 'invite' && (
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
                Introduce el correo electrónico corporativo del nuevo entrenador o preparador para enviarle acceso seguro al calendario compartido y a la biblioteca de tareas del equipo.
              </div>

              {inviteSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{inviteSuccess}</span>
                </div>
              )}

              {inviteError && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-300 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Javier Domínguez"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo Electrónico de Acceso
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="javier.entrenador@fcunion.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Rol Técnico en el Equipo
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as CoachRole)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="Primer Entrenador">Primer Entrenador (Head Coach)</option>
                  <option value="Segundo Entrenador">Segundo Entrenador (Assistant Coach)</option>
                  <option value="Preparador Físico">Preparador Físico (S&C Coach)</option>
                  <option value="Entrenador de Porteros">Entrenador de Porteros (GK Coach)</option>
                  <option value="Analista Táctico">Analista Táctico (Tactical Scout)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-950/40"
                >
                  <Mail className="w-4 h-4" />
                  <span>Conceder Acceso y Crear Entrenador</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB: PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Permisos y responsabilidades configuradas para cada perfil técnico del club:
              </p>
              <div className="space-y-2.5">
                {rolesList.map((item) => (
                  <div key={item.role} className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-750">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-white">{item.role}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.role === 'Primer Entrenador' ? 'Acceso Completo' : 'Acceso Específico'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/70 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Acceso seguro cifrado por email</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Listo
          </button>
        </div>

      </div>
    </div>
  );
};
