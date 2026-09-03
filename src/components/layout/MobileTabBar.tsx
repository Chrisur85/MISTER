import React from 'react';
import { Activity, Calendar as CalendarIcon, Layers, BookOpen, Users, Shirt } from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';

export const MobileTabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Hoy', icon: Activity },
    { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
    { id: 'periodization', label: 'Estructura', icon: Layers },
    { id: 'players', label: 'Plantillas', icon: Shirt },
    { id: 'exercises', label: 'Tareas', icon: BookOpen },
    { id: 'staff', label: 'Técnicos', icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
