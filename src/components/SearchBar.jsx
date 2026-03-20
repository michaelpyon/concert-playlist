import { useState, useRef, useEffect } from 'react'

export default function SearchBar({ onSelectArtist, loading }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)
  const inputRef = useRef(null)

  // Auto-focus the search input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim() || query.trim().length < 2) return

    setSearching(true)
    setSuggestions([])

    try {
      const res = await fetch(`/api/search-artist?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setSuggestions(data.artists?.length ? data.artists : [])
    } catch {
      setSuggestions([])
    } finally {
      setSearching(false)
    }
  }

  function selectArtist(artist) {
    setSuggestions([])
    setQuery(artist.name)
    onSelectArtist(artist)
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-start">
      {/* Editorial headline */}
      <div className="w-full mb-12">
        <span className="font-label text-amber text-xs tracking-[0.3em] uppercase mb-4 block">
          Stage 01: Identification
        </span>
        <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-on-surface leading-none max-w-2xl">
          Who are you{' '}
          <br />
          <span className="text-amber">seeing?</span>
        </h2>
      </div>

      {/* Search input container */}
      <div className="w-full relative">
        {/* Decorative corner */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-surface-variant opacity-20 pointer-events-none" />

        <form onSubmit={handleSearch}>
          <div className="relative bg-surface border-b-2 border-amber shadow-2xl">
            <div className="flex items-center gap-4 px-6 py-8">
              <span className="material-symbols-outlined text-amber text-3xl">search</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Who are you seeing?"
                className="bg-transparent border-none w-full text-2xl md:text-3xl font-headline placeholder:text-on-surface-muted/30 text-on-surface outline-none focus:ring-0"
                disabled={loading}
              />
              {query.trim().length >= 2 && (
                <button
                  type="submit"
                  disabled={searching || loading}
                  className="shrink-0 bg-amber text-bg font-label font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-amber-light disabled:opacity-50 transition-colors"
                >
                  {searching ? 'Searching...' : 'Search'}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Results dropdown */}
        {suggestions.length > 0 && (
          <div className="mt-2 w-full bg-surface-high shadow-2xl overflow-hidden">
            <div className="p-2 space-y-1">
              {suggestions.map((artist) => (
                <button
                  key={artist.mbid}
                  onClick={() => selectArtist(artist)}
                  className="flex items-center justify-between w-full p-4 bg-surface-low hover:bg-surface-variant transition-colors cursor-pointer group text-left"
                >
                  <div className="flex flex-col">
                    <span className="font-headline text-xl text-on-surface group-hover:text-amber-light transition-colors">
                      {artist.name}
                    </span>
                    {artist.disambiguation && (
                      <span className="font-label text-[10px] px-2 py-0.5 bg-surface-lowest text-on-surface-muted/80 uppercase tracking-wider mt-1 inline-block w-fit">
                        {artist.disambiguation}
                      </span>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-on-surface-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>

            {/* Dropdown footer */}
            <div className="bg-surface-lowest px-6 py-3 border-t border-on-surface/5 flex justify-between items-center">
              <span className="font-label text-[10px] text-on-surface-muted uppercase tracking-widest">
                {suggestions.length} matches found
              </span>
            </div>
          </div>
        )}

        {/* Empty state after search */}
        {!searching && suggestions.length === 0 && query.trim().length >= 2 && (
          <div className="mt-4 text-on-surface-faint font-label text-sm text-center py-4">
            Press Enter or click Search to find artists
          </div>
        )}

        {/* Loading indicator for search */}
        {searching && (
          <div className="mt-4 flex items-center justify-center gap-3 text-on-surface-faint py-4">
            <div className="w-4 h-4 border-2 border-on-surface/20 border-t-amber rounded-full animate-spin" />
            <span className="font-label text-sm uppercase tracking-widest">Searching setlist.fm...</span>
          </div>
        )}

        {/* Loading indicator for fetching setlists after selection */}
        {loading && (
          <div className="mt-8 flex items-center justify-center gap-3 text-on-surface-faint py-4">
            <div className="w-4 h-4 border-2 border-on-surface/20 border-t-amber rounded-full animate-spin" />
            <span className="font-label text-sm uppercase tracking-widest">Loading setlists...</span>
          </div>
        )}
      </div>
    </div>
  )
}
