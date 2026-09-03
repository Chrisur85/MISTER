import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserCoach,
  Macrocycle,
  Mesocycle,
  Microcycle,
  TrainingSession,
  Exercise,
  Player,
  AttendanceItem
} from '../types';
import {
  INITIAL_COACHES,
  INITIAL_MACROCYCLES,
  INITIAL_MESOCYCLES,
  INITIAL_MICROCYCLES,
  INITIAL_SESSIONS,
  INITIAL_EXERCISES,
  INITIAL_PLAYERS,
  TEAM_CATEGORIES
} from '../data/initialData';

export type ActiveTab = 'dashboard' | 'calendar' | 'periodization' | 'exercises' | 'staff' | 'players';

interface AppContextType {
  currentUser: UserCoach;
  coaches: UserCoach[];
  macrocycles: Macrocycle[];
  mesocycles: Mesocycle[];
  microcycles: Microcycle[];
  sessions: TrainingSession[];
  exercises: Exercise[];
  players: Player[];
  categories: string[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  isOnline: boolean;
  
  // Coach Management & Profile
  switchCoach: (coachId: string) => void;
  inviteCoach: (email: string, nombre: string, rol: UserCoach['rol']) => boolean;
  toggleCoachStatus: (coachId: string) => void;
  updateCoachProfile: (coachId: string, updates: Partial<UserCoach>) => void;
  
  // Periodization CRUD
  saveMacrocycle: (macro: Macrocycle) => void;
  deleteMacrocycle: (id: string) => void;
  saveMesocycle: (meso: Mesocycle) => void;
  deleteMesocycle: (id: string) => void;
  saveMicrocycle: (micro: Microcycle) => void;
  deleteMicrocycle: (id: string) => void;
  
  // Session CRUD & Attendance
  saveSession: (session: TrainingSession) => void;
  deleteSession: (id: string) => void;
  updateSessionAttendance: (sessionId: string, asistencia: AttendanceItem[]) => void;
  
  // Exercise CRUD
  saveExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;

  // Players CRUD
  savePlayer: (player: Player) => void;
  deletePlayer: (id: string) => void;
  importPlayersList: (categoria: string, rawText: string) => number;
  addCategory: (categoryName: string) => void;
  
  // Offline & Backup
  exportDataBackup: () => void;
  importDataBackup: (jsonContent: string) => boolean;
  resetToDemoData: () => void;
  
  // Helpers
  getMicrocycleLoad: (microcycleId: string) => { totalLoad: number; sessionsCount: number };
}

const STORAGE_KEY = 'misterplanner_tactical_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Online / Offline monitor
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load state from localStorage or initial seed
  const [coaches, setCoaches] = useState<UserCoach[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_coaches`);
    return saved ? JSON.parse(saved) : INITIAL_COACHES;
  });

  const [currentUser, setCurrentUser] = useState<UserCoach>(() => {
    const savedEmail = localStorage.getItem(`${STORAGE_KEY}_current_user_email`);
    if (savedEmail && coaches.length > 0) {
      const found = coaches.find(c => c.email === savedEmail);
      if (found) return found;
    }
    return coaches[0] || INITIAL_COACHES[0];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : TEAM_CATEGORIES;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_players`);
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [macrocycles, setMacrocycles] = useState<Macrocycle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_macrocycles`);
    return saved ? JSON.parse(saved) : INITIAL_MACROCYCLES;
  });

  const [mesocycles, setMesocycles] = useState<Mesocycle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_mesocycles`);
    return saved ? JSON.parse(saved) : INITIAL_MESOCYCLES;
  });

  const [microcycles, setMicrocycles] = useState<Microcycle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_microcycles`);
    return saved ? JSON.parse(saved) : INITIAL_MICROCYCLES;
  });

  const [sessions, setSessions] = useState<TrainingSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sessions`);
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_exercises`);
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-03');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_coaches`, JSON.stringify(coaches));
    localStorage.setItem(`${STORAGE_KEY}_current_user_email`, currentUser.email);
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
    localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(players));
    localStorage.setItem(`${STORAGE_KEY}_macrocycles`, JSON.stringify(macrocycles));
    localStorage.setItem(`${STORAGE_KEY}_mesocycles`, JSON.stringify(mesocycles));
    localStorage.setItem(`${STORAGE_KEY}_microcycles`, JSON.stringify(microcycles));
    localStorage.setItem(`${STORAGE_KEY}_sessions`, JSON.stringify(sessions));
    localStorage.setItem(`${STORAGE_KEY}_exercises`, JSON.stringify(exercises));
  }, [coaches, currentUser, categories, players, macrocycles, mesocycles, microcycles, sessions, exercises]);

  // Auth / Coach Switcher & Profile editing
  const switchCoach = (coachId: string) => {
    const found = coaches.find(c => c.id === coachId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem(`${STORAGE_KEY}_current_user_email`, found.email);
    }
  };

  const updateCoachProfile = (coachId: string, updates: Partial<UserCoach>) => {
    setCoaches(prev => {
      const updated = prev.map(c => c.id === coachId ? { ...c, ...updates } : c);
      return updated;
    });
    if (currentUser.id === coachId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const inviteCoach = (email: string, nombre: string, rol: UserCoach['rol']): boolean => {
    if (!email || coaches.some(c => c.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }
    const newCoach: UserCoach = {
      id: `coach-${Date.now()}`,
      nombre,
      email: email.toLowerCase(),
      rol,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nombre)}`,
      club: 'AB FÚTBOL',
      telefono: '',
      esAdmin: rol === 'Primer Entrenador',
      activo: true,
      ultimoAcceso: 'Recién invitado'
    };
    setCoaches(prev => [...prev, newCoach]);
    return true;
  };

  const toggleCoachStatus = (coachId: string) => {
    setCoaches(prev => prev.map(c => c.id === coachId ? { ...c, activo: !c.activo } : c));
  };

  // Players Management
  const savePlayer = (player: Player) => {
    setPlayers(prev => {
      const idx = prev.findIndex(p => p.id === player.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = player;
        return copy;
      }
      return [...prev, player];
    });
  };

  const deletePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const importPlayersList = (categoria: string, rawText: string): number => {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    let count = 0;
    const newPlayers: Player[] = [];

    lines.forEach((line, index) => {
      // Parses format: "1 - Marc Ibañez - Portero" or "1 Marc Ibañez" or "Marc Ibañez"
      const matchNumber = line.match(/^(\d+)\s*[-–.]?\s*(.*)$/);
      let dorsal = index + 1;
      let name = line;
      let pos: Player['posicion'] = 'Interior';

      if (matchNumber) {
        dorsal = parseInt(matchNumber[1], 10);
        name = matchNumber[2].trim();
      }

      // Check position in string if present
      if (name.toLowerCase().includes('portero')) pos = 'Portero';
      else if (name.toLowerCase().includes('defensa') || name.toLowerCase().includes('central')) pos = 'Defensa Central';
      else if (name.toLowerCase().includes('lateral')) pos = 'Lateral Derecho';
      else if (name.toLowerCase().includes('delantero')) pos = 'Delantero Centro';
      else if (name.toLowerCase().includes('extremo')) pos = 'Extremo Derecho';

      // Clean name from position tags
      name = name.replace(/[-–(].*$/, '').trim();

      newPlayers.push({
        id: `p-${Date.now()}-${count}`,
        nombre: name || `Jugador ${dorsal}`,
        dorsal,
        posicion: pos,
        categoria,
        estado: 'Disponible'
      });
      count++;
    });

    if (newPlayers.length > 0) {
      setPlayers(prev => [...prev, ...newPlayers]);
    }
    return count;
  };

  const addCategory = (categoryName: string) => {
    if (categoryName.trim() && !categories.includes(categoryName.trim())) {
      setCategories(prev => [...prev, categoryName.trim()]);
    }
  };

  // Periodization CRUD
  const saveMacrocycle = (macro: Macrocycle) => {
    setMacrocycles(prev => {
      const idx = prev.findIndex(m => m.id === macro.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = macro;
        return copy;
      }
      return [...prev, macro];
    });
  };

  const deleteMacrocycle = (id: string) => {
    setMacrocycles(prev => prev.filter(m => m.id !== id));
    const mesosToRemove = mesocycles.filter(m => m.macrocicloId === id).map(m => m.id);
    setMesocycles(prev => prev.filter(m => m.macrocicloId !== id));
    setMicrocycles(prev => prev.filter(micro => !mesosToRemove.includes(micro.mesocicloId)));
  };

  const saveMesocycle = (meso: Mesocycle) => {
    setMesocycles(prev => {
      const idx = prev.findIndex(m => m.id === meso.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = meso;
        return copy;
      }
      return [...prev, meso];
    });
    setMacrocycles(prev => prev.map(mac => {
      if (mac.id === meso.macrocicloId && !mac.mesociclosIds.includes(meso.id)) {
        return { ...mac, mesociclosIds: [...mac.mesociclosIds, meso.id] };
      }
      return mac;
    }));
  };

  const deleteMesocycle = (id: string) => {
    setMesocycles(prev => prev.filter(m => m.id !== id));
    setMacrocycles(prev => prev.map(mac => ({
      ...mac,
      mesociclosIds: mac.mesociclosIds.filter(mId => mId !== id)
    })));
    setMicrocycles(prev => prev.filter(micro => micro.mesocicloId !== id));
  };

  const saveMicrocycle = (micro: Microcycle) => {
    setMicrocycles(prev => {
      const idx = prev.findIndex(m => m.id === micro.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = micro;
        return copy;
      }
      return [...prev, micro];
    });
    setMesocycles(prev => prev.map(mes => {
      if (mes.id === micro.mesocicloId && !mes.microciclosIds.includes(micro.id)) {
        return { ...mes, microciclosIds: [...mes.microciclosIds, micro.id] };
      }
      return mes;
    }));
  };

  const deleteMicrocycle = (id: string) => {
    setMicrocycles(prev => prev.filter(m => m.id !== id));
    setMesocycles(prev => prev.map(mes => ({
      ...mes,
      microciclosIds: mes.microciclosIds.filter(mId => mId !== id)
    })));
    setSessions(prev => prev.filter(s => s.microcicloId !== id));
  };

  // Session CRUD
  const saveSession = (session: TrainingSession) => {
    const calculatedFoster = session.rpeEstimado * session.duracionMinutos;
    const presentCount = session.asistencia ? session.asistencia.filter(a => a.estado === 'Presente').length : (session.asistenciaJugadores || 0);

    const sessionWithLoad: TrainingSession = {
      ...session,
      categoriaEquipo: session.categoriaEquipo || 'Primer Equipo',
      cargaFosterUA: calculatedFoster,
      asistenciaJugadores: presentCount,
      asistencia: session.asistencia || [],
      responsableNombre: session.responsableNombre || currentUser.nombre,
      creadorEmail: session.creadorEmail || currentUser.email
    };

    setSessions(prev => {
      const idx = prev.findIndex(s => s.id === session.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = sessionWithLoad;
        return copy;
      }
      return [...prev, sessionWithLoad];
    });

    if (session.microcicloId) {
      setMicrocycles(prev => prev.map(mic => {
        if (mic.id === session.microcicloId && !mic.sesionesIds.includes(session.id)) {
          return { ...mic, sesionesIds: [...mic.sesionesIds, session.id] };
        }
        return mic;
      }));
    }
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setMicrocycles(prev => prev.map(mic => ({
      ...mic,
      sesionesIds: mic.sesionesIds.filter(sId => sId !== id)
    })));
  };

  const updateSessionAttendance = (sessionId: string, asistencia: AttendanceItem[]) => {
    const presentCount = asistencia.filter(a => a.estado === 'Presente').length;
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          asistencia,
          asistenciaJugadores: presentCount
        };
      }
      return s;
    }));
  };

  // Exercise CRUD
  const saveExercise = (exercise: Exercise) => {
    const finalExercise: Exercise = {
      ...exercise,
      autorEmail: exercise.autorEmail || currentUser.email,
      creadoEn: exercise.creadoEn || new Date().toISOString().split('T')[0]
    };
    setExercises(prev => {
      const idx = prev.findIndex(e => e.id === exercise.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = finalExercise;
        return copy;
      }
      return [finalExercise, ...prev];
    });
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  // Helpers
  const getMicrocycleLoad = (microcycleId: string) => {
    const microSessions = sessions.filter(s => s.microcicloId === microcycleId);
    const totalLoad = microSessions.reduce((sum, s) => sum + (s.cargaFosterUA || 0), 0);
    return {
      totalLoad,
      sessionsCount: microSessions.length
    };
  };

  // Backup & Restore
  const exportDataBackup = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      club: 'AB FÚTBOL',
      coaches,
      categories,
      players,
      macrocycles,
      mesocycles,
      microcycles,
      sessions,
      exercises
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AB_Futbol_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDataBackup = (jsonContent: string): boolean => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed.macrocycles && parsed.sessions && parsed.exercises) {
        if (parsed.coaches) setCoaches(parsed.coaches);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.players) setPlayers(parsed.players);
        setMacrocycles(parsed.macrocycles);
        if (parsed.mesocycles) setMesocycles(parsed.mesocycles);
        if (parsed.microcycles) setMicrocycles(parsed.microcycles);
        setSessions(parsed.sessions);
        setExercises(parsed.exercises);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error importing backup:', e);
      return false;
    }
  };

  const resetToDemoData = () => {
    setCoaches(INITIAL_COACHES);
    setCurrentUser(INITIAL_COACHES[0]);
    setCategories(TEAM_CATEGORIES);
    setPlayers(INITIAL_PLAYERS);
    setMacrocycles(INITIAL_MACROCYCLES);
    setMesocycles(INITIAL_MESOCYCLES);
    setMicrocycles(INITIAL_MICROCYCLES);
    setSessions(INITIAL_SESSIONS);
    setExercises(INITIAL_EXERCISES);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        coaches,
        macrocycles,
        mesocycles,
        microcycles,
        sessions,
        exercises,
        players,
        categories,
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        isOnline,
        switchCoach,
        inviteCoach,
        toggleCoachStatus,
        updateCoachProfile,
        savePlayer,
        deletePlayer,
        importPlayersList,
        addCategory,
        saveMacrocycle,
        deleteMacrocycle,
        saveMesocycle,
        deleteMesocycle,
        saveMicrocycle,
        deleteMicrocycle,
        saveSession,
        deleteSession,
        updateSessionAttendance,
        saveExercise,
        deleteExercise,
        exportDataBackup,
        importDataBackup,
        resetToDemoData,
        getMicrocycleLoad
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
