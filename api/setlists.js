import { withCache } from './_lib/cache.js'

const CACHE_TTL_MS = 1000 * 60 * 60 * 6

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { mbid } = req.query;

  if (!mbid) {
    return res.status(400).json({ error: 'Missing query parameter "mbid"' });
  }

  const apiKey = process.env.SETLISTFM_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'SETLISTFM_API_KEY not configured' });
  }

  try {
    const setlists = await withCache(
      `setlists:${mbid}`,
      CACHE_TTL_MS,
      async () => {
        const response = await fetch(
          `https://api.setlist.fm/rest/1.0/artist/${encodeURIComponent(mbid)}/setlists?p=1`,
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
        return (data.setlist || []).slice(0, 10).map((s) => ({
          id: s.id,
          eventDate: s.eventDate,
          venue: s.venue?.name || 'Unknown venue',
          city: s.venue?.city?.name || '',
          country: s.venue?.city?.country?.name || '',
          tour: s.tour?.name || '',
          songs: (s.sets?.set || []).flatMap((set) =>
            (set.song || []).map((song) => ({
              name: song.name,
              tape: song.tape || false,
              cover: song.cover?.name || null,
            }))
          ),
        }));
      }
    );

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400')
    return res.status(200).json({ setlists });
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
