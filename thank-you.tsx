import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SystemCode } from "./indications";

export interface SystemConfig {
  code: SystemCode;
  diameters: number[];
  lengths: number[];
  valid: Set<string>; // "d|l"
}

export function key(d: number, l: number) {
  return `${d}|${l}`;
}

async function loadPortfolio(): Promise<Record<SystemCode, SystemConfig>> {
  const [{ data: diam }, { data: len }, { data: combos }] = await Promise.all([
    supabase.from("implant_diameters").select("system_code,diameter,sort_order").order("sort_order"),
    supabase.from("implant_lengths").select("system_code,length,sort_order").order("sort_order"),
    supabase.from("implant_valid_combinations").select("system_code,diameter,length"),
  ]);

  const out: Record<string, SystemConfig> = {};
  for (const s of ["BLX", "BLC", "TLX", "TLC"] as SystemCode[]) {
    out[s] = { code: s, diameters: [], lengths: [], valid: new Set() };
  }
  (diam ?? []).forEach((r: any) => out[r.system_code]?.diameters.push(Number(r.diameter)));
  (len ?? []).forEach((r: any) => out[r.system_code]?.lengths.push(Number(r.length)));
  (combos ?? []).forEach((r: any) =>
    out[r.system_code]?.valid.add(key(Number(r.diameter), Number(r.length))),
  );
  return out as Record<SystemCode, SystemConfig>;
}

export function usePortfolio() {
  return useQuery({ queryKey: ["portfolio"], queryFn: loadPortfolio, staleTime: 5 * 60_000 });
}
