import { createContext, useContext, useState, type ReactNode } from 'react';
import { initialState, type DemoState } from '../domain/model';

const storageKey = 'ajuri-prototype-v1';
function readState(): DemoState {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    if (saved && typeof saved === 'object' && 'profile' in saved && 'checklist' in saved)
      return { ...initialState, ...saved } as DemoState;
  } catch {
    /* Unavailable storage must not prevent using the prototype. */
  }
  return initialState;
}
const DemoContext = createContext<{
  state: DemoState;
  update: (patch: Partial<DemoState>) => void;
  reset: () => void;
} | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readState);
  const persist = (next: DemoState) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* Session remains usable. */
    }
    return next;
  };
  const update = (patch: Partial<DemoState>) =>
    setState((current) => persist({ ...current, ...patch }));
  const reset = () => setState(persist(structuredClone(initialState)));
  return <DemoContext.Provider value={{ state, update, reset }}>{children}</DemoContext.Provider>;
}
// Kept beside its provider to make the state contract discoverable.
// eslint-disable-next-line react-refresh/only-export-components
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo requires DemoProvider');
  return value;
}
