/**
 * A key-value namespace held in memory, for a test to put where a binding goes. It does only what the Worker's code asks of one
 * (text or bytes in, the same back), so it is stood in for `KVNamespace` once, here, and nowhere else.
 */
export function testKvNamespace(): KVNamespace {
  const items = new Map<string, string | ArrayBuffer>();
  const namespace = {
    get: async (key: string): Promise<string | ArrayBuffer | null> => {
      return items.get(key) ?? null;
    },
    put: async (key: string, value: string | ArrayBuffer): Promise<void> => {
      items.set(key, value);
    },
  };

  return namespace as unknown as KVNamespace;
}
