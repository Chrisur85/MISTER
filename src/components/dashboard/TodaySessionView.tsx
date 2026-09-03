import React, { useState } from 'react';
import {
  Activity,
  Flame,
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Play,
  TrendingUp,
  Layers,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrainingSession, Exercise } from '../../types';
import { SessionDetailModal } from '../periodization/SessionDetailModal';

export const TodaySessionView: React.FC = () => {
  const {
    sessions,
    microcycles,
    exercises,
    setActiveTab,
    saveSession,
    currentUser
  } = useApp();

  // Find today's session (e.g., date 2026-09-03 or latest planned)
  const todayDateStr = '2026-09-03';
  const todaySession = sessions.find(s => s.fecha === todayDateStr) || sessions[0];
  const activeMicrocycle = microcycles.find(m => m.id === todaySession?.microcicloId);

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedDrillPreview, setSelectedDrillPreview] = useState<Exercise | null>(null);

  const handleToggleCompleted = () => {
    if (!todaySession) return;
    const newStatus = todaySession.estado === 'Completada' ? 'Planificada' : 'Completada';
    saveSession({ ...todaySession, estado: newStatus });
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 p-5 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hoy en el Campo • {todaySession?.fecha}</span>
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Mister: {currentUser.nombre} ({currentUser.rol})
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
            {todaySession ? todaySession.titulo : 'Planifica la Sesión de Hoy'}
          </h1>

          <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
            <span>{activeMicrocycle?.nombre || 'Microciclo Competitivo'}</span>
            <span>•</span>
            <strong className="text-emerald-400">{todaySession?.diaRelativoPartido}</strong>
          </p>
        </div>

        {/* Quick Session State Action */}
        {todaySession && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSessionModalOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              Editar Sesión
            </button>
            <button
              onClick={handleToggleCompleted}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                todaySession.estado === 'Completada'
                  ? 'bg-emerald-600 text-white shadow-emerald-950/40'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{todaySession.estado === 'Completada' ? 'Sesión Completada' : 'Finalizar Sesión'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Today's Key Metrics */}
      {todaySession && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>DURACIÓN</span>
            </div>
            <div className="text-xl font-black text-white">
              {todaySession.duracionMinutos} <span className="text-xs font-normal text-slate-400">min</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Inicio: {todaySession.horaInicio}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>CARGA FOSTER</span>
            </div>
            <div className="text-xl font-black text-amber-400">
              {todaySession.cargaFosterUA} <span className="text-xs font-normal text-slate-400">UA</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">RPE Borg: {todaySession.rpeEstimado}/10</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span>CONVOCATORIA</span>
            </div>
            <div className="text-xl font-black text-white">
              {todaySession.asistenciaJugadores} <span className="text-xs font-normal text-slate-400">jugadores</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">{todaySession.lugar}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>FOCO TÁCTICO</span>
            </div>
            <div className="text-xs font-bold text-white line-clamp-1 mt-1">
              {todaySession.focoTactico || 'Modelo de Juego'}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{todaySession.focoFisico}</span>
          </div>
        </div>
      )}

      {/* Scheduled Drills for Today with Tactical Sketches */}
      {todaySession && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Tareas Programadas para la Sesión ({todaySession.ejercicios.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Pizarra gráfica y consignas listas para explicar al equipo en el terreno de juego
              </p>
            </div>

            <button
              onClick={() => setIsSessionModalOpen(true)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Gestionar tareas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todaySession.ejercicios.length === 0 ? (
            <div className="p-8 text-center bg-slate-850 rounded-xl border border-slate-800 text-xs text-slate-400">
              No se han asignado ejercicios a la sesión de hoy. Haz clic en "Gestionar tareas" para añadirlos desde la biblioteca.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaySession.ejercicios.map((item, idx) => {
                const ex = exercises.find(e => e.id === item.ejercicioId);
                if (!ex) return null;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDrillPreview(ex)}
                    className="bg-slate-850 border border-slate-750 hover:border-emerald-500/50 rounded-xl overflow-hidden shadow cursor-pointer transition-all group flex flex-col"
                  >
                    {/* Drill Croquis */}
                    <div className="relative h-40 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
                      {ex.croquisUrl ? (
                        <img
                          src={ex.croquisUrl}
                          alt={ex.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="text-slate-600 text-xs">Sin croquis</div>
                      )}

                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-slate-900/90 text-emerald-400 text-[10px] font-bold rounded">
                          #{idx + 1} {item.fase}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 bg-slate-900/90 text-amber-400 text-[10px] font-bold rounded">
                          {item.duracionMinutos} min
                        </span>
                      </div>
                    </div>

                    {/* Drill Body */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {ex.titulo}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {ex.descripcion}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{ex.espacio}</span>
                        <span className="text-amber-400 font-bold">RPE {ex.rpeEstimado}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Drill Preview Fullscreen Modal */}
      {selectedDrillPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-bold">{selectedDrillPreview.categoria}</span>
                <h3 className="font-bold text-base text-white">{selectedDrillPreview.titulo}</h3>
              </div>
              <button
                onClick={() => setSelectedDrillPreview(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              {selectedDrillPreview.croquisUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
                  <img
                    src={selectedDrillPreview.croquisUrl}
                    alt=""
                    className="max-h-72 object-contain rounded-lg"
                  />
                </div>
              )}

              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reglas Clave</h5>
                <ul className="text-xs text-slate-300 space-y-1 bg-slate-850 p-3 rounded-xl">
                  {selectedDrillPreview.reglasProvocacion.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setSelectedDrillPreview(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Modal */}
      <SessionDetailModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        sessionToEdit={todaySession}
      />

    </div>
  );
};
