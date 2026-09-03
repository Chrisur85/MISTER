import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Clock,
  Flame,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  CheckCircle2,
  Layers,
  ChevronRight,
  ClipboardCheck,
  Check,
  UserX,
  Bandage,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  TrainingSession,
  SessionExerciseItem,
  MatchDayRelative,
  SessionPhase,
  Exercise,
  AttendanceItem,
  AttendanceStatus
} from '../../types';

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionToEdit?: TrainingSession | null;
  defaultMicrocycleId?: string;
  defaultDate?: string;
}

const MATCH_DAYS: MatchDayRelative[] = [
  'MD+1 (Recuperación)',
  'MD+2 (Compensatorio)',
  'MD-4 (Tensión/Fuerza)',
  'MD-3 (Duración/Resistencia)',
  'MD-2 (Velocidad/Reactividad)',
  'MD-1 (Activación/ABP)',
  'MD (Día de Partido)',
  'Descanso'
];

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  isOpen,
  onClose,
  sessionToEdit,
  defaultMicrocycleId,
  defaultDate
}) => {
  const {
    currentUser,
    microcycles,
    exercises,
    players,
    categories,
    saveSession
  } = useApp();

  const [activeModalTab, setActiveModalTab] = useState<'details' | 'drills' | 'attendance'>('details');

  const [microcicloId, setMicrocicloId] = useState(
    sessionToEdit?.microcicloId || defaultMicrocycleId || microcycles[0]?.id || ''
  );
  const [categoriaEquipo, setCategoriaEquipo] = useState<string>(
    sessionToEdit?.categoriaEquipo || 'Primer Equipo'
  );
  const [fecha, setFecha] = useState(sessionToEdit?.fecha || defaultDate || '2026-09-03');
  const [horaInicio, setHoraInicio] = useState(sessionToEdit?.horaInicio || '10:00');
  const [duracionMinutos, setDuracionMinutos] = useState(sessionToEdit?.duracionMinutos ?? 90);
  const [diaRelativoPartido, setDiaRelativoPartido] = useState<MatchDayRelative>(
    sessionToEdit?.diaRelativoPartido || 'MD-3 (Duración/Resistencia)'
  );
  const [titulo, setTitulo] = useState(sessionToEdit?.titulo || '');
  const [objetivoPrincipal, setObjetivoPrincipal] = useState(sessionToEdit?.objetivoPrincipal || '');
  const [lugar, setLugar] = useState(sessionToEdit?.lugar || 'Campo 1 (Césped natural)');
  const [focoTactico, setFocoTactico] = useState(sessionToEdit?.focoTactico || '');
  const [focoFisico, setFocoFisico] = useState(sessionToEdit?.focoFisico || '');
  const [rpeEstimado, setRpeEstimado] = useState(sessionToEdit?.rpeEstimado ?? 7);
  const [estado, setEstado] = useState<TrainingSession['estado']>(sessionToEdit?.estado || 'Planificada');
  const [sessionExercises, setSessionExercises] = useState<SessionExerciseItem[]>(
    sessionToEdit?.ejercicios || []
  );

  // Attendance state
  const [attendance, setAttendance] = useState<AttendanceItem[]>(() => {
    if (sessionToEdit?.asistencia && sessionToEdit.asistencia.length > 0) {
      return sessionToEdit.asistencia;
    }
    // Generate initial attendance from players of the category
    const catPlayers = players.filter(p => p.categoria === (sessionToEdit?.categoriaEquipo || 'Primer Equipo'));
    return catPlayers.map(p => ({
      jugadorId: p.id,
      estado: p.estado === 'Lesionado' ? 'Lesionado' : 'Presente'
    }));
  });

  // When category changes, if attendance is empty or from other category, sync with players of new category
  useEffect(() => {
    const categoryPlayers = players.filter(p => p.categoria === categoriaEquipo);
    setAttendance(prev => {
      const existingMap = new Map(prev.map(a => [a.jugadorId, a]));
      return categoryPlayers.map(p => {
        const existing = existingMap.get(p.id);
        if (existing) return existing;
        return {
          jugadorId: p.id,
          estado: p.estado === 'Lesionado' ? 'Lesionado' : 'Presente'
        };
      });
    });
  }, [categoriaEquipo, players]);

  const [showAddExercisePicker, setShowAddExercisePicker] = useState(false);
  const [selectedPhaseForAdd, setSelectedPhaseForAdd] = useState<SessionPhase>('Parte Principal');

  if (!isOpen) return null;

  // Recalculate duration automatically if drills have durations
  const totalDrillsDuration = sessionExercises.reduce((sum, item) => sum + (item.duracionMinutos || 0), 0);

  // Attendance counts
  const presentCount = attendance.filter(a => a.estado === 'Presente').length;
  const absentCount = attendance.filter(a => a.estado === 'Ausente').length;
  const injuredCount = attendance.filter(a => a.estado === 'Lesionado').length;
  const permissionCount = attendance.filter(a => a.estado === 'Permiso').length;

  const handleSetPlayerStatus = (jugadorId: string, status: AttendanceStatus) => {
    setAttendance(prev => prev.map(item => item.jugadorId === jugadorId ? { ...item, estado: status } : item));
  };

  const handleMarkAllPresent = () => {
    setAttendance(prev => prev.map(item => ({ ...item, estado: 'Presente' })));
  };

  const handleAddExercise = (exercise: Exercise) => {
    const newItem: SessionExerciseItem = {
      id: `se-${Date.now()}`,
      ejercicioId: exercise.id,
      fase: selectedPhaseForAdd,
      orden: sessionExercises.length + 1,
      duracionMinutos: exercise.duracionSugeridaMin || 15,
      series: 2,
      repeticionesPorSerie: 1,
      pausaEntreSeriesSeg: 60,
      rpeEspecifico: exercise.rpeEstimado,
      notasEspecificas: ''
    };
    setSessionExercises(prev => [...prev, newItem]);
    setShowAddExercisePicker(false);
  };

  const handleRemoveExercise = (id: string) => {
    setSessionExercises(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateExerciseDuration = (id: string, newDuration: number) => {
    setSessionExercises(prev => prev.map(item => item.id === id ? { ...item, duracionMinutos: newDuration } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const newSession: TrainingSession = {
      id: sessionToEdit?.id || `sess-${Date.now()}`,
      microcicloId,
      categoriaEquipo,
      fecha,
      horaInicio,
      duracionMinutos: Number(duracionMinutos),
      diaRelativoPartido,
      titulo: titulo.trim(),
      objetivoPrincipal: objetivoPrincipal.trim() || 'Desarrollo de principios del modelo de juego',
      lugar: lugar.trim() || 'Campo Principal',
      focoTactico: focoTactico.trim() || 'Circulación y presión tras pérdida',
      focoFisico: focoFisico.trim() || 'Capacidad aeróbica específica',
      rpeEstimado: Number(rpeEstimado),
      cargaFosterUA: Number(duracionMinutos) * Number(rpeEstimado),
      creadorEmail: sessionToEdit?.creadorEmail || currentUser.email,
      responsableNombre: sessionToEdit?.responsableNombre || currentUser.nombre,
      ejercicios: sessionExercises,
      asistencia: attendance,
      asistenciaJugadores: presentCount,
      estado
    };

    saveSession(newSession);
    onClose();
  };

  // Group drills by phase
  const calentamientoItems = sessionExercises.filter(e => e.fase === 'Calentamiento');
  const principalItems = sessionExercises.filter(e => e.fase === 'Parte Principal');
  const vueltaItems = sessionExercises.filter(e => e.fase === 'Vuelta a la Calma');

  // Players in current session category
  const categoryPlayers = players.filter(p => p.categoria === categoriaEquipo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                {diaRelativoPartido.split(' ')[0]}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                {categoriaEquipo}
              </span>
              <span className="text-xs text-slate-400">
                AB FÚTBOL • Por: {sessionToEdit?.responsableNombre || currentUser.nombre}
              </span>
            </div>
            <h3 className="font-bold text-lg text-white mt-1">
              {sessionToEdit ? 'Editar Sesión de Entrenamiento' : 'Planificar Nueva Sesión'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div className="flex border-b border-slate-800 bg-slate-850 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveModalTab('details')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeModalTab === 'details'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Detalles & Carga
          </button>
          <button
            type="button"
            onClick={() => setActiveModalTab('drills')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeModalTab === 'drills'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Tareas Tácticas</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {sessionExercises.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModalTab('attendance')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeModalTab === 'attendance'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Lista de Asistencia</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              {presentCount}/{categoryPlayers.length}
            </span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
          
          {/* TAB 1: DETAILS & LOADS */}
          {activeModalTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título de la Sesión *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Día de Tensión: Duelos y Salida de Balón"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Categoría del Equipo *
                  </label>
                  <select
                    value={categoriaEquipo}
                    onChange={(e) => setCategoriaEquipo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs font-bold"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Día Relativo al Partido (MD) *
                  </label>
                  <select
                    value={diaRelativoPartido}
                    onChange={(e) => setDiaRelativoPartido(e.target.value as MatchDayRelative)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  >
                    {MATCH_DAYS.map(md => (
                      <option key={md} value={md}>{md}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Microciclo Asociado
                  </label>
                  <select
                    value={microcicloId}
                    onChange={(e) => setMicrocicloId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  >
                    {microcycles.map(mic => (
                      <option key={mic.id} value={mic.id}>{mic.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fecha del Entrenamiento *
                  </label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ubicación / Campo
                  </label>
                  <input
                    type="text"
                    placeholder="Campo 1, Gimnasio..."
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>

              {/* Load Parameters Card (Foster Method) */}
              <div className="p-4 bg-slate-850 rounded-xl border border-slate-750 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Control y Cuantificación de Carga (Foster sRPE)</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Fórmula: Duración (min) × Escala Borg RPE (1-10)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Duración Total (min)</label>
                    <input
                      type="number"
                      min={10}
                      max={180}
                      value={duracionMinutos}
                      onChange={(e) => setDuracionMinutos(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
                    />
                    {totalDrillsDuration > 0 && totalDrillsDuration !== duracionMinutos && (
                      <button
                        type="button"
                        onClick={() => setDuracionMinutos(totalDrillsDuration)}
                        className="text-[10px] text-emerald-400 hover:underline mt-0.5 block"
                      >
                        Ajustar a tareas ({totalDrillsDuration}m)
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">RPE Sesión (1-10)</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={rpeEstimado}
                      onChange={(e) => setRpeEstimado(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-amber-400 font-bold text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Jugadores Asistentes</label>
                    <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs flex items-center justify-between">
                      <span className="font-bold text-emerald-400">{presentCount}</span>
                      <span className="text-[10px] text-slate-400">de {categoryPlayers.length}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Carga Sesión (UA)</label>
                    <div className="bg-slate-900 border border-amber-500/40 rounded-lg px-3 py-1.5 text-amber-300 font-black text-xs flex items-center justify-between">
                      <span>Total:</span>
                      <span>{duracionMinutos * rpeEstimado} UA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Foco Táctico Principal
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Salida lavolpiana y vigilancia ofensiva"
                    value={focoTactico}
                    onChange={(e) => setFocoTactico(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Foco Físico / Condicional
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Fuerza excéntrica y aceleraciones cortas"
                    value={focoFisico}
                    onChange={(e) => setFocoFisico(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRILLS / TAREAS */}
          {activeModalTab === 'drills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Tareas de la Sesión</span>
                  <span className="text-[11px] text-slate-400">
                    {sessionExercises.length} tareas planificadas ({totalDrillsDuration} minutos asignados)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPhaseForAdd('Calentamiento');
                      setShowAddExercisePicker(true);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Calentamiento</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPhaseForAdd('Parte Principal');
                      setShowAddExercisePicker(true);
                    }}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-medium flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Principal</span>
                  </button>
                </div>
              </div>

              {/* Render Phases */}
              <div className="space-y-3 pt-1">
                {/* Calentamiento */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    1. Fase Inicial / Calentamiento ({calentamientoItems.length})
                  </span>
                  {calentamientoItems.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic pl-2">Sin ejercicios asignados</p>
                  ) : (
                    calentamientoItems.map((item) => {
                      const exercise = exercises.find(e => e.id === item.ejercicioId);
                      if (!exercise) return null;
                      return (
                        <div
                          key={item.id}
                          className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-750 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5">
                            {exercise.croquisUrl ? (
                              <img src={exercise.croquisUrl} alt="" className="w-10 h-8 rounded object-cover border border-slate-700" />
                            ) : (
                              <div className="w-10 h-8 bg-slate-900 rounded border border-slate-700" />
                            )}
                            <div>
                              <span className="font-semibold text-xs text-white block">{exercise.titulo}</span>
                              <span className="text-[10px] text-slate-400">{exercise.categoria} • {exercise.espacio}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              max={60}
                              value={item.duracionMinutos}
                              onChange={(e) => handleUpdateExerciseDuration(item.id, Number(e.target.value))}
                              className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-center text-white"
                            />
                            <span className="text-[11px] text-slate-400">min</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(item.id)}
                              className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Principal */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                    2. Parte Principal ({principalItems.length})
                  </span>
                  {principalItems.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic pl-2">Sin ejercicios asignados</p>
                  ) : (
                    principalItems.map((item) => {
                      const exercise = exercises.find(e => e.id === item.ejercicioId);
                      if (!exercise) return null;
                      return (
                        <div
                          key={item.id}
                          className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-750 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5">
                            {exercise.croquisUrl ? (
                              <img src={exercise.croquisUrl} alt="" className="w-10 h-8 rounded object-cover border border-slate-700" />
                            ) : (
                              <div className="w-10 h-8 bg-slate-900 rounded border border-slate-700" />
                            )}
                            <div>
                              <span className="font-semibold text-xs text-white block">{exercise.titulo}</span>
                              <span className="text-[10px] text-slate-400">{exercise.categoria} • RPE {exercise.rpeEstimado}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              max={60}
                              value={item.duracionMinutos}
                              onChange={(e) => handleUpdateExerciseDuration(item.id, Number(e.target.value))}
                              className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-center text-white font-bold"
                            />
                            <span className="text-[11px] text-slate-400">min</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(item.id)}
                              className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE SHEET */}
          {activeModalTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-850 p-3 rounded-xl border border-slate-750">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                    <span>Control de Asistencia: {categoriaEquipo}</span>
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="text-emerald-400 font-bold">{presentCount} Presentes</span>
                    <span>•</span>
                    <span className="text-rose-400 font-bold">{absentCount} Ausentes</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">{injuredCount} Lesionados</span>
                    {permissionCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-blue-400 font-bold">{permissionCount} Permiso</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Marcar Todos Presentes
                </button>
              </div>

              {/* Player list for attendance */}
              {categoryPlayers.length === 0 ? (
                <div className="p-8 text-center bg-slate-850 rounded-xl border border-slate-750 text-xs text-slate-400">
                  No hay jugadores dados de alta en la categoría {categoriaEquipo}. Puedes agregarlos desde la pestaña "Plantillas".
                </div>
              ) : (
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {categoryPlayers.map((player) => {
                    const record = attendance.find(a => a.jugadorId === player.id);
                    const currentStatus: AttendanceStatus = record ? record.estado : 'Presente';

                    return (
                      <div
                        key={player.id}
                        className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-750 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                            {player.dorsal}
                          </span>
                          <div>
                            <span className="font-semibold text-xs text-white block">{player.nombre}</span>
                            <span className="text-[10px] text-slate-400">{player.posicion}</span>
                          </div>
                        </div>

                        {/* Status buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleSetPlayerStatus(player.id, 'Presente')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              currentStatus === 'Presente'
                                ? 'bg-emerald-600 text-white shadow'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            Presente
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetPlayerStatus(player.id, 'Ausente')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              currentStatus === 'Ausente'
                                ? 'bg-rose-600 text-white shadow'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            Ausente
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetPlayerStatus(player.id, 'Lesionado')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              currentStatus === 'Lesionado'
                                ? 'bg-amber-600 text-white shadow'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            Lesión
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetPlayerStatus(player.id, 'Permiso')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              currentStatus === 'Permiso'
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            Permiso
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Exercise Picker Modal Overlay */}
          {showAddExercisePicker && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-4 shadow-2xl flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-bold text-sm text-white">
                    Añadir Tarea a {selectedPhaseForAdd}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddExercisePicker(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-y-auto p-2 space-y-2 flex-1">
                  {exercises.map((ex) => (
                    <div
                      key={ex.id}
                      onClick={() => handleAddExercise(ex)}
                      className="p-2.5 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-750 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {ex.croquisUrl ? (
                          <img src={ex.croquisUrl} alt="" className="w-12 h-9 rounded object-cover border border-slate-700" />
                        ) : (
                          <div className="w-12 h-9 bg-slate-900 rounded border border-slate-700" />
                        )}
                        <div>
                          <span className="font-semibold text-xs text-white block">{ex.titulo}</span>
                          <span className="text-[10px] text-slate-400">{ex.categoria} • RPE {ex.rpeEstimado}</span>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Estado:</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as TrainingSession['estado'])}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                <option value="Planificada">Planificada</option>
                <option value="En Curso">En Curso</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Sesión</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
