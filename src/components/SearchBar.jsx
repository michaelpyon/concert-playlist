import { useState } from 'react';

export default function SearchBar({ onSelectArtist, loading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setSuggestions([]);

    try {
      const res = await fetch(`/api/search-artist?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.artists?.length) {
        setSuggestions(data.artists);
      } else {
        setSuggestions([]);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  }

  function selectArtist(artist) {
    setSuggestions([]);
    setQuery(artist.name);
    onSelectArtist(artist);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an artist..."
          className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={searching || loading || !query.trim()}
          className="px-6 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-text font-semibold transition-colors"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="mt-2 bg-surface/95 backdrop-blur border border-border rounded-xl overflow-hidden shadow-2xl">
          {suggestions.map((artist) => (
            <li key={artist.mbid}>
              <button
                onClick={() => selectArtist(artist)}
                className="w-full text-left px-5 py-3 hover:bg-surface-hover transition-colors text-text"
              >
                <span className="font-medium">{artist.name}</span>
                {artist.disambiguation && (
                  <span className="text-text-subtle text-sm ml-2">
                    ({artist.disambiguation})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
