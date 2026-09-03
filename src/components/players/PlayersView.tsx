import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Plus,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Shirt
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Player, PlayerPosition } from '../../types';

const POSITIONS: PlayerPosition[] = [
  'Portero',
  'Defensa Central',
  'Lateral Derecho',
  'Lateral Izquierdo',
  'Mediocentro Defensivo',
  'Interior',
  'Mediapunta',
  'Extremo Derecho',
  'Extremo Izquierdo',
  'Delantero Centro'
];

export const PlayersView: React.FC = () => {
  const {
    players,
    categories,
    savePlayer,
    deletePlayer,
    importPlayersList,
    addCategory
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Primer Equipo');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isNewPlayerModalOpen, setIsNewPlayerModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  // Form states for individual player
  const [nombre, setNombre] = useState('');
  const [dorsal, setDorsal] = useState<number>(1);
  const [posicion, setPosicion] = useState<PlayerPosition>('Interior');
  const [estado, setEstado] = useState<Player['estado']>('Disponible');
  const [playerCategory, setPlayerCategory] = useState('Primer Equipo');

  // Bulk import state
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('Primer Equipo');
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // Filter players
  const filteredPlayers = players.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoria === selectedCategory;
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.dorsal.toString().includes(searchTerm) ||
                          p.posicion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenNew = () => {
    setPlayerToEdit(null);
    setNombre('');
    setDorsal(players.filter(p => p.categoria === selectedCategory).length + 1);
    setPosicion('Interior');
    setEstado('Disponible');
    setPlayerCategory(selectedCategory === 'all' ? 'Primer Equipo' : selectedCategory);
    setIsNewPlayerModalOpen(true);
  };

  const handleEdit = (p: Player) => {
    setPlayerToEdit(p);
    setNombre(p.nombre);
    setDorsal(p.dorsal);
    setPosicion(p.posicion);
    setEstado(p.estado);
    setPlayerCategory(p.categoria);
    setIsNewPlayerModalOpen(true);
  };

  const handleSavePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const newPlayer: Player = {
      id: playerToEdit?.id || `p-${Date.now()}`,
      nombre: nombre.trim(),
      dorsal: Number(dorsal),
      posicion,
      categoria: playerCategory,
      estado
    };

    savePlayer(newPlayer);
    setIsNewPlayerModalOpen(false);
  };

  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const count = importPlayersList(bulkCategory, bulkText);
    setImportNotification(`¡Se han cargado ${count} jugadores con éxito a ${bulkCategory}!`);
    setBulkText('');
    setTimeout(() => {
      setImportNotification(null);
      setIsBulkImportOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Plantillas por Categoría</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              AB FÚTBOL • {players.length} jugadores
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Listas de jugadores por división para el control y registro de asistencia en sesiones
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBulkImportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            title="Importar varios jugadores de golpe copiando y pegando"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Cargar Lista Rápida</span>
          </button>

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Jugador</span>
          </button>
        </div>
      </div>

      {/* Category Chips & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre, dorsal o demarcación táctica..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="overflow-x-auto flex items-center gap-1.5 pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Todas ({players.length})
          </button>
          {categories.map((cat) => {
            const count = players.filter(p => p.categoria === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Players Grid */}
      {filteredPlayers.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-white font-bold text-base">No hay jugadores registrados en esta categoría</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Puedes cargar la plantilla completa rápidamente o añadir jugadores uno a uno.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setBulkCategory(selectedCategory === 'all' ? 'Primer Equipo' : selectedCategory);
                setIsBulkImportOpen(true);
              }}
              className="px-4 py-2 bg-slate-800 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold"
            >
              Cargar Lista en Lote
            </button>
            <button
              onClick={handleOpenNew}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Añadir Primer Jugador
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredPlayers.map((player) => {
            const isKeeper = player.posicion === 'Portero';
            return (
              <div
                key={player.id}
                className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between transition-all shadow group"
              >
                <div className="flex items-center gap-3">
                  {/* Dorsal Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow ${
                      isKeeper
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {player.dorsal}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors">
                        {player.nombre}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-emerald-400 font-medium">{player.posicion}</span>
                      <span>•</span>
                      <span>{player.categoria}</span>
                    </div>

                    {/* Status pill */}
                    <div className="mt-1">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                          player.estado === 'Disponible'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : player.estado === 'Lesionado'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {player.estado}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(player)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Editar jugador"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar a ${player.nombre} de la plantilla?`)) {
                        deletePlayer(player.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: New / Edit Player */}
      {isNewPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-750 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                {playerToEdit ? 'Editar Jugador' : 'Nuevo Jugador'}
              </h3>
              <button onClick={() => setIsNewPlayerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlayerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marc Ibañez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dorsal</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={dorsal}
                    onChange={(e) => setDorsal(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoría</label>
                  <select
                    value={playerCategory}
                    onChange={(e) => setPlayerCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Demarcación Táctica</label>
                <select
                  value={posicion}
                  onChange={(e) => setPosicion(e.target.value as PlayerPosition)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estado Físico</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as Player['estado'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Disponible">🟢 Disponible</option>
                  <option value="Lesionado">🔴 Lesionado</option>
                  <option value="Duda">🟡 Duda / Molestias</option>
                  <option value="Sancionado">⚪ Sancionado</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPlayerModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk Import List of Players */}
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-750 w-full max-w-lg rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Cargar Lista de Jugadores</h3>
              </div>
              <button onClick={() => setIsBulkImportOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {importNotification && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{importNotification}</span>
              </div>
            )}

            <form onSubmit={handleBulkImport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Categoría de Destino
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Pega la lista de jugadores (uno por línea)
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder={`Ejemplo:&#10;1 - Marc Ibañez - Portero&#10;4 - Gerard Navarro - Central&#10;8 - Pablo Gavi - Interior&#10;9 - Robert Navarro - Delantero`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Puedes pegar listas desde Excel, Word o WhatsApp con o sin número de dorsal.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkImportOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-950/40"
                >
                  Cargar Plantilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
