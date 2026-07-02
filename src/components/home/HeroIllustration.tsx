/**
 * Ilustracion abstracta de un skyline residencial, dibujada a mano en SVG
 * (sin activos de imagen externos) para dar peso visual a la home sin
 * anadir peticiones de red ni JS extra.
 */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 640 220"
      className="mx-auto w-full max-w-2xl"
      role="img"
      aria-label="Ilustracion de un skyline de edificios residenciales"
    >
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" className="text-brand-100 dark:text-brand-950" />
          <stop offset="100%" stopColor="currentColor" className="text-white dark:text-slate-950" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="640" height="220" fill="url(#skyGradient)" />

      {/* Sol/circulo decorativo */}
      <circle cx="540" cy="50" r="34" className="fill-warning-300 dark:fill-warning-500/30" />

      {/* Skyline de edificios */}
      <g className="fill-brand-200 dark:fill-brand-900/50">
        <rect x="40" y="120" width="60" height="90" rx="4" />
        <rect x="520" y="100" width="70" height="110" rx="4" />
      </g>
      <g className="fill-brand-300 dark:fill-brand-800/60">
        <rect x="110" y="90" width="70" height="120" rx="4" />
        <rect x="450" y="130" width="60" height="80" rx="4" />
      </g>
      <g className="fill-brand-500 dark:fill-brand-700">
        <rect x="190" y="60" width="90" height="150" rx="6" />
        <rect x="360" y="80" width="80" height="130" rx="6" />
      </g>
      <g className="fill-brand-600 dark:fill-brand-600">
        <rect x="290" y="40" width="80" height="170" rx="6" />
      </g>

      {/* Ventanas */}
      <g className="fill-white/70 dark:fill-white/20">
        {[0, 1, 2, 3].map((row) =>
          [0, 1].map((col) => (
            <rect key={`${row}-${col}`} x={305 + col * 30} y={60 + row * 28} width="18" height="18" rx="2" />
          ))
        )}
        {[0, 1, 2].map((row) =>
          [0, 1].map((col) => (
            <rect key={`b-${row}-${col}`} x={205 + col * 35} y={80 + row * 32} width="20" height="20" rx="2" />
          ))
        )}
      </g>

      {/* Suelo */}
      <rect x="0" y="205" width="640" height="15" className="fill-brand-700 dark:fill-brand-950" />
    </svg>
  );
}
