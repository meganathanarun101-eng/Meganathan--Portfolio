import { createServerFn } from '@tanstack/react-start';
import type { PortfolioDataStore } from './portfolioDataService';

// In-memory server-side store cache
let inMemoryServerStore: PortfolioDataStore | null = null;
let inMemoryLastUpdated: string = '';

// Helper: Vercel KV / Upstash Redis
async function getFromVercelKv(url: string, token: string): Promise<PortfolioDataStore | null> {
  try {
    const endpoint = `${url.replace(/\/$/, '')}/get/meganathan_portfolio_store`;
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.result) return null;
    return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
  } catch (err) {
    console.error('[CloudSync] Vercel KV read error:', err);
    return null;
  }
}

async function saveToVercelKv(url: string, token: string, data: PortfolioDataStore): Promise<boolean> {
  try {
    const endpoint = `${url.replace(/\/$/, '')}/set/meganathan_portfolio_store`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error('[CloudSync] Vercel KV write error:', err);
    return false;
  }
}

function cleanBinId(raw: string): string {
  if (!raw) return '';
  return raw.trim().replace(/^https?:\/\/[^\/]+\/(?:app\/bins\/|v3\/b\/)?/, '').replace(/\/.*$/, '').trim();
}

// Helper: JSONBin.io (Free Cloud JSON Store)
async function getFromJsonBin(binId: string, apiKey: string): Promise<PortfolioDataStore | null> {
  try {
    const id = cleanBinId(binId);
    const res = await fetch(`https://api.jsonbin.io/v3/b/${id}/latest`, {
      headers: { 'X-Master-Key': apiKey.trim() },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.record as PortfolioDataStore;
  } catch (err) {
    console.error('[CloudSync] JSONBin read error:', err);
    return null;
  }
}

async function saveToJsonBin(binId: string, apiKey: string, data: PortfolioDataStore): Promise<boolean> {
  try {
    const id = cleanBinId(binId);
    const res = await fetch(`https://api.jsonbin.io/v3/b/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey.trim(),
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error('[CloudSync] JSONBin write error:', err);
    return false;
  }
}

export async function createJsonBin(apiKey: string, data: PortfolioDataStore): Promise<string | null> {
  try {
    const res = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey.trim(),
        'X-Bin-Name': 'Meganathan Portfolio',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error('[CloudSync] JSONBin create error status:', res.status, await res.text());
      return null;
    }
    const json = await res.json();
    return json.metadata?.id || null;
  } catch (err) {
    console.error('[CloudSync] JSONBin create error:', err);
    return null;
  }
}

export const autoCreateJsonBinFn = createServerFn({ method: 'POST' })
  .validator((data: { apiKey: string; store: PortfolioDataStore }) => data)
  .handler(async ({ data }) => {
    const binId = await createJsonBin(data.apiKey, data.store);
    if (binId) {
      return { success: true, binId };
    }
    return { success: false, error: 'Failed to create bin with this API Key. Please check the Master Key.' };
  });

// Helper: Supabase REST API
async function getFromSupabase(url: string, anonKey: string): Promise<PortfolioDataStore | null> {
  try {
    const endpoint = `${url.replace(/\/$/, '')}/rest/v1/portfolio_store?id=eq.default&select=data,lastUpdated`;
    const res = await fetch(endpoint, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const list = await res.json();
    if (Array.isArray(list) && list.length > 0) {
      return list[0].data as PortfolioDataStore;
    }
    return null;
  } catch (err) {
    console.error('[CloudSync] Supabase read error:', err);
    return null;
  }
}

async function saveToSupabase(url: string, anonKey: string, data: PortfolioDataStore): Promise<boolean> {
  try {
    const endpoint = `${url.replace(/\/$/, '')}/rest/v1/portfolio_store`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: 'default',
        data,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[CloudSync] Supabase write error:', err);
    return false;
  }
}

export const getPortfolioServerDataFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    // 1. Check Vercel KV / Upstash environment variables
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (kvUrl && kvToken) {
      const kvData = await getFromVercelKv(kvUrl, kvToken);
      if (kvData) {
        return {
          success: true,
          store: kvData,
          lastUpdated: kvData.lastUpdated || new Date().toISOString(),
          source: 'vercel-kv',
        };
      }
    }

    // 2. Check JSONBin environment variables
    const jsonBinId = process.env.JSONBIN_BIN_ID;
    const jsonBinKey = process.env.JSONBIN_API_KEY;
    if (jsonBinId && jsonBinKey) {
      const binData = await getFromJsonBin(jsonBinId, jsonBinKey);
      if (binData) {
        return {
          success: true,
          store: binData,
          lastUpdated: binData.lastUpdated || new Date().toISOString(),
          source: 'jsonbin',
        };
      }
    }

    // 3. Check Supabase environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const sbData = await getFromSupabase(supabaseUrl, supabaseKey);
      if (sbData) {
        return {
          success: true,
          store: sbData,
          lastUpdated: sbData.lastUpdated || new Date().toISOString(),
          source: 'supabase',
        };
      }
    }

    // 4. Check if in-memory store has custom cloudSync settings saved
    if (inMemoryServerStore?.settings?.cloudSync) {
      const cfg = inMemoryServerStore.settings.cloudSync;
      if (cfg.provider === 'vercel-kv' && cfg.vercelKvUrl && cfg.vercelKvToken) {
        const kvData = await getFromVercelKv(cfg.vercelKvUrl, cfg.vercelKvToken);
        if (kvData) return { success: true, store: kvData, lastUpdated: kvData.lastUpdated, source: 'vercel-kv' };
      }
      if (cfg.provider === 'jsonbin' && cfg.jsonbinBinId && cfg.jsonbinApiKey) {
        const binData = await getFromJsonBin(cfg.jsonbinBinId, cfg.jsonbinApiKey);
        if (binData) return { success: true, store: binData, lastUpdated: binData.lastUpdated, source: 'jsonbin' };
      }
      if (cfg.provider === 'supabase' && cfg.supabaseUrl && cfg.supabaseAnonKey) {
        const sbData = await getFromSupabase(cfg.supabaseUrl, cfg.supabaseAnonKey);
        if (sbData) return { success: true, store: sbData, lastUpdated: sbData.lastUpdated, source: 'supabase' };
      }
    }

    // 5. If Node environment, attempt to read from data/portfolio-store.json
    if (typeof process !== 'undefined' && process.versions?.node) {
      try {
        const fs = await import('node:fs/promises');
        const path = await import('node:path');
        const filePath = path.join(process.cwd(), 'data', 'portfolio-store.json');
        const raw = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          success: true,
          store: parsed as PortfolioDataStore,
          lastUpdated: parsed.lastUpdated || inMemoryLastUpdated || new Date().toISOString(),
          source: 'disk',
        };
      } catch {
        // file doesn't exist or read-only filesystem
      }
    }

    // 6. In-memory fallback
    return {
      success: true,
      store: inMemoryServerStore,
      lastUpdated: inMemoryLastUpdated,
      source: 'memory',
    };
  });

export const savePortfolioServerDataFn = createServerFn({ method: 'POST' })
  .validator((data: { store: PortfolioDataStore; lastUpdated?: string }) => data)
  .handler(async ({ data }) => {
    const timestamp = data.lastUpdated || new Date().toISOString();
    inMemoryServerStore = { ...data.store, lastUpdated: timestamp };
    inMemoryLastUpdated = timestamp;

    let cloudSaved = false;

    // 1. Try Vercel KV / Upstash
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || data.store.settings?.cloudSync?.vercelKvUrl;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || data.store.settings?.cloudSync?.vercelKvToken;
    if (kvUrl && kvToken) {
      cloudSaved = await saveToVercelKv(kvUrl, kvToken, inMemoryServerStore);
    }

    // 2. Try JSONBin
    const jsonBinId = process.env.JSONBIN_BIN_ID || data.store.settings?.cloudSync?.jsonbinBinId;
    const jsonBinKey = process.env.JSONBIN_API_KEY || data.store.settings?.cloudSync?.jsonbinApiKey;
    if (jsonBinId && jsonBinKey && !cloudSaved) {
      cloudSaved = await saveToJsonBin(jsonBinId, jsonBinKey, inMemoryServerStore);
    }

    // 3. Try Supabase
    const supabaseUrl = process.env.SUPABASE_URL || data.store.settings?.cloudSync?.supabaseUrl;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || data.store.settings?.cloudSync?.supabaseAnonKey;
    if (supabaseUrl && supabaseKey && !cloudSaved) {
      cloudSaved = await saveToSupabase(supabaseUrl, supabaseKey, inMemoryServerStore);
    }

    // 4. In Node environment, attempt disk persistence
    if (typeof process !== 'undefined' && process.versions?.node) {
      try {
        const fs = await import('node:fs/promises');
        const path = await import('node:path');
        const dir = path.join(process.cwd(), 'data');
        await fs.mkdir(dir, { recursive: true });
        const filePath = path.join(dir, 'portfolio-store.json');
        await fs.writeFile(filePath, JSON.stringify(inMemoryServerStore, null, 2), 'utf-8');
      } catch (err) {
        // May be on read-only serverless environment
      }
    }

    return {
      success: true,
      lastUpdated: timestamp,
      cloudSaved,
    };
  });
