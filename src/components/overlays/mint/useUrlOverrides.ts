import { useEffect, useState } from 'react';

type Spec = Record<string, 'string' | 'number'>;
type Result<S extends Spec> = { [K in keyof S]?: S[K] extends 'number' ? number : string };

function readOverrides<S extends Spec>(spec: S): Result<S> {
  const out: Result<S> = {};
  const search = new URLSearchParams(window.location.search);
  for (const key in spec) {
    const raw = search.get(key);
    if (raw === null || raw === '') continue;
    (out as Record<string, string | number>)[key] = spec[key] === 'number' ? Number(raw) : raw;
  }
  return out;
}

/** Lets an OBS Browser Source URL override a screen's text/numbers via query params
 * (e.g. `?segundos=600&juego=Valorant`) without touching code or pushing changes.
 * Astro pre-renders these pages statically, so the request's query string only ever
 * reaches the browser — this reads it client-side after mount. */
export function useUrlOverrides<S extends Spec>(spec: S): Result<S> {
  const [overrides, setOverrides] = useState<Result<S>>({});

  useEffect(() => {
    setOverrides(readOverrides(spec));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return overrides;
}
