import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  Trash2,
  Download,
  Save,
  PenTool,
  Move,
  Circle,
  HelpCircle
} from 'lucide-react';

interface TacticalBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCroquis: (croquisDataUrl: string) => void;
  initialCroquisUrl?: string;
}

type BoardTool = 
  | 'select'
  | 'player_red'
  | 'player_blue'
  | 'player_yellow'
  | 'ball'
  | 'cone'
  | 'goal'
  | 'pass_line'
  | 'move_line'
  | 'zone';

interface BoardElement {
  id: string;
  type: 'player' | 'ball' | 'cone' | 'goal';
  x: number;
  y: number;
  color?: string;
  label?: string;
}

interface BoardDrawing {
  id: string;
  tool: 'pass_line' | 'move_line' | 'zone';
  points: { x: number; y: number }[];
  color: string;
}

export const TacticalBoardModal: React.FC<TacticalBoardModalProps> = ({
  isOpen,
  onClose,
  onSaveCroquis,
  initialCroquisUrl
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<BoardTool>('player_red');
  const [elements, setElements] = useState<BoardElement[]>([]);
  const [drawings, setDrawings] = useState<BoardDrawing[]>([]);
  const [history, setHistory] = useState<{ elements: BoardElement[]; drawings: BoardDrawing[] }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [playerNumber, setPlayerNumber] = useState<number>(4);

  // Initialize pitch
  useEffect(() => {
    if (isOpen) {
      // Default elements on pitch
      if (elements.length === 0) {
        setElements([
          { id: '1', type: 'player', x: 260, y: 160, color: '#ef4444', label: '7' },
          { id: '2', type: 'player', x: 380, y: 160, color: '#ef4444', label: '9' },
          { id: '3', type: 'player', x: 320, y: 250, color: '#ef4444', label: '10' },
          { id: '4', type: 'player', x: 320, y: 130, color: '#3b82f6', label: '4' },
          { id: '5', type: 'player', x: 420, y: 230, color: '#3b82f6', label: '5' },
          { id: '6', type: 'player', x: 200, y: 210, color: '#eab308', label: 'C' },
          { id: '7', type: 'ball', x: 280, y: 180 },
          { id: '8', type: 'cone', x: 180, y: 80 },
          { id: '9', type: 'cone', x: 480, y: 80 },
          { id: '10', type: 'cone', x: 180, y: 320 },
          { id: '11', type: 'cone', x: 480, y: 320 }
        ]);
        setDrawings([
          {
            id: 'd1',
            tool: 'pass_line',
            points: [{ x: 280, y: 180 }, { x: 370, y: 165 }],
            color: '#facc15'
          }
        ]);
      }
    }
  }, [isOpen]);

  // Redraw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw Field Background (Stripes)
    ctx.fillStyle = '#14412f';
    ctx.fillRect(0, 0, width, height);

    const stripeWidth = 50;
    ctx.fillStyle = '#103726';
    for (let x = 0; x < width; x += stripeWidth * 2) {
      ctx.fillRect(x, 0, stripeWidth, height);
    }

    // 2. Draw Pitch Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 3;

    // Outer border
    const margin = 20;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // Halfway line
    const midX = width / 2;
    ctx.beginPath();
    ctx.moveTo(midX, margin);
    ctx.lineTo(midX, height - margin);
    ctx.stroke();

    // Center circle & spot
    ctx.beginPath();
    ctx.arc(midX, height / 2, 55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(midX, height / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Penalty Boxes (Left & Right)
    const boxWidth = 90;
    const boxHeight = 170;
    const boxY = (height - boxHeight) / 2;
    ctx.strokeRect(margin, boxY, boxWidth, boxHeight);
    ctx.strokeRect(width - margin - boxWidth, boxY, boxWidth, boxHeight);

    // Goal Areas
    const smallBoxWidth = 35;
    const smallBoxHeight = 80;
    const smallBoxY = (height - smallBoxHeight) / 2;
    ctx.strokeRect(margin, smallBoxY, smallBoxWidth, smallBoxHeight);
    ctx.strokeRect(width - margin - smallBoxWidth, smallBoxY, smallBoxWidth, smallBoxHeight);

    // Penalty Arcs
    ctx.beginPath();
    ctx.arc(margin + 75, height / 2, 35, -0.6, 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width - margin - 75, height / 2, 35, Math.PI - 0.6, Math.PI + 0.6);
    ctx.stroke();

    // 3. Draw Completed Drawings (Lines, Arrows, Zones)
    drawings.forEach((d) => {
      if (d.points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = d.color;
      ctx.lineWidth = d.tool === 'pass_line' ? 3 : 3.5;
      ctx.fillStyle = d.color;

      if (d.tool === 'pass_line') {
        ctx.setLineDash([8, 6]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(d.points[0].x, d.points[0].y);
      for (let i = 1; i < d.points.length; i++) {
        ctx.lineTo(d.points[i].x, d.points[i].y);
      }
      ctx.stroke();

      // Draw Arrow Head at end of line
      const last = d.points[d.points.length - 1];
      const prev = d.points[d.points.length - 2];
      const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
      const headlen = 12;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(
        last.x - headlen * Math.cos(angle - Math.PI / 6),
        last.y - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        last.x - headlen * Math.cos(angle + Math.PI / 6),
        last.y - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // 4. Draw Active Line in progress
    if (isDrawing && currentPoints.length > 1) {
      ctx.save();
      ctx.strokeStyle = activeTool === 'pass_line' ? '#facc15' : '#ffffff';
      ctx.lineWidth = 3;
      if (activeTool === 'pass_line') ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 5. Draw Elements (Players, Ball, Cones, Goals)
    elements.forEach((el) => {
      ctx.save();
      if (el.type === 'player') {
        const radius = 15;
        // Outer glow/shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(el.x, el.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = el.color || '#ef4444';
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = el.id === selectedElementId ? '#38bdf8' : '#ffffff';
        ctx.stroke();

        // Label / Number
        if (el.label) {
          ctx.fillStyle = el.color === '#eab308' ? '#000000' : '#ffffff';
          ctx.font = 'bold 11px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(el.label, el.x, el.y);
        }
      } else if (el.type === 'ball') {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(el.x, el.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();
        // Inner pentagon marker
        ctx.beginPath();
        ctx.arc(el.x, el.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
      } else if (el.type === 'cone') {
        // Orange Cone
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(el.x, el.y - 12);
        ctx.lineTo(el.x + 8, el.y + 8);
        ctx.lineTo(el.x - 8, el.y + 8);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (el.type === 'goal') {
        // Mini Portería
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.strokeRect(el.x - 16, el.y - 8, 32, 16);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(el.x - 16, el.y - 8, 32, 16);
      }
      ctx.restore();
    });
  }, [elements, drawings, isDrawing, currentPoints, selectedElementId, activeTool]);

  // Coordinate helper
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Interactions: Mouse / Touch down
  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    // Save history for undo
    setHistory(prev => [...prev.slice(-15), { elements: [...elements], drawings: [...drawings] }]);

    if (activeTool === 'select') {
      // Find clicked element
      const clicked = elements.find(el => Math.hypot(el.x - x, el.y - y) < 22);
      if (clicked) {
        setSelectedElementId(clicked.id);
        setIsDrawing(true);
      } else {
        setSelectedElementId(null);
      }
    } else if (activeTool === 'pass_line' || activeTool === 'move_line') {
      setIsDrawing(true);
      setCurrentPoints([{ x, y }]);
    } else {
      // Placement tools
      if (activeTool === 'player_red') {
        const newEl: BoardElement = {
          id: `el-${Date.now()}`,
          type: 'player',
          x,
          y,
          color: '#ef4444',
          label: playerNumber.toString()
        };
        setElements(prev => [...prev, newEl]);
        setPlayerNumber(p => (p % 11) + 1);
      } else if (activeTool === 'player_blue') {
        const newEl: BoardElement = {
          id: `el-${Date.now()}`,
          type: 'player',
          x,
          y,
          color: '#3b82f6',
          label: playerNumber.toString()
        };
        setElements(prev => [...prev, newEl]);
        setPlayerNumber(p => (p % 11) + 1);
      } else if (activeTool === 'player_yellow') {
        const newEl: BoardElement = {
          id: `el-${Date.now()}`,
          type: 'player',
          x,
          y,
          color: '#eab308',
          label: 'C'
        };
        setElements(prev => [...prev, newEl]);
      } else if (activeTool === 'ball') {
        setElements(prev => [...prev, { id: `el-${Date.now()}`, type: 'ball', x, y }]);
      } else if (activeTool === 'cone') {
        setElements(prev => [...prev, { id: `el-${Date.now()}`, type: 'cone', x, y }]);
      } else if (activeTool === 'goal') {
        setElements(prev => [...prev, { id: `el-${Date.now()}`, type: 'goal', x, y }]);
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);

    if (activeTool === 'select' && selectedElementId) {
      setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, x, y } : el));
    } else if (activeTool === 'pass_line' || activeTool === 'move_line') {
      setCurrentPoints(prev => [...prev, { x, y }]);
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if ((activeTool === 'pass_line' || activeTool === 'move_line') && currentPoints.length > 1) {
      const newDrawing: BoardDrawing = {
        id: `draw-${Date.now()}`,
        tool: activeTool,
        points: currentPoints,
        color: activeTool === 'pass_line' ? '#facc15' : '#ffffff'
      };
      setDrawings(prev => [...prev, newDrawing]);
      setCurrentPoints([]);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const last = history[history.length - 1];
      setElements(last.elements);
      setDrawings(last.drawings);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (confirm('¿Limpiar todos los elementos del campo?')) {
      setHistory(prev => [...prev, { elements: [...elements], drawings: [...drawings] }]);
      setElements([]);
      setDrawings([]);
    }
  };

  const handleSaveCroquis = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveCroquis(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Pizarra Táctica 2D Interactiva</h3>
              <p className="text-[11px] text-slate-400">Dibuja y diseña tareas tácticas sobre el campo reglamentario</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
              title="Deshacer última acción"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/30 transition-colors"
              title="Limpiar campo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-3 py-2 border-b border-slate-800 bg-slate-850 overflow-x-auto flex items-center gap-1.5 scrollbar-none text-xs">
          
          <button
            onClick={() => setActiveTool('select')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'select'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>Mover</span>
          </button>

          <span className="w-px h-5 bg-slate-700 mx-1" />

          {/* Red Player */}
          <button
            onClick={() => setActiveTool('player_red')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'player_red'
                ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400'
                : 'bg-slate-800 text-red-400 hover:bg-slate-750'
            }`}
          >
            <Circle className="w-3.5 h-3.5 fill-red-500" />
            <span>Rojo</span>
          </button>

          {/* Blue Player */}
          <button
            onClick={() => setActiveTool('player_blue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'player_blue'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                : 'bg-slate-800 text-blue-400 hover:bg-slate-750'
            }`}
          >
            <Circle className="w-3.5 h-3.5 fill-blue-500" />
            <span>Azul</span>
          </button>

          {/* Yellow Neutral Comodín */}
          <button
            onClick={() => setActiveTool('player_yellow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'player_yellow'
                ? 'bg-amber-500 text-black shadow-md ring-2 ring-amber-300'
                : 'bg-slate-800 text-amber-300 hover:bg-slate-750'
            }`}
          >
            <Circle className="w-3.5 h-3.5 fill-amber-400" />
            <span>Comodín</span>
          </button>

          {/* Ball */}
          <button
            onClick={() => setActiveTool('ball')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'ball'
                ? 'bg-slate-100 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-white hover:bg-slate-750'
            }`}
          >
            <span>⚽</span>
            <span>Balón</span>
          </button>

          {/* Cone */}
          <button
            onClick={() => setActiveTool('cone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'cone'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-800 text-orange-400 hover:bg-slate-750'
            }`}
          >
            <span>▲</span>
            <span>Cono</span>
          </button>

          {/* Mini Goal */}
          <button
            onClick={() => setActiveTool('goal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'goal'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-purple-400 hover:bg-slate-750'
            }`}
          >
            <span>🥅</span>
            <span>Portería</span>
          </button>

          <span className="w-px h-5 bg-slate-700 mx-1" />

          {/* Pass Arrow */}
          <button
            onClick={() => setActiveTool('pass_line')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'pass_line'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-amber-400 hover:bg-slate-750'
            }`}
          >
            <span>⇢</span>
            <span>Pase</span>
          </button>

          {/* Movement Arrow */}
          <button
            onClick={() => setActiveTool('move_line')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'move_line'
                ? 'bg-white text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-750'
            }`}
          >
            <span>➔</span>
            <span>Carrera</span>
          </button>

        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-2 sm:p-4 bg-slate-950 flex items-center justify-center overflow-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-emerald-800/60 max-w-full">
            <canvas
              ref={canvasRef}
              width={700}
              height={440}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              className="cursor-crosshair max-w-full h-auto block select-none touch-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Toca sobre el campo para colocar fichas o arrastra para trazar líneas de pase.</span>
            <span className="sm:hidden">Toca para añadir o trazar flechas.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveCroquis}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/40 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Croquis en la Tarea</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
