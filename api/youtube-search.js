import { withCache } from './_lib/cache.js'

const SONG_LIMIT = 25
const LOOKUP_CONCURRENCY = 4
const CACHE_TTL_MS = 1000 * 60 * 60 * 24

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { artist, songs } = req.query;

  if (!artist || !songs) {
    return res.status(400).json({ error: 'Missing "artist" or "songs" parameter' });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'YOUTUBE_API_KEY not configured' });
  }

  const songList = [...new Set(
    songs
      .split('|')
      .map((song) => song.trim())
      .filter(Boolean)
      .slice(0, SONG_LIMIT)
  )];

  try {
    const results = await mapWithConcurrency(
      songList,
      LOOKUP_CONCURRENCY,
      async (song) => withCache(
        `youtube:${artist.trim().toLowerCase()}:${song.toLowerCase()}`,
        CACHE_TTL_MS,
        async () => {
          const query = `${artist} ${song} official`;
          const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${apiKey}`;
          const response = await fetch(url);

          if (!response.ok) {
            return { song, videoId: null, title: null, error: 'Search failed' };
          }

          const data = await response.json();
          const item = data.items?.[0];

          if (!item) {
            return { song, videoId: null, title: null };
          }

          return {
            song,
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.medium?.url || null,
            channel: item.snippet.channelTitle,
          };
        }
      )
    );

    // Build a YouTube playlist URL from all found videos
    const videoIds = results.filter((r) => r.videoId).map((r) => r.videoId);
    let playlistUrl = null;
    if (videoIds.length > 0) {
      playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`;
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).json({ results, playlistUrl });
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex
      nextIndex += 1
      results[current] = await mapper(items[current], current)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  )

  return results
}
