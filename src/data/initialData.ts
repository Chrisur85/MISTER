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

export const TEAM_CATEGORIES = [
  'Primer Equipo',
  'Filial (Senior B)',
  'Juvenil A',
  'Juvenil B',
  'Cadete A',
  'Infantil A'
];

// Helper to generate simple tactical pitch SVG data URL for initial croquis
function generatePitchSvgDataUrl(title: string, redPlayers = 4, bluePlayers = 4, neutralPlayers = 2): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
    <rect width="600" height="400" fill="#133e29"/>
    <!-- Pitch Lines -->
    <rect x="20" y="20" width="560" height="360" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="3"/>
    <line x1="300" y1="20" x2="300" y2="380" stroke="rgba(255,255,255,0.7)" stroke-width="3"/>
    <circle cx="300" cy="200" r="55" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="3"/>
    <circle cx="300" cy="200" r="5" fill="white"/>
    <!-- Boxes -->
    <rect x="20" y="110" width="90" height="180" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="3"/>
    <rect x="490" y="110" width="90" height="180" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="3"/>
    
    <!-- Exercise Area Highlight -->
    <rect x="150" y="80" width="300" height="240" fill="rgba(34, 197, 94, 0.15)" stroke="#22c55e" stroke-width="2" stroke-dasharray="6 4" rx="8"/>
    
    <!-- Cones -->
    <polygon points="150,80 144,92 156,92" fill="#f97316"/>
    <polygon points="450,80 444,92 456,92" fill="#f97316"/>
    <polygon points="150,320 144,332 156,332" fill="#f97316"/>
    <polygon points="450,320 444,332 456,332" fill="#f97316"/>
    
    <!-- Red Team -->
    <circle cx="210" cy="140" r="14" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
    <text x="210" y="145" font-size="11" font-weight="bold" fill="white" text-anchor="middle">4</text>
    <circle cx="260" cy="240" r="14" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
    <text x="260" y="245" font-size="11" font-weight="bold" fill="white" text-anchor="middle">8</text>
    <circle cx="200" cy="270" r="14" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
    <text x="200" y="275" font-size="11" font-weight="bold" fill="white" text-anchor="middle">6</text>
    <circle cx="270" cy="120" r="14" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
    <text x="270" y="125" font-size="11" font-weight="bold" fill="white" text-anchor="middle">10</text>

    <!-- Blue Team -->
    <circle cx="340" cy="150" r="14" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
    <text x="340" y="155" font-size="11" font-weight="bold" fill="white" text-anchor="middle">5</text>
    <circle cx="380" cy="230" r="14" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
    <text x="380" y="235" font-size="11" font-weight="bold" fill="white" text-anchor="middle">3</text>
    <circle cx="330" cy="270" r="14" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
    <text x="330" y="275" font-size="11" font-weight="bold" fill="white" text-anchor="middle">2</text>
    <circle cx="390" cy="130" r="14" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
    <text x="390" y="135" font-size="11" font-weight="bold" fill="white" text-anchor="middle">9</text>

    <!-- Neutral Yellow Comodines -->
    <circle cx="300" cy="100" r="13" fill="#eab308" stroke="#ffffff" stroke-width="2"/>
    <text x="300" y="104" font-size="10" font-weight="bold" fill="#000" text-anchor="middle">C1</text>
    <circle cx="300" cy="300" r="13" fill="#eab308" stroke="#ffffff" stroke-width="2"/>
    <text x="300" y="304" font-size="10" font-weight="bold" fill="#000" text-anchor="middle">C2</text>

    <!-- Ball & Pass Arrow -->
    <circle cx="230" cy="150" r="8" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    <path d="M 238 152 Q 270 180 290 285" fill="none" stroke="#facc15" stroke-width="3" stroke-dasharray="6 4"/>
    <polygon points="292,293 286,280 297,282" fill="#facc15"/>

    <!-- Title Badge -->
    <rect x="25" y="25" width="220" height="28" rx="4" fill="rgba(15, 23, 42, 0.85)"/>
    <text x="35" y="44" font-size="12" font-weight="600" fill="#22c55e" font-family="sans-serif">${title.slice(0, 32)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_COACHES: UserCoach[] = [
  {
    id: 'coach-1',
    nombre: 'Carlos Morales',
    email: 'carlos.mister@abfutbol.com',
    rol: 'Primer Entrenador',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    club: 'AB FÚTBOL',
    telefono: '+34 612 345 678',
    esAdmin: true,
    activo: true,
    ultimoAcceso: '2026-09-03 10:30'
  },
  {
    id: 'coach-2',
    nombre: 'Mateo Silva',
    email: 'mateo.asistente@abfutbol.com',
    rol: 'Segundo Entrenador',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    club: 'AB FÚTBOL',
    telefono: '+34 623 456 789',
    esAdmin: false,
    activo: true,
    ultimoAcceso: '2026-09-03 09:15'
  },
  {
    id: 'coach-3',
    nombre: 'David Lorente',
    email: 'david.preparador@abfutbol.com',
    rol: 'Preparador Físico',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    club: 'AB FÚTBOL',
    telefono: '+34 634 567 890',
    esAdmin: false,
    activo: true,
    ultimoAcceso: '2026-09-03 11:00'
  },
  {
    id: 'coach-4',
    nombre: 'Álvaro Campos',
    email: 'alvaro.porteros@abfutbol.com',
    rol: 'Entrenador de Porteros',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    club: 'AB FÚTBOL',
    telefono: '+34 645 678 901',
    esAdmin: false,
    activo: true,
    ultimoAcceso: '2026-09-02 18:40'
  },
  {
    id: 'coach-5',
    nombre: 'Elena Vega',
    email: 'elena.analista@abfutbol.com',
    rol: 'Analista Táctico',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    club: 'AB FÚTBOL',
    telefono: '+34 656 789 012',
    esAdmin: false,
    activo: true,
    ultimoAcceso: '2026-09-03 08:20'
  }
];

export const INITIAL_PLAYERS: Player[] = [
  // --- PRIMER EQUIPO ---
  { id: 'p-1', nombre: 'Marc Ibañez', dorsal: 1, posicion: 'Portero', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-2', nombre: 'Daniel Carvajal', dorsal: 2, posicion: 'Lateral Derecho', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-3', nombre: 'Alejandro Balde', dorsal: 3, posicion: 'Lateral Izquierdo', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-4', nombre: 'Gerard Navarro', dorsal: 4, posicion: 'Defensa Central', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-5', nombre: 'Pau Cubarsí', dorsal: 5, posicion: 'Defensa Central', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-6', nombre: 'Martín Zubimendi', dorsal: 6, posicion: 'Mediocentro Defensivo', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-7', nombre: 'Ferran Torres', dorsal: 7, posicion: 'Extremo Derecho', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-8', nombre: 'Pablo Gavi', dorsal: 8, posicion: 'Interior', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-9', nombre: 'Robert Navarro', dorsal: 9, posicion: 'Delantero Centro', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-10', nombre: 'Pedri González', dorsal: 10, posicion: 'Interior', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-11', nombre: 'Raphinha Dias', dorsal: 11, posicion: 'Extremo Izquierdo', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-12', nombre: 'Lucas Romero', dorsal: 12, posicion: 'Defensa Central', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-13', nombre: 'Sergio Roldán', dorsal: 13, posicion: 'Portero', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-14', nombre: 'Fermín López', dorsal: 14, posicion: 'Mediapunta', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-15', nombre: 'Eric Soler', dorsal: 15, posicion: 'Lateral Izquierdo', categoria: 'Primer Equipo', estado: 'Lesionado' },
  { id: 'p-16', nombre: 'Nico González', dorsal: 16, posicion: 'Mediocentro Defensivo', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-17', nombre: 'Lamine Yamal', dorsal: 17, posicion: 'Extremo Derecho', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-18', nombre: 'Dani Olmo', dorsal: 18, posicion: 'Mediapunta', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-19', nombre: 'Nico Williams', dorsal: 19, posicion: 'Extremo Izquierdo', categoria: 'Primer Equipo', estado: 'Disponible' },
  { id: 'p-21', nombre: 'Hugo Duro', dorsal: 21, posicion: 'Delantero Centro', categoria: 'Primer Equipo', estado: 'Duda' },
  { id: 'p-22', nombre: 'Álvaro Morata', dorsal: 22, posicion: 'Delantero Centro', categoria: 'Primer Equipo', estado: 'Disponible' },

  // --- JUVENIL A ---
  { id: 'pj-1', nombre: 'Iker Gómez', dorsal: 1, posicion: 'Portero', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-2', nombre: 'Mario Ruiz', dorsal: 2, posicion: 'Lateral Derecho', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-3', nombre: 'Adrián Sánchez', dorsal: 3, posicion: 'Lateral Izquierdo', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-4', nombre: 'Unai Fernández', dorsal: 4, posicion: 'Defensa Central', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-5', nombre: 'David Martín', dorsal: 5, posicion: 'Defensa Central', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-6', nombre: 'Marcos Alonso', dorsal: 6, posicion: 'Mediocentro Defensivo', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-7', nombre: 'Samuel Ramos', dorsal: 7, posicion: 'Extremo Derecho', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-8', nombre: 'Carlos Benítez', dorsal: 8, posicion: 'Interior', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-9', nombre: 'Raúl Jr', dorsal: 9, posicion: 'Delantero Centro', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-10', nombre: 'Jaime Pastor', dorsal: 10, posicion: 'Mediapunta', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-11', nombre: 'Lucas Vázquez Jr', dorsal: 11, posicion: 'Extremo Izquierdo', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-12', nombre: 'Jorge Herrero', dorsal: 12, posicion: 'Defensa Central', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-13', nombre: 'Mateo Ortiz', dorsal: 13, posicion: 'Portero', categoria: 'Juvenil A', estado: 'Disponible' },
  { id: 'pj-14', nombre: 'Pablo Blanco', dorsal: 14, posicion: 'Interior', categoria: 'Juvenil A', estado: 'Disponible' },

  // --- CADETE A ---
  { id: 'pc-1', nombre: 'Hugo Gil', dorsal: 1, posicion: 'Portero', categoria: 'Cadete A', estado: 'Disponible' },
  { id: 'pc-2', nombre: 'Leo Santos', dorsal: 4, posicion: 'Defensa Central', categoria: 'Cadete A', estado: 'Disponible' },
  { id: 'pc-3', nombre: 'Javier Pons', dorsal: 8, posicion: 'Interior', categoria: 'Cadete A', estado: 'Disponible' },
  { id: 'pc-4', nombre: 'Álex Delgado', dorsal: 9, posicion: 'Delantero Centro', categoria: 'Cadete A', estado: 'Disponible' }
];

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    titulo: 'Rondo 4v4 + 3 Comodines en Espacio Reducido',
    descripcion: 'Mantenimiento de posesión con orientación hacia comodines axiales y central. Presión tras pérdida inmediata en 3 segundos.',
    categoria: 'Rondos',
    faseJuego: 'Ataque Organizado',
    espacio: '20x20 m',
    numAtacantes: 4,
    numDefensores: 4,
    numComodines: 3,
    numPorteros: 0,
    duracionSugeridaMin: 18,
    rpeEstimado: 7,
    reglasProvocacion: [
      'Máximo 2 toques por jugador exterior',
      'Comodín interior solo juega a 1 toque si recibe orientado',
      'Si los defensores roban, deben conectar un pase con cualquier comodín para cambiar de rol'
    ],
    objetivosPrincipales: [
      'Fijar y atraer para descargar en tercer hombre',
      'Orientación corporal antes de recibir',
      'Presión colectiva tras pérdida (Gegenpressing)'
    ],
    croquisUrl: generatePitchSvgDataUrl('Rondo 4v4+3'),
    autorEmail: 'carlos.mister@abfutbol.com',
    creadoEn: '2026-08-15',
    etiquetas: ['Posesión', 'Tercer Hombre', 'RPE 7', 'MD-4']
  },
  {
    id: 'ex-2',
    titulo: 'Juego de Posición 7v7 + 3 con Salida desde Bloque Bajo',
    descripcion: 'Estructura posicional 1-4-3-3 adaptada. El equipo en posesión busca superar la primera línea de presión rival atrayendo a interiores.',
    categoria: 'Juegos de Posición',
    faseJuego: 'Ataque Organizado',
    espacio: '50x40 m',
    numAtacantes: 7,
    numDefensores: 7,
    numComodines: 3,
    numPorteros: 2,
    duracionSugeridaMin: 25,
    rpeEstimado: 8,
    reglasProvocacion: [
      'Gol solo válido si el balón ha pasado previamente por el carril central',
      'Defensores en bloque medio-alto obligan a saltar al central libre',
      'Transición en 6 segundos para finalizar en mini-porterías si roban defensores'
    ],
    objetivosPrincipales: [
      'Creación y ocupación racional de los pasillos interiores',
      'Salida lavolpiana / progresión con lateral alto',
      'Equilibrio defensivo preventivo en vigilancia'
    ],
    croquisUrl: generatePitchSvgDataUrl('Juego de Posición 7v7+3'),
    autorEmail: 'carlos.mister@abfutbol.com',
    creadoEn: '2026-08-18',
    etiquetas: ['Salida de balón', 'Espacio amplio', 'RPE 8', 'MD-3']
  },
  {
    id: 'ex-3',
    titulo: 'Oleadas 3v2 con Transición Ofensiva Rápida y Repliegue',
    descripcion: 'Ataque continuo a máxima velocidad. Tras remate o pérdida, los 3 atacantes deben replegar a toda intensidad mientras entra una nueva oleada rival.',
    categoria: 'Ataque - Defensa (Oleadas)',
    faseJuego: 'Transición Defensa-Ataque',
    espacio: 'Medio campo (50x65 m)',
    numAtacantes: 6,
    numDefensores: 4,
    numComodines: 0,
    numPorteros: 2,
    duracionSugeridaMin: 20,
    rpeEstimado: 9,
    reglasProvocacion: [
      'Tiempo límite de 8 segundos para finalizar desde el pitido',
      'Se prohíbe pasar hacia atrás en campo rival',
      'Si el portero o defensores interceptan, punto doble con pase largo a zona de descarga'
    ],
    objetivosPrincipales: [
      'Aprovechamiento de superioridad numérica en carrera',
      'Velocidad de toma de decisiones en fatiga',
      'Temporización del central en inferioridad 2v3'
    ],
    croquisUrl: generatePitchSvgDataUrl('Oleadas 3v2 Transición'),
    autorEmail: 'mateo.asistente@abfutbol.com',
    creadoEn: '2026-08-20',
    etiquetas: ['Velocidad', 'Oleadas', 'Transiciones', 'RPE 9', 'MD-2']
  },
  {
    id: 'ex-4',
    titulo: 'Partido Modificado 8v8 con Zonas de Presión y Estreñimiento',
    descripcion: 'Campo dividido en 3 pasillos longitudinales y 3 sectores. El equipo defensor debe bascular dejando el pasillo lejano libre.',
    categoria: 'Partidos Reducidos (SSG)',
    faseJuego: 'Defensa Organizada',
    espacio: '60x45 m',
    numAtacantes: 8,
    numDefensores: 8,
    numComodines: 0,
    numPorteros: 2,
    duracionSugeridaMin: 24,
    rpeEstimado: 8,
    reglasProvocacion: [
      'Todos los jugadores defensores deben estar en máximo 2 carriles contiguos',
      'Robo en sector alto cuenta como 2 goles',
      'Juego a 3 toques para estimular el ritmo de circulación'
    ],
    objetivosPrincipales: [
      'Basculación sincronizada del bloque medio',
      'Acortar distancias interlineales (<15 metros)',
      'Cambio de orientación rápido tras atraer'
    ],
    croquisUrl: generatePitchSvgDataUrl('Partido 8v8 Zonas Presión'),
    autorEmail: 'david.preparador@abfutbol.com',
    creadoEn: '2026-08-22',
    etiquetas: ['Basculación', 'SSG', 'RPE 8', 'MD-3']
  },
  {
    id: 'ex-5',
    titulo: 'ABP: Córner Ofensivo con Pantalla y Ataque al Primer Palo',
    descripcion: 'Secuencia ensayada de saque de esquina. Señal visual con brazo derecho levantado. 2 jugadores arrastran marcas y central remata al vértice del área pequeña.',
    categoria: 'Acciones a Balón Parado (ABP)',
    faseJuego: 'Balón Parado (Ofensivo/Defensivo)',
    espacio: 'Área de penalti reglamentaria',
    numAtacantes: 6,
    numDefensores: 6,
    numComodines: 0,
    numPorteros: 1,
    duracionSugeridaMin: 15,
    rpeEstimado: 4,
    reglasProvocacion: [
      'Repetir 6 envíos alternando perfil zurdo y diestro',
      'Rebote fuera del área cubierto por dos lanzadores para segundo tiro',
      'Vigilancia defensiva 2v1 en línea divisoria para evitar contraataque'
    ],
    objetivosPrincipales: [
      'Sincronización carrera-impacto del rematador',
      'Bloqueo limpio sobre el defensor en zona mixta',
      'Rechace activo y prevención de contragolpe'
    ],
    croquisUrl: generatePitchSvgDataUrl('ABP Córner Ofensivo'),
    autorEmail: 'carlos.mister@abfutbol.com',
    creadoEn: '2026-08-25',
    etiquetas: ['ABP', 'Estrategia', 'Activación', 'MD-1']
  },
  {
    id: 'ex-6',
    titulo: 'Circuito de Activación Neuromuscular y Rondo Dinámico',
    descripcion: 'Postas de coordinación con escaleras, cambios de dirección con picas y finalización en rondo de 1 toque a alta frecuencia.',
    categoria: 'Calentamiento y Prevención',
    faseJuego: 'Ataque Organizado',
    espacio: '30x20 m',
    numAtacantes: 10,
    numDefensores: 2,
    numComodines: 0,
    numPorteros: 0,
    duracionSugeridaMin: 15,
    rpeEstimado: 5,
    reglasProvocacion: [
      '2 vueltas al circuito motor antes de entrar al rondo',
      'Máximo 1 toque con sonido verbal al pasar el balón'
    ],
    objetivosPrincipales: [
      'Elevación de temperatura corporal y rango articular',
      'Activación neuromuscular pre-sesión',
      'Foco atencional y dinámica de grupo'
    ],
    croquisUrl: generatePitchSvgDataUrl('Circuito Activación'),
    autorEmail: 'david.preparador@abfutbol.com',
    creadoEn: '2026-08-28',
    etiquetas: ['Activación', 'Calentamiento', 'RPE 5', 'Todos los días']
  }
];

