import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { TodaySessionView } from './components/dashboard/TodaySessionView';
import { SharedCalendar } from './components/calendar/SharedCalendar';
import { PeriodizationView } from './components/periodization/PeriodizationView';
import { ExerciseLibrary } from './components/exercises/ExerciseLibrary';
import { StaffView } from './components/staff/StaffView';
import { PlayersView } from './components/players/PlayersView';
import { WifiOff } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeTab, isOnline } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Offline Alert Strip (only visible if offline) */}
      {!isOnline && (
        <div className="bg-amber-950/90 border-b border-amber-500/40 px-4 py-2 text-center text-xs font-semibold text-amber-300 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Modo Sin Conexión Activado: Puedes seguir planificando y dibujando. Todos los datos se guardan en tu dispositivo.</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {activeTab === 'dashboard' && <TodaySessionView />}
        {activeTab === 'calendar' && <SharedCalendar />}
        {activeTab === 'periodization' && <PeriodizationView />}
        {activeTab === 'players' && <PlayersView />}
        {activeTab === 'exercises' && <ExerciseLibrary />}
        {activeTab === 'staff' && <StaffView />}
      </main>

      {/* Bottom Navigation for Mobile Devices */}
      <MobileTabBar />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
