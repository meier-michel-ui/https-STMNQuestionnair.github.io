import { cn } from "@/lib/utils";
import { usePortfolio, key } from "@/lib/portfolio";
import { NEXT_PREFERENCE, type Indication, type Preference, type SystemCode, SYSTEMS } from "@/lib/indications";
import { useQuestionnaire } from "@/lib/questionnaire-store";
import { Card } from "@/components/ui/card";

function cellClass(p: Preference | undefined, disabled: boolean) {
  if (disabled)
    return "bg-[color:var(--pref-disabled)] text-muted-foreground/40 cursor-not-allowed";
  if (p === "regular")
    return "bg-[color:var(--pref-regular)] text-[color:var(--pref-regular-foreground)] shadow-sm";
  if (p === "occasional")
    return "bg-[color:var(--pref-occasional)] text-[color:var(--pref-occasional-foreground)]";
  if (p === "not_preferred")
    return "bg-muted text-muted-foreground line-through";
  return "bg-[color:var(--pref-none)] text-[color:var(--pref-none-foreground)] hover:bg-accent hover:scale-[1.04]";
}

function cellLabel(p: Preference | undefined) {
  if (p === "regular") return "✓✓";
  if (p === "occasional") return "✓";
  if (p === "not_preferred") return "✕";
  return "";
}

export function ImplantMatrix({ indication, system }: { indication: Indication; system: SystemCode }) {
  const { data } = usePortfolio();
  const cfg = data?.[system];
  const getSel = useQuestionnaire((s) => s.getSelection);
  const setSel = useQuestionnaire((s) => s.setSelection);

  if (!cfg) return <div className="h-48 animate-pulse rounded-lg bg-muted" />;

  const cycle = (d: number, l: number) => {
    const current = getSel(indication, system, d, l) ?? "none";
    const next = NEXT_PREFERENCE[current];
    setSel(indication, system, d, l, next === "none" ? null : (next as Preference));
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-1.5">
        <thead>
          <tr>
            <th className="w-20 text-left text-xs font-medium text-muted-foreground px-2">
              Ø / L (mm)
            </th>
            {cfg.lengths.map((l) => (
              <th key={l} className="w-12 text-center text-xs font-medium text-muted-foreground">
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cfg.diameters.map((d) => (
            <tr key={d}>
              <td className="text-sm font-medium text-foreground pr-2">Ø {d}</td>
              {cfg.lengths.map((l) => {
                const disabled = !cfg.valid.has(key(d, l));
                const sel = getSel(indication, system, d, l);
                return (
                  <td key={l}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => cycle(d, l)}
                      title={disabled ? "Not available" : `${system} Ø${d} × ${l}mm`}
                      className={cn(
                        "h-11 w-11 rounded-md text-xs font-semibold transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-ring",
                        cellClass(sel, disabled),
                      )}
                    >
                      {cellLabel(sel)}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SystemMatrices({ indication }: { indication: Indication }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {SYSTEMS.map((s) => (
        <Card key={s} className="p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-lg font-semibold tracking-tight">{s}</h3>
            <span className="text-xs text-muted-foreground">Click to cycle preference</span>
          </div>
          <ImplantMatrix indication={indication} system={s} />
        </Card>
      ))}
    </div>
  );
}

export function PreferenceLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-2">
        <span className="h-4 w-4 rounded bg-[color:var(--pref-regular)]" /> Regularly use
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-4 w-4 rounded bg-[color:var(--pref-occasional)]" /> Occasionally
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-4 w-4 rounded border bg-muted" /> Would not use
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-4 w-4 rounded bg-[color:var(--pref-disabled)]" /> Not available
      </span>
    </div>
  );
}
