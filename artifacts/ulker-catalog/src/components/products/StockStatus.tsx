import { StockStatus as StockStatusType } from "@/data/products";

interface StockStatusProps {
  status: StockStatusType;
  size?: "sm" | "md" | "lg";
  showUpdated?: boolean;
}

const config = {
  in_stock: {
    label: "In Stock",
    sublabel: "Available",
    updated: "Updated just now",
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
    ring: "ring-green-500/30",
  },
  limited: {
    label: "Limited Stock",
    sublabel: "Only few cartons available",
    updated: "Updated 2 hours ago",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
    ring: "ring-amber-500/30",
  },
  out_of_stock: {
    label: "Out of Stock",
    sublabel: "Currently unavailable",
    updated: "Updated today",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
    ring: "ring-red-500/30",
  },
};

export default function StockStatus({ status, size = "md", showUpdated = false }: StockStatusProps) {
  const cfg = config[status];

  if (size === "sm") {
    return (
      <span
        data-testid={`status-stock-${status}`}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.badge}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div
        data-testid={`status-stock-${status}`}
        className={`flex items-start gap-3 p-4 rounded-2xl border ${cfg.badge} ring-2 ${cfg.ring}`}
      >
        <div className="relative mt-0.5 shrink-0">
          <span className={`block w-3 h-3 rounded-full ${cfg.dot}`} />
          <span className={`absolute inset-0 rounded-full ${cfg.dot} opacity-40 animate-ping`} />
        </div>
        <div>
          <p className="font-semibold text-sm">{cfg.label}</p>
          <p className="text-xs opacity-80 mt-0.5">{cfg.sublabel}</p>
          {showUpdated && (
            <p className="text-xs opacity-60 mt-1">{cfg.updated}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <span
      data-testid={`status-stock-${status}`}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${cfg.badge}`}
    >
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
