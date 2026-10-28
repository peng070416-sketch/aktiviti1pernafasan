import React from 'react';
import { ZONE_COORDINATES, ORGAN_DATA } from '../data/respiratoryData';
import { X, Check, AlertCircle } from 'lucide-react';

interface AnatomicalDiagramProps {
  answers: Record<number, number>; // zoneId -> organId
  selectedCardId: number | null;
  checked: boolean;
  onZoneClick: (zoneId: number) => void;
  onRemoveCard: (organId: number) => void;
  onDropCard: (organId: number, zoneId: number) => void;
}

export const AnatomicalDiagram: React.FC<AnatomicalDiagramProps> = ({
  answers,
  selectedCardId,
  checked,
  onZoneClick,
  onRemoveCard,
  onDropCard,
}) => {
  const [hoveredZone, setHoveredZone] = React.useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent, zoneId: number) => {
    e.preventDefault();
    setHoveredZone(zoneId);
  };

  const handleDragLeave = () => {
    setHoveredZone(null);
  };

  const handleDrop = (e: React.DragEvent, zoneId: number) => {
    e.preventDefault();
    setHoveredZone(null);
    const organIdStr = e.dataTransfer.getData('text/plain');
    const organId = parseInt(organIdStr, 10);
    if (!isNaN(organId)) {
      onDropCard(organId, zoneId);
    }
  };

  return (
    <div className="relative w-full max-w-[530px] aspect-[4/5] bg-white rounded-2xl overflow-hidden border-2 border-slate-300 shadow-md">
      {/* High-Contrast Anatomical SVG */}
      <svg
        className="w-full h-full absolute inset-0 select-none pointer-events-none"
        viewBox="0 0 500 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body Silhouette */}
        <path
          d="M250 40 C 215 40 190 65 190 100 C 190 120 198 135 208 145 C 205 160 205 180 200 195 C 160 215 130 250 125 300 L 120 540 L 380 540 L 375 300 C 370 250 340 215 300 195 C 295 180 295 160 292 145 C 302 135 310 120 310 100 C 310 65 285 40 250 40 Z"
          fill="#F8FAFC"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Head Detail (Facial Profile Soft Lines) */}
        <path
          d="M 282 95 Q 295 98 288 112 Q 278 118 268 116"
          fill="none"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* 1. Mulut / Hidung Pathway */}
        <path
          d="M 276 100 L 250 102 L 250 145"
          stroke="#94A3B8"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="278" cy="100" r="4.5" fill="#0F172A" />

        {/* 2. Trakea (Straight Tube with Cartilage Rings) */}
        <rect
          x="241"
          y="145"
          width="18"
          height="90"
          rx="4"
          fill="#E2E8F0"
          stroke="#0F172A"
          strokeWidth="2.5"
        />
        <line x1="242" y1="160" x2="258" y2="160" stroke="#0F172A" strokeWidth="2" />
        <line x1="242" y1="175" x2="258" y2="175" stroke="#0F172A" strokeWidth="2" />
        <line x1="242" y1="190" x2="258" y2="190" stroke="#0F172A" strokeWidth="2" />
        <line x1="242" y1="205" x2="258" y2="205" stroke="#0F172A" strokeWidth="2" />
        <line x1="242" y1="220" x2="258" y2="220" stroke="#0F172A" strokeWidth="2" />

        {/* 5. Paru-paru (Lungs with Soft Pink Color and Maroon Border) */}
        {/* Left Lung (viewer's left) */}
        <path
          d="M 235 240 C 185 240 160 270 160 350 C 160 410 190 430 235 415 Z"
          fill="#FFE4E6"
          stroke="#991B1B"
          strokeWidth="2.5"
        />
        {/* Right Lung (viewer's right) */}
        <path
          d="M 265 240 C 315 240 340 270 340 350 C 340 410 310 430 265 415 Z"
          fill="#FFE4E6"
          stroke="#991B1B"
          strokeWidth="2.5"
        />

        {/* 3. Bronkus (Main Branches) */}
        <path d="M 250 235 L 210 275" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 250 235 L 290 275" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />

        {/* 4. Bronkiolus (Sub-branches inside lungs) */}
        <path
          d="M 210 275 L 185 305 M 210 275 L 195 330 M 210 275 L 225 320"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 185 305 L 175 325 M 195 330 L 190 355 M 225 320 L 225 350"
          stroke="#334155"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 290 275 L 315 305 M 290 275 L 305 330 M 290 275 L 275 320"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 315 305 L 325 325 M 305 330 L 310 355 M 275 320 L 275 350"
          stroke="#334155"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* 7. Diafragma (Curved Dome Muscle below lungs) */}
        <path
          d="M 150 440 Q 250 400 350 440"
          stroke="#15803D"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 150 440 Q 250 400 350 440 L 350 455 Q 250 415 150 455 Z"
          fill="#DCFCE7"
          opacity="0.6"
        />

        {/* 6. Alveolus (Inverted Inset Zoom Circle) */}
        <line
          x1="310"
          y1="355"
          x2="410"
          y2="445"
          stroke="#475569"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <circle cx="415" cy="455" r="38" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
        {/* Simple cluster of alveoli sacs */}
        <circle cx="405" cy="445" r="10" fill="#FECDD3" stroke="#991B1B" strokeWidth="1.5" />
        <circle cx="422" cy="443" r="11" fill="#FECDD3" stroke="#991B1B" strokeWidth="1.5" />
        <circle cx="410" cy="460" r="11" fill="#FECDD3" stroke="#991B1B" strokeWidth="1.5" />
        <circle cx="426" cy="462" r="10" fill="#FECDD3" stroke="#991B1B" strokeWidth="1.5" />

        {/* BOLD DARK GUIDELINE POINTERS TO ORGANS */}
        {/* 1. Mulut / Hidung -> Drop Zone 1 (Right Top) */}
        <polyline
          points="278,100 320,100 320,60 310,60"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="278" cy="100" r="4.5" fill="#0F172A" />

        {/* 2. Trakea -> Drop Zone 2 (Left Upper) */}
        <polyline
          points="241,180 180,180 180,165 195,165"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="241" cy="180" r="4.5" fill="#0F172A" />

        {/* 3. Bronkus -> Drop Zone 3 (Right Middle-Upper) */}
        <polyline
          points="280,265 370,265 370,275 310,275"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="280" cy="265" r="4.5" fill="#0F172A" />

        {/* 4. Bronkiolus -> Drop Zone 4 (Left Middle) */}
        <polyline
          points="190,340 130,340 130,296 195,296"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="190" cy="340" r="4.5" fill="#0F172A" />

        {/* 5. Paru-paru -> Drop Zone 5 (Left Lower) */}
        <polyline
          points="200,380 120,380 120,380 195,380"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="200" cy="380" r="4.5" fill="#0F172A" />

        {/* 6. Alveolus -> Drop Zone 6 (Right Lower) */}
        <polyline
          points="415,493 415,396 310,396"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="415" cy="493" r="4.5" fill="#0F172A" />

        {/* 7. Diafragma -> Drop Zone 7 (Left Bottom) */}
        <polyline
          points="250,422 170,422 170,480 195,480"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="250" cy="422" r="4.5" fill="#0F172A" />
      </svg>

      {/* Interactive Drop Zones */}
      {([1, 2, 3, 4, 5, 6, 7] as const).map((zoneId) => {
        const coord = ZONE_COORDINATES[zoneId];
        const assignedOrganId = answers[zoneId];
        const assignedOrgan = ORGAN_DATA.find((o) => o.id === assignedOrganId);
        const isCorrect = checked && assignedOrganId === zoneId;
        const isWrong = checked && assignedOrganId !== undefined && assignedOrganId !== zoneId;
        const isHovered = hoveredZone === zoneId;
        const isSelectedCandidate = selectedCardId !== null && !assignedOrganId;

        // Custom style for position
        const style: React.CSSProperties = {
          top: coord.top,
          ...(coord.left ? { left: coord.left } : {}),
          ...(coord.right ? { right: coord.right } : {}),
        };

        let borderClass = 'border-dashed border-slate-400 bg-white/95 text-slate-600 hover:border-blue-600';
        if (isHovered) {
          borderClass = 'border-solid border-amber-500 bg-amber-100 scale-105';
        } else if (isCorrect) {
          borderClass = 'border-solid border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm';
        } else if (isWrong) {
          borderClass = 'border-solid border-rose-500 bg-rose-50 text-rose-900 shadow-sm';
        } else if (assignedOrgan) {
          borderClass = 'border-solid border-sky-400 bg-sky-50 text-sky-950 shadow-sm';
        } else if (isSelectedCandidate) {
          borderClass = 'border-dashed border-sky-400 bg-sky-50/70 animate-pulse';
        }

        return (
          <div
            key={zoneId}
            style={style}
            onClick={() => onZoneClick(zoneId)}
            onDragOver={(e) => handleDragOver(e, zoneId)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, zoneId)}
            className={`absolute w-[38%] h-[8.5%] border-2 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-150 cursor-pointer select-none p-1 z-10 ${borderClass}`}
            title={`Klik untuk padankan ${coord.name}`}
          >
            {assignedOrgan ? (
              <div className="flex items-center justify-between w-full h-full px-2 py-0.5 rounded-lg bg-white/90 shadow-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  {checked && (
                    isCorrect ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                    )
                  )}
                  <span className="truncate text-[11px] sm:text-xs font-bold text-slate-800">
                    {assignedOrgan.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCard(assignedOrgan.id);
                  }}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-100 p-0.5 rounded transition shrink-0 ml-1"
                  title="Keluarkan kad"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 font-semibold">
                <span>{coord.label}</span>
                {isSelectedCandidate && (
                  <span className="text-[10px] text-sky-600 font-normal hidden sm:inline">
                    (Ketik di sini)
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
