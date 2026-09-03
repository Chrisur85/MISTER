import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OfflineStatusBadgeProps {
  onClick?: () => void;
}

export const OfflineStatusBadge: React.FC<OfflineStatusBadgeProps> = ({ onClick }) => {
  const { isOnline } = useApp();

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm ${
        isOnline
          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/50'
          : 'bg-amber-950/90 text-amber-300 border border-amber-500/50 animate-pulse'
      }`}
      title={isOnline ? 'Conectado a Internet - Datos sincronizados localmente' : 'Modo Sin Conexión activo - Todos los cambios se guardan localmente'}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOnline ? 'bg-emerald-400' : 'bg-amber-400'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOnline ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />
      </span>
      {isOnline ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">En Línea</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>Sin Conexión (Offline)</span>
        </>
      )}
    </button>
  );
};
