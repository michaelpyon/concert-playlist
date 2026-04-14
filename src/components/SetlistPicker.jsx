import { useState } from 'react';

export default function SetlistPicker({ setlists, onGeneratePlaylist, loading }) {
  const [selected, setSelected] = useState(new Set());

  function toggleSetlist(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selected.size === setlists.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(setlists.map((s) => s.id)));
    }
  }

  function handleGenerate() {
    const chosen = setlists.filter((s) => selected.has(s.id));
    // Aggregate unique songs across selected setlists
    const songMap = new Map();
    chosen.forEach((setlist) => {
      setlist.songs.forEach((song) => {
        if (!song.tape && song.name) {
          const key = song.name.toLowerCase();
          if (!songMap.has(key)) {
            songMap.set(key, song.name);
          }
        }
      });
    });
    onGeneratePlaylist([...songMap.values()]);
  }

  if (!setlists.length) {
    return (
      <div className="text-center text-text-subtle py-8">
        No recent setlists found for this artist.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-text">Recent Setlists</h2>
        <div className="flex gap-3">
          <button
            onClick={selectAll}
            className="text-sm text-accent hover:text-accent-hover transition-colors min-h-[44px] px-3 inline-flex items-center"
          >
            {selected.size === setlists.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={handleGenerate}
            disabled={selected.size === 0 || loading}
            className="px-5 min-h-[44px] bg-success hover:bg-success/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-text font-semibold text-sm transition-colors inline-flex items-center"
          >
            {loading ? 'Generating...' : `Generate Playlist (${selected.size})`}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {setlists.map((setlist) => (
          <button
            key={setlist.id}
            onClick={() => toggleSetlist(setlist.id)}
            className={`w-full text-left p-4 rounded-xl border transition-colors ${
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
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
