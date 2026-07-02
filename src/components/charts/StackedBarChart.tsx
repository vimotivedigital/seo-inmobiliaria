"use client";

interface Segment {
  name: string;
  colorClassName: string; // clase Tailwind fill-*, p.ej. "fill-brand-500"
  values: number[]; // un valor por cada entrada de `labels`
}

interface Props {
  labels: (string | number)[];
  segments: Segment[];
  height?: number;
  formatValue?: (v: number) => string;
}

const WIDTH = 640;
const PADDING = { top: 12, right: 16, bottom: 28, left: 56 };

/** Grafico de barras apiladas SVG sin dependencias, para desglosar dos o
 * mas magnitudes por periodo (p.ej. intereses vs capital amortizado). */
export function StackedBarChart({ labels, segments, height = 240, formatValue }: Props) {
  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = height - PADDING.top - PADDING.bottom;

  const totals = labels.map((_, i) => segments.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));
  const maxTotal = Math.max(...totals, 1);

  const barCount = labels.length;
  const barSlot = innerWidth / barCount;
  const barWidth = Math.min(36, barSlot * 0.6);

  const format = formatValue ?? ((v: number) => v.toLocaleString("es-ES"));
  const gridLines = 4;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="w-full"
      role="img"
      aria-label={`Grafico de barras: ${segments.map((s) => s.name).join(" y ")} por periodo`}
    >
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const value = (maxTotal * i) / gridLines;
        const y = PADDING.top + innerHeight - (value / maxTotal) * innerHeight;
        return (
          <g key={i}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={y}
              y2={y}
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth={1}
            />
            <text x={PADDING.left - 8} y={y + 4} textAnchor="end" className="fill-slate-400 dark:fill-slate-500 text-[10px]">
              {format(value)}
            </text>
          </g>
        );
      })}

      {labels.map((label, i) => {
        if (labels.length > 10 && i % Math.ceil(labels.length / 8) !== 0) return null;
        const x = PADDING.left + i * barSlot + barSlot / 2;
        let yOffset = PADDING.top + innerHeight;

        return (
          <g key={i}>
            {segments.map((s) => {
              const value = s.values[i] ?? 0;
              const barHeight = (value / maxTotal) * innerHeight;
              yOffset -= barHeight;
              return (
                <rect
                  key={s.name}
                  x={x - barWidth / 2}
                  y={yOffset}
                  width={barWidth}
                  height={barHeight}
                  className={s.colorClassName}
                  rx={1.5}
                />
              );
            })}
            <text x={x} y={height - 6} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px]">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
