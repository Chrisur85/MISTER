import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  User,
  Phone,
  Mail,
  Shield,
  Save,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachRole } from '../../types';

interface CoachProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoachProfileModal: React.FC<CoachProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateCoachProfile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState(currentUser.nombre);
  const [telefono, setTelefono] = useState(currentUser.telefono || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [rol, setRol] = useState<CoachRole>(currentUser.rol);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle local image upload from device
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setAvatar(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetAvatar = () => {
    setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nombre)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    updateCoachProfile(currentUser.id, {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      avatar,
      rol
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Editar Perfil del Entrenador</h3>
              <p className="text-xs text-slate-400">Personaliza tu foto de perfil y datos técnicos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {savedSuccess && (
            <div className="p-3 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-2 font-semibold text-xs animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>¡Perfil y foto actualizados correctamente!</span>
            </div>
          )}

          {/* Photo upload section */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-850 rounded-2xl border border-slate-750 space-y-3">
            <div className="relative group">
              <img
                src={avatar}
                alt={nombre}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/50 shadow-xl"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Cargar foto desde este dispositivo"
              >
                <Camera className="w-6 h-6 mb-1 text-emerald-400" />
                <span className="text-[10px] font-bold">Cambiar</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Cargar Foto desde Dispositivo</span>
              </button>
              <button
                type="button"
                onClick={handleResetAvatar}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Generar avatar ilustrado"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <p className="text-[11px] text-slate-400 text-center">
              Sube una foto desde tu móvil, tablet o PC (JPG, PNG, WebP)
            </p>
          </div>

          {/* Name & Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nombre y Apellidos *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Correo Electrónico (Identificador)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-slate-400 text-xs font-mono cursor-not-allowed"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              El correo está asignado por el club para el acceso seguro al calendario.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Teléfono de Contacto Técnico
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                placeholder="+34 600 000 000"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Rol Técnico en AB FÚTBOL
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as CoachRole)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Primer Entrenador">Primer Entrenador</option>
              <option value="Segundo Entrenador">Segundo Entrenador</option>
              <option value="Preparador Físico">Preparador Físico</option>
              <option value="Entrenador de Porteros">Entrenador de Porteros</option>
              <option value="Analista Táctico">Analista Táctico</option>
            </select>
          </div>

          {/* Club Fixed Badge */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-300">Club Asignado:</span>
            <span className="text-xs font-bold text-emerald-400">AB FÚTBOL</span>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
