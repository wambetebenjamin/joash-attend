import { kv } from '@vercel/kv';

const globalStore = globalThis as unknown as { __joashStore?: Map<string, unknown> };
const memory: Map<string, unknown> = globalStore.__joashStore ?? new Map<string, unknown>();
globalStore.__joashStore = memory;

export const hasKv = (): boolean =>
  Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export const readStore = async <T>(key: string, fallback: T): Promise<T> => {
  if (hasKv()) {
    try {
      const value = await kv.get<T>(key);
      return value ?? fallback;
    } catch {
      return (memory.get(key) as T) ?? fallback;
    }
  }
  return (memory.get(key) as T) ?? fallback;
};

export const writeStore = async <T>(key: string, value: T): Promise<T> => {
  if (hasKv()) {
    try {
      await kv.set(key, value);
      return value;
    } catch {
      memory.set(key, value);
      return value;
    }
  }
  memory.set(key, value);
  return value;
};
