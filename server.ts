import { create } from "zustand";
import type { Indication, Preference, SystemCode } from "./indications";

export interface ClinicianInfo {
  full_name: string;
  email?: string;
  country?: string;
  years_of_experience?: string;
}

// keyed by `${indication}|${system}|${d}|${l}` -> Preference
type SelMap = Record<string, Preference>;
type CommentMap = Record<string, string>;
type SuggestionMap = Record<string, string>;

interface State {
  clinician: ClinicianInfo | null;
  selections: SelMap;
  comments: CommentMap;
  suggestions: SuggestionMap;
  setClinician: (c: ClinicianInfo) => void;
  setSelection: (ind: Indication, sys: SystemCode, d: number, l: number, p: Preference | null) => void;
  getSelection: (ind: Indication, sys: SystemCode, d: number, l: number) => Preference | undefined;
  clearIndication: (ind: Indication) => void;
  setComment: (ind: Indication, c: string) => void;
  setSuggestion: (ind: Indication, s: string) => void;
  reset: () => void;
}

const cellKey = (i: string, s: string, d: number, l: number) => `${i}|${s}|${d}|${l}`;

export const useQuestionnaire = create<State>((set, get) => ({
  clinician: null,
  selections: {},
  comments: {},
  suggestions: {},
  setClinician: (c) => set({ clinician: c }),
  setSelection: (ind, sys, d, l, p) => {
    const k = cellKey(ind, sys, d, l);
    const next = { ...get().selections };
    if (p === null) delete next[k];
    else next[k] = p;
    set({ selections: next });
  },
  getSelection: (ind, sys, d, l) => get().selections[cellKey(ind, sys, d, l)],
  clearIndication: (ind) => {
    const sel = { ...get().selections };
    Object.keys(sel).forEach((k) => k.startsWith(ind + "|") && delete sel[k]);
    const com = { ...get().comments }; delete com[ind];
    const sug = { ...get().suggestions }; delete sug[ind];
    set({ selections: sel, comments: com, suggestions: sug });
  },
  setComment: (ind, c) => set({ comments: { ...get().comments, [ind]: c } }),
  setSuggestion: (ind, s) => set({ suggestions: { ...get().suggestions, [ind]: s } }),
  reset: () => set({ clinician: null, selections: {}, comments: {}, suggestions: {} }),
}));

export { cellKey };
