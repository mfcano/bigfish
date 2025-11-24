export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function getServerImage(key: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/images/${encodeURIComponent(key)}`);
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
    return null;
  } catch (e) {
    console.error('getServerImage error', e);
    return null;
  }
}

export default function useImages() {
  return { getServerImage };
}
