import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  PenTool,
  Save,
  Image as ImageIcon,
  Flame,
  Clock,
  Users,
  Maximize2,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Exercise, ExerciseCategory, GamePhase } from '../../types';
import { TacticalBoardModal } from './TacticalBoardModal';

interface ExerciseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseToEdit?: Exercise | null;
}

const CATEGORIES: ExerciseCategory[] = [
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

const PHASES: GamePhase[] = [
  'Ataque Organizado',
  'Defensa Organizada',
  'Transición Ataque-Defensa',
  'Transición Defensa-Ataque',
  'Balón Parado (Ofensivo/Defensivo)'
];

export const ExerciseEditorModal: React.FC<ExerciseEditorModalProps> = ({
  isOpen,
  onClose,
  exerciseToEdit
}) => {
  const { currentUser, saveExercise } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [titulo, setTitulo] = useState(exerciseToEdit?.titulo || '');
  const [descripcion, setDescripcion] = useState(exerciseToEdit?.descripcion || '');
  const [categoria, setCategoria] = useState<ExerciseCategory>(exerciseToEdit?.categoria || 'Rondos');
  const [faseJuego, setFaseJuego] = useState<GamePhase>(exerciseToEdit?.faseJuego || 'Ataque Organizado');
  const [espacio, setEspacio] = useState(exerciseToEdit?.espacio || '30x30 m');
  
  const [numAtacantes, setNumAtacantes] = useState(exerciseToEdit?.numAtacantes ?? 4);
  const [numDefensores, setNumDefensores] = useState(exerciseToEdit?.numDefensores ?? 4);
  const [numComodines, setNumComodines] = useState(exerciseToEdit?.numComodines ?? 2);
  const [numPorteros, setNumPorteros] = useState(exerciseToEdit?.numPorteros ?? 0);

  const [duracionSugeridaMin, setDuracionSugeridaMin] = useState(exerciseToEdit?.duracionSugeridaMin ?? 20);
  const [rpeEstimado, setRpeEstimado] = useState(exerciseToEdit?.rpeEstimado ?? 7);

  const [reglasInput, setReglasInput] = useState(exerciseToEdit?.reglasProvocacion.join('\n') || '');
  const [objetivosInput, setObjetivosInput] = useState(exerciseToEdit?.objetivosPrincipales.join('\n') || '');
  const [croquisUrl, setCroquisUrl] = useState(exerciseToEdit?.croquisUrl || '');

  const [showTacticalBoard, setShowTacticalBoard] = useState(false);

  if (!isOpen) return null;

  // Handle local image file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setCroquisUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const reglas = reglasInput
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const objetivos = objetivosInput
      .split('\n')
      .map(o => o.trim())
      .filter(Boolean);

    const exercise: Exercise = {
      id: exerciseToEdit?.id || `ex-${Date.now()}`,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      categoria,
      faseJuego,
      espacio: espacio.trim() || 'Campo',
      numAtacantes: Number(numAtacantes),
      numDefensores: Number(numDefensores),
      numComodines: Number(numComodines),
      numPorteros: Number(numPorteros),
      duracionSugeridaMin: Number(duracionSugeridaMin),
      rpeEstimado: Number(rpeEstimado),
      reglasProvocacion: reglas.length > 0 ? reglas : ['Máximo 2 toques por jugador'],
      objetivosPrincipales: objetivos.length > 0 ? objetivos : ['Progresión en el juego'],
      croquisUrl: croquisUrl || '',
      autorEmail: exerciseToEdit?.autorEmail || currentUser.email,
      creadoEn: exerciseToEdit?.creadoEn || new Date().toISOString().split('T')[0],
      etiquetas: [categoria, `RPE ${rpeEstimado}`, espacio]
    };

    saveExercise(exercise);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
        <div className="bg-slate-900 border border-slate-750 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div>
              <h3 className="font-bold text-lg text-white">
                {exerciseToEdit ? 'Editar Tarea Táctica' : 'Nueva Tarea de Entrenamiento'}
              </h3>
              <p className="text-xs text-slate-400">
                Define estructura, asigna carga de entrenamiento y croquis táctico
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre de la Tarea / Ejercicio *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Rondo 4v4+3 con Orientación al Tercer Hombre"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>

            {/* Category & Phase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Categoría Metodológica *
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as ExerciseCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors text-xs sm:text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fase Principal del Juego
                </label>
                <select
                  value={faseJuego}
                  onChange={(e) => setFaseJuego(e.target.value as GamePhase)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors text-xs sm:text-sm"
                >
                  {PHASES.map((phase) => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Croquis Section: Upload or Draw */}
            <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Croquis o Imagen de la Tarea</span>
                </span>
                {croquisUrl && (
                  <button
                    type="button"
                    onClick={() => setCroquisUrl('')}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Quitar</span>
                  </button>
                )}
              </div>

              {croquisUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950 flex items-center justify-center p-2 group">
                  <img
                    src={croquisUrl}
                    alt="Croquis de la tarea"
                    className="max-h-48 rounded-lg object-contain"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTacticalBoard(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Editar en Pizarra</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Otra Imagen</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Button 1: Draw in Tactical Board */}
                  <button
                    type="button"
                    onClick={() => setShowTacticalBoard(true)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 hover:text-emerald-200 transition-all text-center group"
                  >
                    <PenTool className="w-6 h-6 mb-1.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs">Dibujar en Pizarra Táctica 2D</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Coloca jugadores, balón, flechas y conos</span>
                  </button>

                  {/* Button 2: Upload image */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-center group"
                  >
                    <Upload className="w-6 h-6 mb-1.5 text-slate-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs">Cargar Imagen / Foto de Croquis</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, capturas de pantalla</span>
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>

            {/* Load Parameters & Pitch Space */}
            <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750 space-y-3">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Carga de Entrenamiento & Dimensiones</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Duración (min)</label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={duracionSugeridaMin}
                      onChange={(e) => setDuracionSugeridaMin(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-2 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Carga RPE (1-10)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={rpeEstimado}
                      onChange={(e) => setRpeEstimado(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Espacio</label>
                  <input
                    type="text"
                    placeholder="30x30 m"
                    value={espacio}
                    onChange={(e) => setEspacio(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Carga Estimada (UA)</label>
                  <div className="bg-slate-800/80 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-amber-400 text-xs font-bold flex items-center justify-between">
                    <span>Foster:</span>
                    <span>{duracionSugeridaMin * rpeEstimado} UA</span>
                  </div>
                </div>
              </div>

              {/* Player numbers */}
              <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-800 text-[11px]">
                <div>
                  <label className="text-slate-400">Atacantes</label>
                  <input
                    type="number"
                    min={0}
                    value={numAtacantes}
                    onChange={(e) => setNumAtacantes(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Defensores</label>
                  <input
                    type="number"
                    min={0}
                    value={numDefensores}
                    onChange={(e) => setNumDefensores(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Comodines</label>
                  <input
                    type="number"
                    min={0}
                    value={numComodines}
                    onChange={(e) => setNumComodines(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Porteros</label>
                  <input
                    type="number"
                    min={0}
                    value={numPorteros}
                    onChange={(e) => setNumPorteros(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Description, Rules and Objectives */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descripción / Dinámica de la Tarea
              </label>
              <textarea
                rows={2}
                placeholder="Explica la secuencia de juego, rotaciones y consignas..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reglas de Provocación (una por línea)
                </label>
                <textarea
                  rows={2}
                  placeholder="Máximo 2 toques&#10;Gol tras recuperación en 6s"
                  value={reglasInput}
                  onChange={(e) => setReglasInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Objetivos Tácticos / Físicos (uno por línea)
                </label>
                <textarea
                  rows={2}
                  placeholder="Fijar y descargar&#10;Presión tras pérdida"
                  value={objetivosInput}
                  onChange={(e) => setObjetivosInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Ejercicio</span>
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Tactical Board Canvas Modal */}
      <TacticalBoardModal
        isOpen={showTacticalBoard}
        onClose={() => setShowTacticalBoard(false)}
        onSaveCroquis={(savedDataUrl) => setCroquisUrl(savedDataUrl)}
      />
    </>
  );
};
