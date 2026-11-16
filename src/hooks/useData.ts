import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getDb } from '../db/client';
import type { Db } from '../db/types';
import { useDataVersion } from '../store/dataVersion';
import i18n from '../i18n';

type State<T> = { data: T | null; loading: boolean; error: string | null };

/** Runs a read query, re-running whenever any write happens (or deps change). */
export function useData<T>(query: (db: Db) => Promise<T>, deps: unknown[] = []): State<T> & { retry: () => void } {
  const version = useDataVersion((s) => s.version);
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  useEffect(() => {
    let alive = true;
    getDb()
      .then(query)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((e) => alive && setState((s) => ({ ...s, loading: false, error: String(e) })));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, tick, ...deps]);
  return { ...state, retry: () => setTick((x) => x + 1) };
}

/** Runs a write and refreshes all readers. Shows an alert on failure. */
export async function write<T>(op: (db: Db) => Promise<T>): Promise<T | undefined> {
  try {
    const db = await getDb();
    const result = await op(db);
    useDataVersion.getState().bump();
    return result;
  } catch (e) {
    console.warn('Database write failed', e);
    Alert.alert(i18n.t('errors.title'), i18n.t('errors.save'));
    return undefined;
  }
}