export const INITIAL_MACROCYCLES: Macrocycle[] = [
  {
    id: 'macro-1',
    nombre: 'Temporada Oficial 2026/2027',
    temporada: '2026-2027',
    fechaInicio: '2026-08-01',
    fechaFin: '2027-05-30',
    objetivoGeneral: 'Consolidar el modelo de juego ofensivo combinativo de AB FÚTBOL, lograr ascenso a playoff y optimizar la disponibilidad física de la plantilla (>92% sin lesiones).',
    modeloJuego: 'Dominio mediante posesión con presión tras pérdida en bloque alto. Estructura 1-4-3-3 en fase ofensiva y 1-4-4-2 compacto en bloque medio defensivo.',
    metodologia: 'Periodización Táctica',
    creadorEmail: 'carlos.mister@abfutbol.com',
    mesociclosIds: ['meso-1', 'meso-2'],
    estado: 'En Curso'
  }
];

export const INITIAL_MESOCYCLES: Mesocycle[] = [
  {
    id: 'meso-1',
    macrocicloId: 'macro-1',
    nombre: 'Mesociclo 1: Pretemporada e Instalación de Principios',
    tipo: 'Básico / Acumulación',
    fechaInicio: '2026-08-01',
    fechaFin: '2026-08-31',
    objetivoFisico: 'Construir la base aeróbica específica y capacidad de repetición de esfuerzos de alta intensidad (RSA).',
    objetivoTactico: 'Asimilar los 4 grandes momentos del juego y la comunicación entre líneas defensivas.',
    dinamicaCarga: 'Creciente',
    microciclosIds: ['micro-1']
  },
  {
    id: 'meso-2',
    macrocicloId: 'macro-1',
    nombre: 'Mesociclo 2: Bloque Competitivo Apertura',
    tipo: 'Competitivo / Realización',
    fechaInicio: '2026-09-01',
    fechaFin: '2026-09-30',
    objetivoFisico: 'Mantener niveles de fuerza máxima relativa y frescura neuromuscular para el día de partido (MD).',
    objetivoTactico: 'Adaptación al rival semanal sin perder identidad de juego de AB FÚTBOL.',
    dinamicaCarga: 'Ondulante',
    microciclosIds: ['micro-2']
  }
];

