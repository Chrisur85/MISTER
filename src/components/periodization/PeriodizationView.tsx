import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  Flame,
  Clock,
  Target,
  Trophy,
  Activity,
  Edit2,
  Trash2,
  CheckCircle2,
  BarChart3,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Macrocycle,
  Mesocycle,
  Microcycle,
  TrainingSession,
  MesocycleType,
  MicrocycleType
} from '../../types';
import { SessionDetailModal } from './SessionDetailModal';

export const PeriodizationView: React.FC = () => {
  const {
    macrocycles,
    mesocycles,
    microcycles,
    sessions,
    saveMacrocycle,
    deleteMacrocycle,
    saveMesocycle,
    deleteMesocycle,
    saveMicrocycle,
    deleteMicrocycle,
    getMicrocycleLoad,
    currentUser
  } = useApp();

  const [selectedMacroId, setSelectedMacroId] = useState<string>(
    macrocycles[0]?.id || ''
  );

  // Modals state
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<TrainingSession | null>(null);
  const [targetMicrocycleId, setTargetMicrocycleId] = useState<string>('');

  // New Cycle forms
  const [showNewMesoModal, setShowNewMesoModal] = useState(false);
  const [showNewMicroModal, setShowNewMicroModal] = useState(false);
  const [targetMesoIdForNewMicro, setTargetMesoIdForNewMicro] = useState('');

  // Form states
  const [newMesoName, setNewMesoName] = useState('');
  const [newMesoTipo, setNewMesoTipo] = useState<MesocycleType>('Básico / Acumulación');
  const [newMesoStart, setNewMesoStart] = useState('2026-10-01');
  const [newMesoEnd, setNewMesoEnd] = useState('2026-10-31');
  const [newMesoObjFisico, setNewMesoObjFisico] = useState('');
  const [newMesoObjTactico, setNewMesoObjTactico] = useState('');

  const [newMicroName, setNewMicroName] = useState('');
  const [newMicroTipo, setNewMicroTipo] = useState<MicrocycleType>('Competitivo');
  const [newMicroSemana, setNewMicroSemana] = useState(6);
  const [newMicroStart, setNewMicroStart] = useState('2026-09-07');
  const [newMicroEnd, setNewMicroEnd] = useState('2026-09-13');
  const [newMicroRival, setNewMicroRival] = useState('Rival Liga');
  const [newMicroObjCarga, setNewMicroObjCarga] = useState(2500);

  const activeMacro = macrocycles.find(m => m.id === selectedMacroId) || macrocycles[0];
  const activeMesos = mesocycles.filter(meso => meso.macrocicloId === activeMacro?.id);

  const handleCreateMeso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMesoName.trim() || !activeMacro) return;

    const newMeso: Mesocycle = {
      id: `meso-${Date.now()}`,
      macrocicloId: activeMacro.id,
      nombre: newMesoName.trim(),
      tipo: newMesoTipo,
      fechaInicio: newMesoStart,
      fechaFin: newMesoEnd,
      objetivoFisico: newMesoObjFisico.trim() || 'Fuerza funcional y resistencia intermitente',
      objetivoTactico: newMesoObjTactico.trim() || 'Automatización del bloque defensivo medio',
      dinamicaCarga: 'Ondulante',
      microciclosIds: []
    };

    saveMesocycle(newMeso);
    setShowNewMesoModal(false);
    setNewMesoName('');
  };

  const handleCreateMicro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMicroName.trim() || !targetMesoIdForNewMicro) return;

    const newMicro: Microcycle = {
      id: `micro-${Date.now()}`,
      mesocicloId: targetMesoIdForNewMicro,
      numeroSemana: Number(newMicroSemana),
      nombre: newMicroName.trim(),
      tipo: newMicroTipo,
      fechaInicio: newMicroStart,
      fechaFin: newMicroEnd,
      objetivoSemanal: 'Preparación y optimización competitiva para la jornada',
      diaPartido: 'Domingo',
      rival: newMicroRival.trim(),
      cargaObjetivoSRPE: Number(newMicroObjCarga),
      sesionesIds: []
    };

    saveMicrocycle(newMicro);
    setShowNewMicroModal(false);
    setNewMicroName('');
  };

  const handleOpenAddSession = (microId: string) => {
    setTargetMicrocycleId(microId);
    setSessionToEdit(null);
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (s: TrainingSession) => {
    setSessionToEdit(s);
    setTargetMicrocycleId(s.microcicloId);
    setIsSessionModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      
      {/* Top Banner: Macrociclo Activo */}
      {activeMacro && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 p-5 rounded-2xl border border-slate-750 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                  Macrociclo: {activeMacro.temporada}
                </span>
                <span className="text-xs text-slate-400">
                  Metodología: <strong className="text-slate-200">{activeMacro.metodologia}</strong>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                {activeMacro.nombre}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewMesoModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/40 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Mesociclo</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">OBJETIVO ESTRATÉGICO:</span>
              <p className="text-slate-300 leading-relaxed">{activeMacro.objetivoGeneral}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">MODELO DE JUEGO PRINCIPAL:</span>
              <p className="text-slate-300 leading-relaxed">{activeMacro.modeloJuego}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mesocycles & Microcycles Cascade */}
      <div className="space-y-6">
        {activeMesos.map((meso, mesoIndex) => {
          const mesoMicros = microcycles.filter(mic => mic.mesocicloId === meso.id);

          return (
            <div
              key={meso.id}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Mesocycle Header */}
              <div className="p-4 bg-slate-850 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                      Mesociclo {mesoIndex + 1}: {meso.tipo}
                    </span>
                    <span className="text-xs text-slate-400">
                      {meso.fechaInicio} al {meso.fechaFin}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white mt-1">{meso.nombre}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTargetMesoIdForNewMicro(meso.id);
                      setShowNewMicroModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Microciclo</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Eliminar este mesociclo y sus microciclos asociados?')) {
                        deleteMesocycle(meso.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mesocycle Goals */}
              <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <div>
                  <strong className="text-slate-300">Físico:</strong> {meso.objetivoFisico}
                </div>
                <div>
                  <strong className="text-slate-300">Táctico:</strong> {meso.objetivoTactico}
                </div>
                <div>
                  <strong className="text-slate-300">Dinámica:</strong> {meso.dinamicaCarga}
                </div>
              </div>

              {/* Microcycles Grid */}
              <div className="p-4 space-y-4">
                {mesoMicros.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    Sin microciclos semanales. Haz clic en "Añadir Microciclo" para estructurar la semana.
                  </p>
                ) : (
                  mesoMicros.map((micro) => {
                    const microSessions = sessions.filter(s => s.microcicloId === micro.id);
                    const { totalLoad } = getMicrocycleLoad(micro.id);
                    const percentOfTarget = micro.cargaObjetivoSRPE > 0
                      ? Math.min(Math.round((totalLoad / micro.cargaObjetivoSRPE) * 100), 120)
                      : 0;

                    return (
                      <div
                        key={micro.id}
                        className="bg-slate-850/60 border border-slate-750 rounded-xl p-4 space-y-3"
                      >
                        {/* Microcycle Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                                Sem {micro.numeroSemana} • Microciclo {micro.tipo}
                              </span>
                              {micro.rival && (
                                <span className="text-[11px] text-amber-400 font-semibold">
                                  vs {micro.rival} ({micro.diaPartido || 'MD'})
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400">
                                {micro.fechaInicio} - {micro.fechaFin}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-white mt-1">{micro.nombre}</h4>
                          </div>

                          {/* Load progress bar */}
                          <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block leading-none">CARGA SEMANAL</span>
                              <span className="text-xs font-bold text-amber-400">
                                {totalLoad} / {micro.cargaObjetivoSRPE} UA ({percentOfTarget}%)
                              </span>
                            </div>
                            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  percentOfTarget > 100 ? 'bg-rose-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(percentOfTarget, 100)}%` }}
                              />
                            </div>
                            <button
                              onClick={() => handleOpenAddSession(micro.id)}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Sesión</span>
                            </button>
                          </div>
                        </div>

                        {/* Sessions inside this microcycle */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
                          {microSessions.map((session) => (
                            <div
                              key={session.id}
                              onClick={() => handleEditSession(session)}
                              className="bg-slate-900/90 hover:bg-slate-800 border border-slate-750 hover:border-emerald-500/50 rounded-xl p-3 cursor-pointer transition-all space-y-2 group shadow"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                                  {session.diaRelativoPartido.split(' ')[0]}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {session.fecha.slice(5)} • {session.horaInicio}
                                </span>
                              </div>

                              <h5 className="font-semibold text-xs text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                                {session.titulo}
                              </h5>

                              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800 text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{session.duracionMinutos}m</span>
                                </div>
                                <div className="flex items-center gap-1 font-bold text-amber-400">
                                  <Flame className="w-3 h-3" />
                                  <span>{session.cargaFosterUA} UA</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Mesocycle */}
      {showNewMesoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-750 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Nuevo Mesociclo</h3>
              <button onClick={() => setShowNewMesoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMeso} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre del Mesociclo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mesociclo 3: Competitivo Choque"
                  value={newMesoName}
                  onChange={(e) => setNewMesoName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipo de Mesociclo</label>
                <select
                  value={newMesoTipo}
                  onChange={(e) => setNewMesoTipo(e.target.value as MesocycleType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Entrante / Adaptación">Entrante / Adaptación</option>
                  <option value="Básico / Acumulación">Básico / Acumulación</option>
                  <option value="Específico / Transformación">Específico / Transformación</option>
                  <option value="Competitivo / Realización">Competitivo / Realización</option>
                  <option value="Regenerativo / Transición">Regenerativo / Transición</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={newMesoStart}
                    onChange={(e) => setNewMesoStart(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={newMesoEnd}
                    onChange={(e) => setNewMesoEnd(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewMesoModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
                >
                  Crear Mesociclo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Microcycle */}
      {showNewMicroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-750 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Nuevo Microciclo Semanal</h3>
              <button onClick={() => setShowNewMicroModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMicro} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre del Microciclo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Microciclo 6: Competitivo Jornada 2"
                  value={newMicroName}
                  onChange={(e) => setNewMicroName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Tipo</label>
                  <select
                    value={newMicroTipo}
                    onChange={(e) => setNewMicroTipo(e.target.value as MicrocycleType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                  >
                    <option value="Ajuste">Ajuste</option>
                    <option value="Carga">Carga</option>
                    <option value="Impacto">Impacto</option>
                    <option value="Activación">Activación</option>
                    <option value="Competitivo">Competitivo</option>
                    <option value="Recuperación">Recuperación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Número de Semana</label>
                  <input
                    type="number"
                    min={1}
                    value={newMicroSemana}
                    onChange={(e) => setNewMicroSemana(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={newMicroStart}
                    onChange={(e) => setNewMicroStart(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={newMicroEnd}
                    onChange={(e) => setNewMicroEnd(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Rival / Partido</label>
                  <input
                    type="text"
                    placeholder="Atlético Madrid B"
                    value={newMicroRival}
                    onChange={(e) => setNewMicroRival(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Carga Objetivo (UA)</label>
                  <input
                    type="number"
                    value={newMicroObjCarga}
                    onChange={(e) => setNewMicroObjCarga(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewMicroModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
                >
                  Crear Microciclo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Modal */}
      <SessionDetailModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        sessionToEdit={sessionToEdit}
        defaultMicrocycleId={targetMicrocycleId}
      />

    </div>
  );
};
