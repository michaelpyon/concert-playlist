/**
 * YouTube OAuth + Playlist Creation
 *
 * Uses Google Identity Services (GIS) to get a one-time access token
 * in the browser, then creates a named YouTube playlist and adds videos.
 * No server-side auth, no refresh tokens, no database.
 */

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'
const YOUTUBE_SCOPE = 'https://www.googleapis.com/auth/youtube'

/**
 * Request an OAuth access token via Google Identity Services popup.
 * Returns a Promise that resolves with the access token string.
 */
export function requestYouTubeToken(clientId) {
  return new Promise((resolve, reject) => {
    // GIS might not be loaded yet if the script tag hasn't finished
    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services not loaded. Try refreshing the page.'))
      return
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: YOUTUBE_SCOPE,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error))
          return
        }
        resolve(response.access_token)
      },
      error_callback: (err) => {
        reject(new Error(err.message || 'OAuth popup was closed or blocked'))
      },
    })

    client.requestAccessToken()
  })
}

/**
 * Create a new YouTube playlist. Returns { playlistId, playlistUrl }.
 */
export async function createPlaylist(accessToken, title, description) {
  const res = await fetch(`${YOUTUBE_API_BASE}/playlists?part=snippet,status`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      snippet: {
        title,
        description,
      },
      status: {
        privacyStatus: 'unlisted',
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Failed to create playlist (HTTP ${res.status})`)
  }

  const data = await res.json()
  return {
    playlistId: data.id,
    playlistUrl: `https://www.youtube.com/playlist?list=${data.id}`,
  }
}

/**
 * Add videos to a playlist one at a time.
 * Calls onProgress(current, total) after each video.
 * Returns { addedCount, failedCount, failedSongs }.
 */
export async function addVideosToPlaylist(accessToken, playlistId, videoIds, onProgress) {
  let addedCount = 0
  let failedCount = 0
  const failedSongs = []

  for (let i = 0; i < videoIds.length; i++) {
    try {
      const res = await fetch(`${YOUTUBE_API_BASE}/playlistItems?part=snippet`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            playlistId,
            resourceId: {
              kind: 'youtube#video',
              videoId: videoIds[i],
            },
            position: i,
          },
        }),
      })

      if (res.ok) {
        addedCount++
      } else {
        failedCount++
        failedSongs.push(videoIds[i])
      }
    } catch {
      failedCount++
      failedSongs.push(videoIds[i])
    }

    onProgress?.(i + 1, videoIds.length)
  }

  return { addedCount, failedCount, failedSongs }
}

/**
 * Full orchestrator: OAuth → create playlist → add videos.
 * Returns { playlistUrl, addedCount, failedCount }.
 */
export async function saveSetlistToYouTube(clientId, artistName, videoIds, onProgress) {
  // Step 1: Get OAuth token
  onProgress?.('auth', 0, videoIds.length)
  const accessToken = await requestYouTubeToken(clientId)

  // Step 2: Create the playlist
  onProgress?.('creating', 0, videoIds.length)
  const title = `Concert Prep: ${artistName}`
  const description = `Setlist playlist for ${artistName}, built with Concert Prep (concert.michaelpyon.com)`
  const { playlistId, playlistUrl } = await createPlaylist(accessToken, title, description)

  // Step 3: Add videos
  const { addedCount, failedCount } = await addVideosToPlaylist(
    accessToken,
    playlistId,
    videoIds,
    (current, total) => onProgress?.('adding', current, total)
  )

  return { playlistUrl, addedCount, failedCount }
}