export const INITIAL_MICROCYCLES: Microcycle[] = [
  {
    id: 'micro-1',
    mesocicloId: 'meso-1',
    numeroSemana: 4,
    nombre: 'Microciclo 4: Choque y Carga Máxima',
    tipo: 'Carga',
    fechaInicio: '2026-08-24',
    fechaFin: '2026-08-30',
    objetivoSemanal: 'Elevar volumen e intensidad en espacios reducidos y medios con simulación de partido amistoso.',
    diaPartido: 'Domingo',
    rival: 'Amistoso vs Atl. Deportivo',
    cargaObjetivoSRPE: 2800,
    sesionesIds: ['sess-1']
  },
  {
    id: 'micro-2',
    mesocicloId: 'meso-2',
    numeroSemana: 5,
    nombre: 'Microciclo 5: Competitivo Oficial Jornada 1',
    tipo: 'Competitivo',
    fechaInicio: '2026-08-31',
    fechaFin: '2026-09-06',
    objetivoSemanal: 'Estructuración semanal completa enfocada al partido del domingo frente a CF Badalona. Dinámica MD-4 a MD+1.',
    diaPartido: 'Domingo',
    rival: 'CF Badalona (Jornada 1 Liga)',
    cargaObjetivoSRPE: 2450,
    sesionesIds: ['sess-2', 'sess-3', 'sess-4', 'sess-5']
  }
];

