import React, { useRef, useState } from 'react';
import { Download, Upload, RefreshCw, X, ShieldCheck, HardDrive, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const {
    isOnline,
    exportDataBackup,
    importDataBackup,
    resetToDemoData,
    macrocycles,
    sessions,
    exercises,
    coaches
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataBackup(content);
        if (success) {
          setNotification('¡Copia de seguridad restaurada con éxito!');
          setTimeout(() => setNotification(null), 3500);
        } else {
          alert('El archivo JSON no tiene una estructura de copia válida de MisterPlanner.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Gestión Sin Conexión & Copias</h3>
              <p className="text-xs text-slate-400">Persistencia local y exportación de entrenamientos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {notification && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Status Box */}
          <div className={`p-4 rounded-xl border ${isOnline ? 'bg-slate-800/60 border-slate-700' : 'bg-amber-950/30 border-amber-500/30'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">Estado de Red del Dispositivo</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {isOnline ? '🟢 En Línea' : '🟠 Modo Sin Conexión Activo'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              MisterPlanner funciona como una aplicación <strong>Offline-First</strong>. Toda la planificación táctica, sesiones y croquis se guardan al instante en la memoria de tu dispositivo para que puedas usarlos en el campo sin internet.
            </p>
          </div>

          {/* Stored Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center">
              <span className="block text-2xl font-bold text-emerald-400">{macrocycles.length}</span>
              <span className="text-[11px] text-slate-400">Macrociclos</span>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center">
              <span className="block text-2xl font-bold text-blue-400">{sessions.length}</span>
              <span className="text-[11px] text-slate-400">Sesiones</span>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center">
              <span className="block text-2xl font-bold text-amber-400">{exercises.length}</span>
              <span className="text-[11px] text-slate-400">Ejercicios</span>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center">
              <span className="block text-2xl font-bold text-purple-400">{coaches.length}</span>
              <span className="text-[11px] text-slate-400">Entrenadores</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={exportDataBackup}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-950/50"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Copia de Seguridad (.JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-all border border-slate-700"
            >
              <Upload className="w-4 h-4" />
              <span>Importar / Restaurar Copia (.JSON)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                if (confirm('¿Deseas restaurar la plantilla inicial con sesiones y ejercicios de ejemplo? Se sobrescribirán los datos locales.')) {
                  resetToDemoData();
                  setNotification('Plantilla de ejemplo restaurada');
                  setTimeout(() => setNotification(null), 3000);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reiniciar a datos de demostración de fábrica</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Almacenamiento cifrado en tu navegador</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
