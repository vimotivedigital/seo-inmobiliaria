interface LegendItem {
  name: string;
  colorClassName: string; // clase Tailwind bg-*, p.ej. "bg-brand-500"
}

export function ChartLegend({ items }: { items: LegendItem[] }) {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
      {items.map((item) => (
        <span key={item.name} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${item.colorClassName}`} />
          {item.name}
        </span>
      ))}
    </div>
  );
}