// Helper to seed initial attendance for primer equipo
const primerEquipoAttendance: AttendanceItem[] = INITIAL_PLAYERS
  .filter(p => p.categoria === 'Primer Equipo')
  .map(p => ({
    jugadorId: p.id,
    estado: p.estado === 'Lesionado' ? 'Lesionado' : (p.id === 'p-21' ? 'Permiso' : 'Presente')
  }));

export const INITIAL_SESSIONS: TrainingSession[] = [
  {
    id: 'sess-1',
    microcicloId: 'micro-1',
    fecha: '2026-08-26',
    horaInicio: '09:30',
    duracionMinutos: 90,
    diaRelativoPartido: 'MD-4 (Tensión/Fuerza)',
    titulo: 'Sesión de Tensión y Duelos en Espacio Reducido',
    categoriaEquipo: 'Primer Equipo',
    objetivoPrincipal: 'Trabajo de aceleraciones, desaceleraciones y duelos 1v1 y 2v2 en espacios comprimidos.',
    lugar: 'Campo 1 (Césped natural)',
    focoTactico: 'Presión tras pérdida y temporización defensiva',
    focoFisico: 'Fuerza excéntrica y potencia de frenado',
    rpeEstimado: 8,
    cargaFosterUA: 720, // 8 * 90
    creadorEmail: 'carlos.mister@abfutbol.com',
    responsableNombre: 'Carlos Morales',
    asistencia: primerEquipoAttendance,
    asistenciaJugadores: 19,
    estado: 'Completada',
    ejercicios: [
      {
        id: 'se-1',
        ejercicioId: 'ex-6',
        fase: 'Calentamiento',
        orden: 1,
        duracionMinutos: 15,
        series: 2,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 60,
        rpeEspecifico: 5,
        notasEspecificas: 'Incidir en tobillos reactivos'
      },
      {
        id: 'se-2',
        ejercicioId: 'ex-1',
        fase: 'Parte Principal',
        orden: 2,
        duracionMinutos: 20,
        series: 3,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 90,
        rpeEspecifico: 7,
        notasEspecificas: 'Presión alta de los 4 defensores'
      }
    ]
  },
  {
    id: 'sess-2',
    microcicloId: 'micro-2',
    fecha: '2026-09-01',
    horaInicio: '10:00',
    duracionMinutos: 60,
    diaRelativoPartido: 'MD+1 (Recuperación)',
    titulo: 'Recuperación Activa y Compensación',
    categoriaEquipo: 'Primer Equipo',
    objetivoPrincipal: 'Descarga metabólica para titulares y circuito condicional para suplentes.',
    lugar: 'Gimnasio y Campo Anexo',
    focoTactico: 'Revisión en vídeo de jugadas',
    focoFisico: 'Movilidad articular y regeneración',
    rpeEstimado: 3,
    cargaFosterUA: 180, // 3 * 60
    creadorEmail: 'david.preparador@abfutbol.com',
    responsableNombre: 'David Lorente',
    asistencia: primerEquipoAttendance,
    asistenciaJugadores: 19,
    estado: 'Completada',
    ejercicios: [
      {
        id: 'se-3',
        ejercicioId: 'ex-6',
        fase: 'Calentamiento',
        orden: 1,
        duracionMinutos: 20,
        series: 1,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 0,
        rpeEspecifico: 3
      }
    ]
  },
  {
    id: 'sess-3',
    microcicloId: 'micro-2',
    fecha: '2026-09-02',
    horaInicio: '09:30',
    duracionMinutos: 85,
    diaRelativoPartido: 'MD-4 (Tensión/Fuerza)',
    titulo: 'Día de Tensión: Duelos y Rondos de Presión',
    categoriaEquipo: 'Primer Equipo',
    objetivoPrincipal: 'Máxima exigencia neuromuscular en espacios reducidos con contragolpes cortos.',
    lugar: 'Campo 1 (Césped natural)',
    focoTactico: 'Fijaciones en zona media y salida rápida',
    focoFisico: 'Fuerza explosiva, cambios de dirección',
    rpeEstimado: 8,
    cargaFosterUA: 680, // 8 * 85
    creadorEmail: 'carlos.mister@abfutbol.com',
    responsableNombre: 'Carlos Morales',
    asistencia: primerEquipoAttendance,
    asistenciaJugadores: 19,
    estado: 'Completada',
    ejercicios: [
      {
        id: 'se-4',
        ejercicioId: 'ex-6',
        fase: 'Calentamiento',
        orden: 1,
        duracionMinutos: 15,
        series: 1,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 60,
        rpeEspecifico: 5
      },
      {
        id: 'se-5',
        ejercicioId: 'ex-1',
        fase: 'Parte Principal',
        orden: 2,
        duracionMinutos: 25,
        series: 4,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 120,
        rpeEspecifico: 8
      }
    ]
  },
  {
    id: 'sess-4',
    microcicloId: 'micro-2',
    fecha: '2026-09-03',
    horaInicio: '10:00',
    duracionMinutos: 90,
    diaRelativoPartido: 'MD-3 (Duración/Resistencia)',
    titulo: 'Día de Duración: Grandes Espacios y Progresión Ofensiva',
    categoriaEquipo: 'Primer Equipo',
    objetivoPrincipal: 'Juego de posición 7v7+3 y partido 8v8 para consolidar la salida ante presión rival.',
    lugar: 'Campo Principal',
    focoTactico: 'Salida de 3 vs 2 puntas y ataque posicional',
    focoFisico: 'Distancia total recorrida y metros a alta velocidad (HSR)',
    rpeEstimado: 8,
    cargaFosterUA: 720, // 8 * 90
    creadorEmail: 'mateo.asistente@abfutbol.com',
    responsableNombre: 'Mateo Silva',
    asistencia: primerEquipoAttendance,
    asistenciaJugadores: 19,
    estado: 'Planificada',
    ejercicios: [
      {
        id: 'se-6',
        ejercicioId: 'ex-6',
        fase: 'Calentamiento',
        orden: 1,
        duracionMinutos: 15,
        series: 1,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 0,
        rpeEspecifico: 5
      },
      {
        id: 'se-7',
        ejercicioId: 'ex-2',
        fase: 'Parte Principal',
        orden: 2,
        duracionMinutos: 30,
        series: 3,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 120,
        rpeEspecifico: 8
      },
      {
        id: 'se-8',
        ejercicioId: 'ex-4',
        fase: 'Parte Principal',
        orden: 3,
        duracionMinutos: 25,
        series: 2,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 120,
        rpeEspecifico: 8
      }
    ]
  },
  {
    id: 'sess-5',
    microcicloId: 'micro-2',
    fecha: '2026-09-05',
    horaInicio: '10:30',
    duracionMinutos: 55,
    diaRelativoPartido: 'MD-1 (Activación/ABP)',
    titulo: 'Pre-Partido: Velocidad Reactiva y Estrategia Balón Parado',
    categoriaEquipo: 'Primer Equipo',
    objetivoPrincipal: 'Afinar automatismos a balón parado (córners y faltas laterales) y frescura mental.',
    lugar: 'Campo 1 (Césped natural)',
    focoTactico: 'Marcaje en zona mixta y variantes de córner ofensivo',
    focoFisico: 'Potencia aláctica y velocidad de reacción',
    rpeEstimado: 4,
    cargaFosterUA: 220, // 4 * 55
    creadorEmail: 'carlos.mister@abfutbol.com',
    responsableNombre: 'Carlos Morales',
    asistencia: primerEquipoAttendance,
    asistenciaJugadores: 19,
    estado: 'Planificada',
    ejercicios: [
      {
        id: 'se-9',
        ejercicioId: 'ex-6',
        fase: 'Calentamiento',
        orden: 1,
        duracionMinutos: 15,
        series: 1,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 60,
        rpeEspecifico: 4
      },
      {
        id: 'se-10',
        ejercicioId: 'ex-5',
        fase: 'Parte Principal',
        orden: 2,
        duracionMinutos: 25,
        series: 6,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 90,
        rpeEspecifico: 4
      }
    ]
  },
  {
    id: 'sess-6',
    microcicloId: 'micro-2',
    fecha: '2026-09-04',
    horaInicio: '18:00',
    duracionMinutos: 80,
    diaRelativoPartido: 'MD-2 (Velocidad/Reactividad)',
    titulo: 'Juvenil A: Transiciones Ofensivas y Definición',
    categoriaEquipo: 'Juvenil A',
    objetivoPrincipal: 'Velocidad de ejecución y finalizaciones en superioridad numérica.',
    lugar: 'Campo 2 (Hierba Artificial)',
    focoTactico: 'Transición rápida y repliegue',
    focoFisico: 'Velocidad y sprint repetido',
    rpeEstimado: 7,
    cargaFosterUA: 560, // 7 * 80
    creadorEmail: 'mateo.asistente@abfutbol.com',
    responsableNombre: 'Mateo Silva',
    asistencia: INITIAL_PLAYERS.filter(p => p.categoria === 'Juvenil A').map(p => ({ jugadorId: p.id, estado: 'Presente' })),
    asistenciaJugadores: 14,
    estado: 'Planificada',
    ejercicios: [
      {
        id: 'se-11',
        ejercicioId: 'ex-3',
        fase: 'Parte Principal',
        orden: 1,
        duracionMinutos: 25,
        series: 3,
        repeticionesPorSerie: 1,
        pausaEntreSeriesSeg: 90,
        rpeEspecifico: 8
      }
    ]
  }
];
