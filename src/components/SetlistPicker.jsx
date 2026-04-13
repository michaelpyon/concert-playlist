import { useState } from 'react'

export default function SetlistPicker({ artist, setlists, onGeneratePlaylist, onBack, loading }) {
  const [selected, setSelected] = useState(new Set())

  function toggleSetlist(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    if (selected.size === setlists.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(setlists.map((s) => s.id)))
    }
  }

  function handleGenerate() {
    const chosen = setlists.filter((s) => selected.has(s.id))
    const songMap = new Map()
    chosen.forEach((setlist) => {
      setlist.songs.forEach((song) => {
        if (!song.tape && song.name) {
          const key = song.name.toLowerCase()
          if (!songMap.has(key)) {
            songMap.set(key, song.name)
          }
        }
      })
    })
    onGeneratePlaylist([...songMap.values()])
  }

  // Count unique songs across selected setlists
  const uniqueSongCount = (() => {
    const chosen = setlists.filter((s) => selected.has(s.id))
    const songMap = new Map()
    chosen.forEach((setlist) => {
      setlist.songs.forEach((song) => {
        if (!song.tape && song.name) {
          songMap.set(song.name.toLowerCase(), true)
        }
      })
    })
    return songMap.size
  })()

  if (!setlists.length) {
    return (
<<<<<<< HEAD
      <div className="text-center text-text-subtle py-8">
        No recent setlists found for this artist.
=======
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-on-surface-faint text-5xl mb-4 block">music_off</span>
        <p className="text-on-surface-faint font-label uppercase tracking-widest text-sm">
          No recent setlists found for this artist.
        </p>
        <button
          onClick={onBack}
          className="mt-6 font-label text-amber text-xs uppercase tracking-widest hover:text-amber-light transition-colors"
        >
          ← Back to search
        </button>
>>>>>>> origin/main
      </div>
    )
  }

  return (
<<<<<<< HEAD
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-text">Recent Setlists</h2>
        <div className="flex gap-3">
          <button
            onClick={selectAll}
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            {selected.size === setlists.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={handleGenerate}
            disabled={selected.size === 0 || loading}
            className="px-5 py-2 bg-success hover:bg-success/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-text font-semibold text-sm transition-colors"
          >
            {loading ? 'Generating...' : `Generate Playlist (${selected.size})`}
          </button>
        </div>
=======
    <div className="w-full max-w-4xl mx-auto">
      {/* Section header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="font-label text-on-surface-faint text-xs uppercase tracking-widest hover:text-amber transition-colors mb-4 block"
        >
          ← Back to search
        </button>
        <span className="font-label text-amber text-xs tracking-[0.3em] uppercase mb-4 block">
          Stage 02: Selection
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter text-on-surface leading-none">
          Pick the <span className="text-amber">shows</span>
        </h2>
        <p className="mt-3 text-on-surface-muted text-sm max-w-lg">
          Showing recent setlists for <span className="text-on-surface font-medium">{artist?.name}</span>.
          Select the shows you want to practice, and we'll build your playlist from the unique songs across all of them.
        </p>
>>>>>>> origin/main
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={selectAll}
          className="font-label text-xs uppercase tracking-widest text-on-surface-muted hover:text-amber transition-colors"
        >
          {selected.size === setlists.length ? 'Deselect All' : 'Select All'}
        </button>

        <button
          onClick={handleGenerate}
          disabled={selected.size === 0 || loading}
          className="bg-amber text-bg font-label font-bold uppercase tracking-widest text-xs px-8 py-4 flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-light transition-colors"
        >
          <span className="material-symbols-outlined text-xl">play_circle</span>
          {loading
            ? 'Generating...'
            : `Build Playlist${selected.size > 0 ? ` · ${uniqueSongCount} songs` : ''}`
          }
        </button>
      </div>

      {/* Setlist cards */}
      <div className="space-y-3">
<<<<<<< HEAD
        {setlists.map((setlist) => (
          <button
            key={setlist.id}
            onClick={() => toggleSetlist(setlist.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selected.has(setlist.id)
                ? 'bg-accent-dim border-accent/50'
                : 'bg-surface border-border hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-text font-medium">
                  {setlist.venue}
                </div>
                <div className="text-text-subtle text-sm">
                  {setlist.city}{setlist.country ? `, ${setlist.country}` : ''} &middot; {setlist.eventDate}
                </div>
                {setlist.tour && (
                  <div className="text-accent text-sm mt-1">{setlist.tour}</div>
                )}
              </div>
              <div className="text-text-subtle text-sm">
                {setlist.songs.length} songs
              </div>
            </div>
            {selected.has(setlist.id) && setlist.songs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {setlist.songs.filter(s => !s.tape).map((song, i) => (
                    <span key={i} className="text-xs bg-surface-hover text-text-muted px-2 py-1 rounded-md">
                      {song.name}
                    </span>
                  ))}
=======
        {setlists.map((setlist) => {
          const isSelected = selected.has(setlist.id)
          const songCount = setlist.songs.filter(s => !s.tape).length
          return (
            <button
              key={setlist.id}
              onClick={() => toggleSetlist(setlist.id)}
              className={`w-full text-left p-5 transition-all relative group ${
                isSelected
                  ? 'bg-surface border-l-4 border-amber'
                  : 'bg-surface-low border-l-4 border-transparent hover:bg-surface'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    {/* Selection indicator */}
                    <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber border-amber'
                        : 'border-on-surface-faint'
                    }`}>
                      {isSelected && (
                        <span className="material-symbols-outlined text-bg text-sm">check</span>
                      )}
                    </div>
                    <h3 className={`font-headline text-lg font-bold transition-colors ${
                      isSelected ? 'text-on-surface' : 'text-on-surface group-hover:text-amber-light'
                    }`}>
                      {setlist.venue}
                    </h3>
                  </div>
                  <div className="ml-8 text-on-surface-muted text-sm">
                    {setlist.city}{setlist.country ? `, ${setlist.country}` : ''} · {setlist.eventDate}
                  </div>
                  {setlist.tour && (
                    <div className="ml-8 mt-1">
                      <span className="font-label text-[10px] px-2 py-0.5 bg-surface-lowest text-amber uppercase tracking-wider">
                        {setlist.tour}
                      </span>
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <span className={`font-label text-sm ${isSelected ? 'text-amber' : 'text-on-surface-faint'}`}>
                    {songCount} songs
                  </span>
>>>>>>> origin/main
                </div>
              </div>

              {/* Expanded song list when selected */}
              {isSelected && songCount > 0 && (
                <div className="mt-4 ml-8 pt-3 border-t border-on-surface/10">
                  <div className="flex flex-wrap gap-2">
                    {setlist.songs.filter(s => !s.tape).map((song, i) => (
                      <span
                        key={i}
                        className="font-label text-[10px] bg-surface-lowest text-on-surface-muted px-2 py-1 uppercase tracking-wider"
                      >
                        {song.name}
                        {song.cover && (
                          <span className="text-amber ml-1">★</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
