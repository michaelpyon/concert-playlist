import { useState } from 'react'
import { saveSetlistToYouTube } from '../lib/youtube'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function Playlist({ artist, results, playlistUrl, onReset, onBack }) {
  const found = results.filter((r) => r.videoId)
  const notFound = results.filter((r) => !r.videoId)
  const videoIds = found.map((r) => r.videoId)

  // Save-to-YouTube state
  const [saveState, setSaveState] = useState('idle') // idle | saving | done | error
  const [savePhase, setSavePhase] = useState('')      // auth | creating | adding
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 })
  const [savedPlaylistUrl, setSavedPlaylistUrl] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [saveStats, setSaveStats] = useState(null)

  async function handleSaveToYouTube() {
    if (!CLIENT_ID) {
      setSaveError('OAuth not configured. Missing VITE_GOOGLE_CLIENT_ID.')
      setSaveState('error')
      return
    }

    setSaveState('saving')
    setSaveError(null)

    try {
      const result = await saveSetlistToYouTube(
        CLIENT_ID,
        artist,
        videoIds,
        (phase, current, total) => {
          setSavePhase(phase)
          setSaveProgress({ current, total })
        }
      )

      setSavedPlaylistUrl(result.playlistUrl)
      setSaveStats({ added: result.addedCount, failed: result.failedCount })
      setSaveState('done')
    } catch (err) {
      setSaveError(err.message)
      setSaveState('error')
    }
  }

  function getSaveButtonContent() {
    switch (saveState) {
      case 'saving':
        if (savePhase === 'auth') return 'Signing in...'
        if (savePhase === 'creating') return 'Creating playlist...'
        if (savePhase === 'adding') return `Adding songs (${saveProgress.current}/${saveProgress.total})...`
        return 'Saving...'
      case 'done':
        return 'Saved!'
      case 'error':
        return 'Try Again'
      default:
        return 'Save to YouTube'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <section className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <button
            onClick={onBack}
            className="font-label text-on-surface-faint text-xs uppercase tracking-widest hover:text-amber transition-colors mb-4 block"
          >
            ← Back to setlists
          </button>
          <span className="font-label text-amber text-xs tracking-[0.3em] uppercase mb-4 block">
            Stage 03: Ready
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter text-on-surface leading-none">
            The <span className="text-amber">Setlist</span>
          </h2>
          <p className="mt-3 text-on-surface-muted text-sm">
            {found.length} of {results.length} songs found on YouTube
            {artist && <> for <span className="text-on-surface font-medium">{artist}</span></>}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Save to YouTube (primary action) */}
          {saveState === 'done' && savedPlaylistUrl ? (
            <a
              href={savedPlaylistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber text-bg font-label font-bold uppercase tracking-widest text-xs px-8 py-4 flex items-center gap-3 hover:bg-amber-light transition-colors"
            >
              <span className="material-symbols-outlined text-xl">playlist_add_check</span>
              Open Playlist on YouTube
            </a>
          ) : (
            <button
              onClick={handleSaveToYouTube}
              disabled={saveState === 'saving' || videoIds.length === 0}
              className="bg-amber text-bg font-label font-bold uppercase tracking-widest text-xs px-8 py-4 flex items-center gap-3 hover:bg-amber-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saveState === 'saving' ? (
                <div className="w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin shrink-0" />
              ) : (
                <span className="material-symbols-outlined text-xl">
                  {saveState === 'error' ? 'refresh' : 'playlist_add'}
                </span>
              )}
              {getSaveButtonContent()}
            </button>
          )}

          {/* Play All (secondary, temporary URL fallback) */}
          {playlistUrl && (
            <a
              href={savedPlaylistUrl || playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-high text-on-surface font-label font-bold uppercase tracking-widest text-xs px-8 py-4 flex items-center gap-3 hover:bg-surface-bright transition-colors"
            >
              <span className="material-symbols-outlined text-xl">play_circle</span>
              Play All
            </a>
          )}
        </div>
      </section>

      {/* Save status messages */}
      {saveState === 'error' && saveError && (
        <div className="mb-6 p-4 bg-red-container/20 border-l-2 border-red text-red text-sm">
          {saveError}
        </div>
      )}

      {saveState === 'done' && saveStats && (
        <div className="mb-6 p-4 bg-amber/10 border-l-2 border-amber text-amber-light text-sm flex items-center gap-3">
          <span className="material-symbols-outlined">check_circle</span>
          <span>
            Playlist saved! {saveStats.added} songs added
            {saveStats.failed > 0 && `, ${saveStats.failed} failed`}.
            Named <strong>"Concert Prep: {artist}"</strong>.
          </span>
        </div>
      )}

      {/* Song list */}
      <div className="space-y-2">
        {found.map((item, i) => (
          <a
            key={item.videoId}
            href={`https://www.youtube.com/watch?v=${item.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-surface hover:bg-surface-high transition-colors group"
          >
            {/* Track number */}
            <span className="font-label text-xs font-bold text-on-surface-faint w-6 text-right shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Thumbnail */}
            {item.thumbnail && (
              <div className="relative w-24 h-16 bg-surface-lowest shrink-0 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-amber/10" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-2xl drop-shadow-lg">play_arrow</span>
                </div>
              </div>
            )}

            {/* Song info */}
            <div className="flex-grow min-w-0">
              <h3 className="font-headline text-lg font-bold leading-none truncate mb-1 group-hover:text-amber-light transition-colors">
                {item.song}
              </h3>
              <p className="font-body text-sm text-on-surface-muted truncate">
                {item.channel || artist}
              </p>
            </div>

            {/* Arrow */}
            <span className="material-symbols-outlined text-on-surface-faint opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              open_in_new
            </span>
          </a>
        ))}
      </div>

      {/* Not found songs */}
      {notFound.length > 0 && (
        <div className="mt-8 p-5 bg-surface-low border-l-4 border-on-surface-faint">
          <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-faint mb-3">
            Not found on YouTube
          </h3>
          <div className="flex flex-wrap gap-2">
            {notFound.map((item, i) => (
              <span
                key={i}
                className="font-label text-[10px] bg-surface-lowest text-on-surface-faint px-2 py-1 uppercase tracking-wider"
              >
                {item.song}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Start over */}
      <div className="mt-12 text-center">
        <button
          onClick={onReset}
          className="font-label text-amber text-xs uppercase tracking-[0.3em] hover:text-amber-light transition-colors inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          Start Over
        </button>
      </div>
    </div>
  )
}
