import { useState, useEffect } from 'react'

// Animated soundboard meter that fills up over time
function Meter({ label, targetPercent, delay = 0 }) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setPercent((prev) => {
          if (prev >= targetPercent) {
            clearInterval(interval)
            return targetPercent
          }
          return prev + 1
        })
      }, 60)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [targetPercent, delay])

  const totalSegments = 13
  const activeSegments = Math.round((percent / 100) * totalSegments)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="font-label text-xs text-on-surface-muted uppercase tracking-widest">
          {label}
        </span>
        <span className="font-label text-amber text-sm">{percent}%</span>
      </div>
      <div className="flex bg-surface-lowest p-2 border-b-2 border-amber/20">
        <div className="flex gap-[2px]">
          {Array.from({ length: totalSegments }, (_, i) => {
            const isActive = i < activeSegments
            let color = 'bg-on-surface/10'
            if (isActive) {
              if (i < 4) color = 'bg-green/40'
              else if (i < 7) color = 'bg-green'
              else if (i < 10) color = 'bg-amber/60'
              else color = 'bg-amber shadow-[0_0_10px_rgba(255,179,0,0.5)]'
            }
            return (
              <div
                key={i}
                className={`meter-segment transition-colors duration-150 ${color}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function LoadingState({ artist }) {
  const [logLines, setLogLines] = useState([])

  const logs = [
    '> Initializing Concert Prep engine...',
    '> Fetching data from setlist.fm API [OK]',
    '> Aggregating unique songs across setlists...',
    `> Searching YouTube for ${artist || 'artist'} tracks...`,
    '> Matching songs to official videos...',
    '> Building playlist sequence...',
  ]

  useEffect(() => {
    logs.forEach((line, i) => {
      setTimeout(() => {
        setLogLines((prev) => [...prev, line])
      }, i * 800)
    })
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-left">
        <div className="inline-block px-3 py-1 bg-surface-variant text-amber font-label text-xs tracking-widest uppercase mb-4 border-l-2 border-amber">
          Status: Processing
        </div>
        <h2 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter leading-none max-w-md">
          Building the{' '}
          <span className="text-amber">Perfect</span> Night.
        </h2>
      </div>

      {/* Soundboard visualization */}
      <div className="bg-surface-low p-8 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber/10 rounded-full blur-[80px]" />

        <div className="relative z-10">
          {/* Technical details */}
          <div className="flex justify-between font-label text-[10px] text-amber/40 uppercase tracking-[0.2em] mb-8">
            <span>Input: SETLIST_DATA.RAW</span>
            <span>Mode: YOUTUBE_MATCH</span>
          </div>

          {/* Meters */}
          <div className="space-y-6">
            <Meter label="Analyzing setlist data..." targetPercent={95} delay={200} />
            <Meter label="Matching YouTube videos..." targetPercent={72} delay={1500} />
            <Meter label="Building playlist sequence..." targetPercent={45} delay={3000} />
          </div>
        </div>
      </div>

      {/* Terminal logs */}
      <div className="mt-8 font-label text-[11px] text-on-surface-faint/50 leading-relaxed uppercase tracking-wider space-y-1">
        {logLines.map((line, i) => (
          <p key={i} className={i === logLines.length - 1 ? 'text-amber' : ''}>
            {line}
          </p>
        ))}
        {logLines.length < logs.length && (
          <p className="animate-pulse">{'>'} ...</p>
        )}
      </div>
    </div>
  )
}
