import { withCache } from './_lib/cache.js'

const CACHE_TTL_MS = 1000 * 60 * 60 * 6

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter "q"' });
  }

  if (q.trim().length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  const apiKey = process.env.SETLISTFM_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'SETLISTFM_API_KEY not configured' });
  }

  try {
    const artists = await withCache(
      `artist-search:${q.trim().toLowerCase()}`,
      CACHE_TTL_MS,
      async () => {
        const response = await fetch(
          `https://api.setlist.fm/rest/1.0/search/artists?artistName=${encodeURIComponent(q)}&p=1&sort=relevance`,
          {
            headers: {
              Accept: 'application/json',
              'x-api-key': apiKey,
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `setlist.fm returned HTTP ${response.status}`);
        }

        const data = await response.json();
        return (data.artist || []).map((a) => ({
          mbid: a.mbid,
          name: a.name,
          disambiguation: a.disambiguation || '',
          sortName: a.sortName,
        }));
      }
    );

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400')
    return res.status(200).json({ artists });
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
