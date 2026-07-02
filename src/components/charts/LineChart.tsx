"use client";

interface Series {
  name: string;
  color: string; // clase Tailwind stroke-*, p.ej. "stroke-brand-500"
  points: number[]; // un valor por cada entrada de `labels`
}

interface Props {
  labels: (string | number)[];
  series: Series[];
  height?: number;
  /** Indice (0-based) de `labels` a resaltar con una linea vertical, p.ej. el punto de equilibrio. */
  highlightIndex?: number;
  highlightLabel?: string;
  formatValue?: (v: number) => string;
}

const WIDTH = 640;
const PADDING = { top: 16, right: 16, bottom: 28, left: 56 };

/**
 * Grafico de lineas SVG sin dependencias externas. Pensado para series
 * temporales cortas (anios de amortizacion, coste acumulado comprar vs
 * alquilar) donde una libreria de charting completa seria sobrecarga
 * innecesaria para el peso de la pagina (Core Web Vitals).
 */
export function LineChart({ labels, series, height = 280, highlightIndex, highlightLabel, formatValue }: Props) {
  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = height - PADDING.top - PADDING.bottom;

  const allValues = series.flatMap((s) => s.points);
  const maxValue = Math.max(...allValues, 0);
  const minValue = Math.min(0, ...allValues);
  const range = maxValue - minValue || 1;

  const xFor = (i: number) => PADDING.left + (i / Math.max(labels.length - 1, 1)) * innerWidth;
  const yFor = (v: number) => PADDING.top + innerHeight - ((v - minValue) / range) * innerHeight;

  const gridLines = 4;
  const format = formatValue ?? ((v: number) => v.toLocaleString("es-ES"));

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="w-full"
      role="img"
      aria-label={`Grafico de ${series.map((s) => s.name).join(" vs ")}`}
    >
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const value = minValue + (range * i) / gridLines;
        const y = yFor(value);
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
            <text
              x={PADDING.left - 8}
              y={y + 4}
              textAnchor="end"
              className="fill-slate-400 dark:fill-slate-500 text-[10px]"
            >
              {format(value)}
            </text>
          </g>
        );
      })}

      {labels.map((label, i) => {
        if (labels.length > 10 && i % Math.ceil(labels.length / 8) !== 0) return null;
        return (
          <text
            key={i}
            x={xFor(i)}
            y={height - 6}
            textAnchor="middle"
            className="fill-slate-400 dark:fill-slate-500 text-[10px]"
          >
            {label}
          </text>
        );
      })}

      {typeof highlightIndex === "number" && (
        <g>
          <line
            x1={xFor(highlightIndex)}
            x2={xFor(highlightIndex)}
            y1={PADDING.top}
            y2={PADDING.top + innerHeight}
            className="stroke-warning-500"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          {highlightLabel && (
            <text
              x={xFor(highlightIndex)}
              y={PADDING.top - 4}
              textAnchor="middle"
              className="fill-warning-600 dark:fill-warning-500 text-[10px] font-medium"
            >
              {highlightLabel}
            </text>
          )}
        </g>
      )}

      {series.map((s) => (
        <polyline
          key={s.name}
          points={s.points.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ")}
          fill="none"
          className={s.color}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
