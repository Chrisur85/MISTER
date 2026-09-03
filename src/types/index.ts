export type CoachRole = 
  | 'Primer Entrenador'
  | 'Segundo Entrenador'
  | 'Preparador Físico'
  | 'Entrenador de Porteros'
  | 'Analista Táctico';

export interface UserCoach {
  id: string;
  nombre: string;
  email: string;
  rol: CoachRole;
  avatar: string;
  club: string;
  telefono?: string;
  esAdmin: boolean;
  activo: boolean;
  ultimoAcceso?: string;
}

export type PeriodizationMethodology = 
  | 'Periodización Táctica' 
  | 'Microciclo Estructurado' 
  | 'ATR (Acumulación-Transformación-Realización)' 
  | 'Tradicional';

export interface Macrocycle {
  id: string;
  nombre: string;
  temporada: string;
  fechaInicio: string;
  fechaFin: string;
  objetivoGeneral: string;
  modeloJuego: string;
  metodologia: PeriodizationMethodology;
  creadorEmail: string;
  mesociclosIds: string[];
  estado: 'En Curso' | 'Planificado' | 'Finalizado';
}

export type MesocycleType = 
  | 'Entrante / Adaptación'
  | 'Básico / Acumulación'
  | 'Específico / Transformación'
  | 'Competitivo / Realización'
  | 'Regenerativo / Transición';

export interface Mesocycle {
  id: string;
  macrocicloId: string;
  nombre: string;
  tipo: MesocycleType;
  fechaInicio: string;
  fechaFin: string;
  objetivoFisico: string;
  objetivoTactico: string;
  dinamicaCarga: 'Creciente' | 'Ondulante' | 'Choque' | 'Descarga';
  microciclosIds: string[];
}

export type MicrocycleType = 
  | 'Ajuste'
  | 'Carga'
  | 'Impacto'
  | 'Activación'
  | 'Competitivo'
  | 'Recuperación';

export interface Microcycle {
  id: string;
  mesocicloId: string;
  numeroSemana: number;
  nombre: string;
  tipo: MicrocycleType;
  fechaInicio: string;
  fechaFin: string;
  objetivoSemanal: string;
  diaPartido?: string; // Ej: Sábado o Domingo
  rival?: string;
  cargaObjetivoSRPE: number; // Suma acumulada esperada de Foster (UA)
  sesionesIds: string[];
}

export type MatchDayRelative = 
  | 'MD+1 (Recuperación)'
  | 'MD+2 (Compensatorio)'
  | 'MD-4 (Tensión/Fuerza)'
  | 'MD-3 (Duración/Resistencia)'
  | 'MD-2 (Velocidad/Reactividad)'
  | 'MD-1 (Activación/ABP)'
  | 'MD (Día de Partido)'
  | 'Descanso';

export type SessionPhase = 'Calentamiento' | 'Parte Principal' | 'Vuelta a la Calma';

export interface SessionExerciseItem {
  id: string;
  ejercicioId: string;
  fase: SessionPhase;
  orden: number;
  duracionMinutos: number;
  series: number;
  repeticionesPorSerie: number;
  pausaEntreSeriesSeg: number;
  rpeEspecifico?: number;
  notasEspecificas?: string;
}

// Player Positions & Categories
export type PlayerPosition = 
  | 'Portero'
  | 'Defensa Central'
  | 'Lateral Derecho'
  | 'Lateral Izquierdo'
  | 'Mediocentro Defensivo'
  | 'Interior'
  | 'Mediapunta'
  | 'Extremo Derecho'
  | 'Extremo Izquierdo'
  | 'Delantero Centro';

export interface Player {
  id: string;
  nombre: string;
  dorsal: number;
  posicion: PlayerPosition;
  categoria: string; // Ej: 'Primer Equipo', 'Juvenil A', 'Cadete A'
  foto?: string;
  estado: 'Disponible' | 'Lesionado' | 'Duda' | 'Sancionado';
  contacto?: string;
}

export type AttendanceStatus = 'Presente' | 'Ausente' | 'Lesionado' | 'Permiso';

export interface AttendanceItem {
  jugadorId: string;
  estado: AttendanceStatus;
  observaciones?: string;
}

export interface TrainingSession {
  id: string;
  microcicloId: string;
  fecha: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  duracionMinutos: number;
  diaRelativoPartido: MatchDayRelative;
  titulo: string;
  categoriaEquipo: string; // Ej: 'Primer Equipo', 'Juvenil A', 'Cadete A'
  objetivoPrincipal: string;
  lugar: string; // Ej: Campo 1 (Césped natural), Gimnasio
  focoTactico: string;
  focoFisico: string;
  rpeEstimado: number; // 1 a 10 (Escala Borg)
  cargaFosterUA: number; // RPE * duracionMinutos
  creadorEmail: string;
  responsableNombre?: string;
  ejercicios: SessionExerciseItem[];
  asistencia: AttendanceItem[];
  asistenciaJugadores: number;
  estado: 'Planificada' | 'En Curso' | 'Completada' | 'Cancelada';
  notasPostSesion?: string;
}

export type ExerciseCategory = 
  | 'Rondos'
  | 'Posesiones y Mantenimientos'
  | 'Juegos de Posición'
  | 'Ataque - Defensa (Oleadas)'
  | 'Partidos Reducidos (SSG)'
  | 'Acciones a Balón Parado (ABP)'
  | 'Físico - Técnico Integrado'
  | 'Finalizaciones'
  | 'Calentamiento y Prevención';

export type GamePhase = 
  | 'Ataque Organizado'
  | 'Defensa Organizada'
  | 'Transición Ataque-Defensa'
  | 'Transición Defensa-Ataque'
  | 'Balón Parado (Ofensivo/Defensivo)';

export interface Exercise {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: ExerciseCategory;
  faseJuego: GamePhase;
  espacio: string; // Ej: "30x30 m", "Medio campo", "Área de penalti"
  numAtacantes: number;
  numDefensores: number;
  numComodines: number;
  numPorteros: number;
  duracionSugeridaMin: number;
  rpeEstimado: number; // 1-10
  reglasProvocacion: string[];
  objetivosPrincipales: string[];
  croquisUrl: string; // Base64 o URL de imagen o croquis SVG exportado
  autorEmail: string;
  creadoEn: string;
  etiquetas: string[];
}
