import { useState } from 'react'
import SearchBar from './components/SearchBar'
import SetlistPicker from './components/SetlistPicker'
import Playlist from './components/Playlist'
import LoadingState from './components/LoadingState'

export default function App() {
  const [step, setStep] = useState('search')
  const [artist, setArtist] = useState(null)
  const [setlists, setSetlists] = useState([])
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState('')
  const [error, setError] = useState(null)

  async function handleSelectArtist(selectedArtist) {
    setArtist(selectedArtist)
    setLoading(true)
    setLoadingPhase('setlists')
    setError(null)

    try {
      const res = await fetch(`/api/setlists?mbid=${encodeURIComponent(selectedArtist.mbid)}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSetlists(data.setlists || [])
      setStep('setlists')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingPhase('')
    }
  }

  async function handleGeneratePlaylist(songs) {
    if (!songs.length) return
    setLoading(true)
    setLoadingPhase('playlist')
    setError(null)
    setStep('generating')

    try {
      const songsParam = songs.join('|')
      const res = await fetch(
        `/api/youtube-search?artist=${encodeURIComponent(artist.name)}&songs=${encodeURIComponent(songsParam)}`
      )
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setPlaylist(data)
      setStep('playlist')
    } catch (err) {
      setError(err.message)
      setStep('setlists')
    } finally {
      setLoading(false)
      setLoadingPhase('')
    }
  }

  function handleReset() {
    setStep('search')
    setArtist(null)
    setSetlists([])
    setPlaylist(null)
    setError(null)
  }

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-accent-dim to-bg text-text">
      <header className="pt-12 pb-8 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end bg-clip-text text-transparent">
          Concert Prep
        </h1>
        <p className="mt-3 text-text-subtle text-lg max-w-md mx-auto">
          Get ready for your next show. We'll find the likely setlist and build you a YouTube playlist to learn every song.
        </p>
      </header>

      {/* Progress steps */}
      <div className="flex justify-center gap-2 mb-10">
        {['Search', 'Setlists', 'Playlist'].map((label, i) => {
          const stepIndex = ['search', 'setlists', 'playlist'].indexOf(step)
          const isActive = i <= stepIndex
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isActive ? 'bg-accent text-text' : 'bg-surface text-text-subtle'
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-sm hidden sm:inline transition-colors ${isActive ? 'text-text' : 'text-text-subtle'}`}>
                {label}
              </span>
              {i < 2 && (
                <div className={`w-8 h-0.5 ${i < stepIndex ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
          )
        })}
=======
  function handleBackToSetlists() {
    setStep('setlists')
    setPlaylist(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-bg text-on-surface font-body relative">
      {/* Asymmetric background panel */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-low opacity-40" />
        <div className="absolute left-10 top-0 w-px h-64 bg-amber/20" />
>>>>>>> origin/main
      </div>

      {/* Top bar */}
      <header className="fixed top-0 z-50 w-full bg-bg flex justify-between items-center px-6 py-4">
        <button onClick={handleReset} className="flex items-center gap-3 group">
          <span className="material-symbols-outlined text-amber text-2xl">theater_comedy</span>
          <h1 className="font-headline font-bold tracking-tight text-on-surface text-xl group-hover:text-amber-light transition-colors">
            Concert Prep
          </h1>
        </button>
        {step !== 'search' && (
          <button
            onClick={handleReset}
            className="font-label text-[10px] tracking-widest uppercase text-on-surface/60 hover:text-amber transition-colors px-2 py-1"
          >
            New Search
          </button>
        )}
      </header>

      <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
        {error && (
<<<<<<< HEAD
          <div className="max-w-xl mx-auto mb-6 p-4 bg-danger/20 border border-danger/30 rounded-xl text-danger text-sm text-center">
=======
          <div className="mb-6 p-4 bg-red-container/20 border-l-2 border-red text-red text-sm">
>>>>>>> origin/main
            {error}
          </div>
        )}

        {step === 'search' && (
<<<<<<< HEAD
          <div>
            <SearchBar onSelectArtist={handleSelectArtist} loading={loading} />
            {loading && (
              <div className="text-center mt-8 text-text-subtle">
                <div className="inline-block w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
                <p className="mt-2">Loading setlists...</p>
              </div>
            )}
          </div>
        )}

        {step === 'setlists' && (
          <div>
            <div className="text-center mb-6">
              <button
                onClick={handleReset}
                className="text-sm text-text-subtle hover:text-text-muted transition-colors"
              >
                &larr; Back to search
              </button>
              <h2 className="text-lg text-text-muted mt-2">
                Showing setlists for <span className="text-text font-semibold">{artist?.name}</span>
              </h2>
            </div>
            <SetlistPicker
              setlists={setlists}
              onGeneratePlaylist={handleGeneratePlaylist}
              loading={loading}
            />
          </div>
=======
          <SearchBar onSelectArtist={handleSelectArtist} loading={loading} />
        )}

        {step === 'setlists' && (
          <SetlistPicker
            artist={artist}
            setlists={setlists}
            onGeneratePlaylist={handleGeneratePlaylist}
            onBack={handleReset}
            loading={loading}
          />
        )}

        {step === 'generating' && (
          <LoadingState artist={artist?.name} />
>>>>>>> origin/main
        )}

        {step === 'playlist' && (
          <Playlist
            artist={artist?.name}
            results={playlist?.results || []}
            playlistUrl={playlist?.playlistUrl}
            onReset={handleReset}
            onBack={handleBackToSetlists}
          />
        )}
      </main>

<<<<<<< HEAD
      <footer className="text-center pb-8 text-text-subtle text-xs">
        Powered by setlist.fm and YouTube
=======
      <footer className="text-center py-8 border-t border-on-surface/10">
        <p className="font-label text-[11px] uppercase text-on-surface/40 tracking-widest">
          Powered by setlist.fm + YouTube
        </p>
>>>>>>> origin/main
      </footer>
    </div>
  )
}
