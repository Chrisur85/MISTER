import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Flame,
  Clock,
  Users,
  Maximize2,
  Trash2,
  Edit2,
  Eye,
  SlidersHorizontal,
  FolderOpen,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Exercise, ExerciseCategory, GamePhase } from '../../types';
import { ExerciseEditorModal } from './ExerciseEditorModal';

export const ExerciseLibrary: React.FC = () => {
  const { exercises, deleteExercise, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [minRpe, setMinRpe] = useState<number>(0);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null);
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  const categories: ExerciseCategory[] = [
    'Rondos',
    'Posesiones y Mantenimientos',
    'Juegos de Posición',
    'Ataque - Defensa (Oleadas)',
    'Partidos Reducidos (SSG)',
    'Acciones a Balón Parado (ABP)',
    'Físico - Técnico Integrado',
    'Finalizaciones',
    'Calentamiento y Prevención'
  ];

  // Filtering
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.etiquetas.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || ex.categoria === selectedCategory;
    const matchesPhase = selectedPhase === 'all' || ex.faseJuego === selectedPhase;
    const matchesRpe = ex.rpeEstimado >= minRpe;

    return matchesSearch && matchesCat && matchesPhase && matchesRpe;
  });

  const handleOpenNew = () => {
    setExerciseToEdit(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (ex: Exercise) => {
    setExerciseToEdit(ex);
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Deseas eliminar este ejercicio de la biblioteca?')) {
      deleteExercise(id);
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Biblioteca de Tareas</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {filteredExercises.length} ejercicios
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Banco de tareas tácticas con croquis, parámetros de carga y consignas técnicas
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Search & Category Chips */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por título, consigna táctica o etiquetas (ej. Rondo, Salida de balón, RPE 8)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-slate-500"
          />
        </div>

        {/* Scrollable Category Chips */}
        <div className="overflow-x-auto flex items-center gap-1.5 pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            Todas las Tareas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Exercises */}
      {filteredExercises.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h4 className="text-white font-semibold text-base">No se encontraron tareas</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Prueba a modificar los filtros o crea un nuevo ejercicio con la pizarra táctica integrada.
          </p>
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Primer Ejercicio</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => {
            return (
              <div
                key={exercise.id}
                onClick={() => setPreviewExercise(exercise)}
                className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all group cursor-pointer flex flex-col"
              >
                {/* Tactical Croquis Thumbnail */}
                <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
                  {exercise.croquisUrl ? (
                    <img
                      src={exercise.croquisUrl}
                      alt={exercise.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-slate-600 flex flex-col items-center gap-1">
                      <Maximize2 className="w-8 h-8 opacity-40" />
                      <span className="text-[11px]">Sin croquis gráfico</span>
                    </div>
                  )}

                  {/* Badges on top of image */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold backdrop-blur-sm">
                      {exercise.categoria}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-amber-950/90 text-amber-400 border border-amber-500/40 text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>RPE {exercise.rpeEstimado}</span>
                    </span>
                  </div>

                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewExercise(exercise);
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors shadow"
                      title="Ver detalle de consignas"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(exercise);
                      }}
                      className="p-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow"
                      title="Editar ejercicio y croquis"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(exercise.id, e)}
                      className="p-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors shadow"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {exercise.titulo}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {exercise.descripcion || 'Sin descripción añadida.'}
                    </p>
                  </div>

                  {/* Key Stats Bar */}
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exercise.duracionSugeridaMin} min</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exercise.numAtacantes}v{exercise.numDefensores}{exercise.numComodines > 0 ? `+${exercise.numComodines}` : ''}</span>
                    </div>

                    <div className="flex items-center gap-1 truncate" title={exercise.espacio}>
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{exercise.espacio}</span>
                    </div>
                  </div>

                  {/* Foster load calculation badge */}
                  <div className="flex items-center justify-between text-[11px] bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Carga Foster:</span>
                    <span className="font-bold text-amber-400">
                      {exercise.duracionSugeridaMin * exercise.rpeEstimado} UA
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exercise Editor Modal */}
      <ExerciseEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        exerciseToEdit={exerciseToEdit}
      />

      {/* Exercise Preview Modal */}
      {previewExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-750 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    {previewExercise.categoria}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
                    {previewExercise.faseJuego}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-white mt-1">{previewExercise.titulo}</h3>
              </div>
              <button
                onClick={() => setPreviewExercise(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* Croquis Graphic */}
              {previewExercise.croquisUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
                  <img
                    src={previewExercise.croquisUrl}
                    alt={previewExercise.titulo}
                    className="max-h-72 w-auto object-contain rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Load & Dimensions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="block text-slate-400 text-[10px]">DURACIÓN</span>
                  <span className="font-bold text-sm text-white">{previewExercise.duracionSugeridaMin} min</span>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="block text-slate-400 text-[10px]">ESCALA BORG RPE</span>
                  <span className="font-bold text-sm text-amber-400">{previewExercise.rpeEstimado}/10</span>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="block text-slate-400 text-[10px]">ESPACIO</span>
                  <span className="font-bold text-sm text-white">{previewExercise.espacio}</span>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="block text-slate-400 text-[10px]">CARGA FOSTER</span>
                  <span className="font-bold text-sm text-emerald-400">
                    {previewExercise.duracionSugeridaMin * previewExercise.rpeEstimado} UA
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Descripción</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-850 p-3 rounded-xl border border-slate-800">
                  {previewExercise.descripcion || 'Sin descripción.'}
                </p>
              </div>

              {/* Rules of provocation */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Reglas de Provocación
                </h4>
                <ul className="space-y-1.5 bg-slate-850 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                  {previewExercise.reglasProvocacion.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tactical Goals */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Objetivos Tácticos Principales
                </h4>
                <ul className="space-y-1.5 bg-slate-850 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                  {previewExercise.objetivosPrincipales.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">✓</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer info */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Autor: {previewExercise.autorEmail}</span>
                <span>Fecha: {previewExercise.creadoEn}</span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const toEdit = previewExercise;
                  setPreviewExercise(null);
                  handleEdit(toEdit);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar Tarea</span>
              </button>
              <button
                onClick={() => setPreviewExercise(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
