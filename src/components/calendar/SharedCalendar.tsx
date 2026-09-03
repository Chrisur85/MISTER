import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Flame,
  Filter,
  User,
  MapPin,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrainingSession } from '../../types';
import { SessionDetailModal } from '../periodization/SessionDetailModal';

type CalendarViewMode = 'month' | 'week' | 'agenda';

export const SharedCalendar: React.FC = () => {
  const { sessions, coaches, currentUser, setSelectedDate } = useApp();

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 = Septiembre (0-indexed)
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [selectedCoachFilter, setSelectedCoachFilter] = useState<string>('all');

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<TrainingSession | null>(null);
  const [targetDateForNew, setTargetDateForNew] = useState<string>('2026-09-03');

  // Month names
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // Filter sessions by coach email
  const filteredSessions = sessions.filter((s) => {
    if (selectedCoachFilter === 'all') return true;
    return s.creadorEmail === selectedCoachFilter;
  });

  // Calculate days for the calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const getSessionsForDate = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
    return filteredSessions.filter(s => s.fecha === dateKey);
  };

  const handleDayClick = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
    setTargetDateForNew(dateKey);
    setSelectedDate(dateKey);
  };

  const handleOpenNewSession = (dateStr?: string) => {
    setSessionToEdit(null);
    setTargetDateForNew(dateStr || `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-03`);
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (session: TrainingSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionToEdit(session);
    setIsSessionModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      
      {/* Calendar Header */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        
        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Calendario compartido del cuerpo técnico ({filteredSessions.length} sesiones sincronizadas)
            </p>
          </div>
        </div>

        {/* Controls: Filter by Coach & View Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Coach Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCoachFilter}
              onChange={(e) => setSelectedCoachFilter(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">Todos los Entrenadores</option>
              {coaches.map(c => (
                <option key={c.id} value={c.email} className="bg-slate-900 text-white">
                  {c.nombre} ({c.rol})
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'month' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'agenda' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Agenda
            </button>
          </div>

          {/* Add Session Button */}
          <button
            onClick={() => handleOpenNewSession()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>+ Sesión</span>
          </button>
        </div>

      </div>

      {/* VIEW: MONTH GRID */}
      {viewMode === 'month' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-850/80 text-center py-2.5 text-xs font-bold text-slate-400">
            <div>LUN</div>
            <div>MAR</div>
            <div>MIÉ</div>
            <div>JUE</div>
            <div>VIE</div>
            <div className="text-amber-400">SÁB</div>
            <div className="text-rose-400">DOM</div>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr gap-px bg-slate-800">
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="min-h-[95px] sm:min-h-[120px] bg-slate-900/40 p-2" />;
              }

              const daySessions = getSessionsForDate(day);
              const isToday = day === 3 && currentMonth === 8 && currentYear === 2026;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[95px] sm:min-h-[125px] bg-slate-900 p-1.5 sm:p-2 transition-colors hover:bg-slate-850 cursor-pointer flex flex-col justify-between group ${
                    isToday ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-950/15' : ''
                  }`}
                >
                  {/* Day number & quick add */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {day}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNewSession(dateStr);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-emerald-400 transition-opacity"
                      title="Añadir sesión este día"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Sessions on this day */}
                  <div className="space-y-1 my-1 overflow-y-auto max-h-[85px] scrollbar-none">
                    {daySessions.map((session) => {
                      const isHighLoad = session.rpeEstimado >= 8;
                      return (
                        <div
                          key={session.id}
                          onClick={(e) => handleEditSession(session, e)}
                          className={`px-1.5 py-1 rounded-lg text-[10px] font-medium transition-all shadow-sm truncate border flex flex-col gap-0.5 ${
                            isHighLoad
                              ? 'bg-amber-950/70 border-amber-500/40 text-amber-200 hover:bg-amber-900/60'
                              : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                          }`}
                          title={`${session.titulo} (${session.duracionMinutos}m, RPE ${session.rpeEstimado})`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-400 truncate">
                              {session.diaRelativoPartido.split(' ')[0]}
                            </span>
                            <span className="text-[9px] text-amber-400 font-bold">
                              {session.cargaFosterUA} UA
                            </span>
                          </div>
                          <span className="truncate text-slate-300 font-normal">
                            {session.titulo}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Day total load summary */}
                  {daySessions.length > 0 && (
                    <div className="text-[9px] text-slate-400 flex items-center justify-between pt-0.5 border-t border-slate-800">
                      <span>{daySessions.length} ses.</span>
                      <span className="text-amber-400 font-semibold">
                        {daySessions.reduce((sum, s) => sum + s.cargaFosterUA, 0)} UA
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: AGENDA / MOBILE TIMELINE */}
      {viewMode === 'agenda' && (
        <div className="space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No hay sesiones programadas con el filtro seleccionado.
            </div>
          ) : (
            filteredSessions
              .sort((a, b) => a.fecha.localeCompare(b.fecha))
              .map((session) => {
                const coach = coaches.find(c => c.email === session.creadorEmail);
                return (
                  <div
                    key={session.id}
                    onClick={(e) => handleEditSession(session, e)}
                    className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all cursor-pointer shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Date Badge */}
                      <div className="w-14 text-center p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                        <span className="text-[10px] text-slate-400 uppercase block leading-none">
                          {new Date(session.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' })}
                        </span>
                        <span className="text-lg font-black text-white block mt-0.5 leading-tight">
                          {session.fecha.split('-')[2]}
                        </span>
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                            {session.diaRelativoPartido}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{session.horaInicio} ({session.duracionMinutos} min)</span>
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-white mt-1 group-hover:text-emerald-300 transition-colors">
                          {session.titulo}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{session.lugar}</span>
                          </span>
                          <span>•</span>
                          <span>{session.ejercicios.length} ejercicios planificados</span>
                          <span>•</span>
                          <span className="text-slate-300">Por: {coach?.nombre || session.responsableNombre}</span>
                        </div>
                      </div>
                    </div>

                    {/* Foster Load & Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-500/30 rounded-xl text-amber-300 font-bold text-xs">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{session.cargaFosterUA} UA (RPE {session.rpeEstimado})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 capitalize font-medium">
                        Estado: {session.estado}
                      </span>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* Session Modal */}
      <SessionDetailModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        sessionToEdit={sessionToEdit}
        defaultDate={targetDateForNew}
      />

    </div>
  );
};
