import { useEffect, useRef } from 'react'

const projects = [
  {
    name: 'Subway Shame',
    tagline: 'Real-time NYC subway reliability scores. Pulls live MTA feeds, calculates a shame score per line, and tells you if your commute is about to hurt.',
    stack: ['Python', 'Flask', 'MTA API'],
    status: 'Live',
    color: 'var(--color-subway)',
    url: 'https://subway.michaelpyon.com',
  },
  {
    name: 'ShooterDigest',
    tagline: 'Weekly intelligence briefing for competitive FPS games. Aggregates Steam concurrents, Reddit sentiment, and press coverage into a single digestible report.',
    stack: ['Python', 'Flask', 'Steam API', 'Reddit API'],
    status: 'Live',
    color: 'var(--color-shooter)',
    url: 'https://shooter.michaelpyon.com',
  },
  {
    name: 'VintageMap',
    tagline: 'Interactive wine vintage explorer. Pick a year, see quality ratings across every major wine region on a world map. Shareable URLs for any vintage.',
    stack: ['React', 'Vite', 'Python', 'Flask'],
    status: 'Live',
    color: 'var(--color-vintage)',
    url: 'https://vintage.michaelpyon.com',
  },
  {
    name: 'MassageOS',
    tagline: 'Massage booking reimagined with a 58-region anatomical body map. Clients tap where it hurts, therapists see the full picture before the session starts.',
    stack: ['Next.js', 'Prisma', 'TypeScript'],
    status: 'Live',
    color: 'var(--color-massage)',
    url: 'https://massage.michaelpyon.com',
  },
  {
    name: 'Random Pin Cuisine',
    tagline: 'Drop a pin on any spot on Earth, and find restaurants serving that region\'s cuisine in New York City. 80+ countries with local cuisine lookups.',
    stack: ['React', 'Vite', 'Leaflet', 'OSM'],
    status: 'Live',
    color: 'var(--color-pin)',
    url: 'https://random-pin.michaelpyon.com',
  },
]

function Card({ project, index }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-fade-up')
          el.style.animationDelay = `${400 + index * 100}ms`
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <a
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-stripe block rounded-lg border border-border bg-surface pl-5 pr-6 py-5 transition-all duration-300 hover:bg-surface-hover hover:border-border-hover group"
      style={{
        opacity: 0,
        '--stripe-color': project.color,
      }}
    >
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-3">
          <span className="text-text-subtle text-xs font-mono tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2
            className="text-base font-semibold tracking-tight sm:text-lg"
            style={{ color: project.color }}
          >
            {project.name}
          </h2>
        </div>
        <span
          className="text-[10px] font-medium tracking-wide uppercase shrink-0 ml-3"
          style={{
            color: project.status === 'Live' ? '#22c55e' : '#525252',
          }}
        >
          {project.status}
        </span>
      </div>

      <p className="text-text-muted text-sm leading-relaxed mb-4 ml-7">
        {project.tagline}
      </p>

      <div className="flex flex-wrap gap-1.5 ml-7">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-[10px] text-text-subtle tracking-wide px-2 py-0.5 rounded border border-border"
          >
            {tech}
          </span>
        ))}
      </div>
    </a>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <header className="px-6 pt-16 pb-20 max-w-2xl mx-auto sm:pt-24 sm:pb-28">
        <h1
          className="font-display text-5xl sm:text-7xl text-text tracking-tight leading-[0.95] mb-6 animate-fade-up"
          style={{ animationDelay: '200ms' }}
        >
          Michael Pyon
        </h1>
      </header>

      {/* Projects */}
      <main className="px-6 max-w-2xl mx-auto">
        <p
          className="text-text-subtle text-xs font-mono tracking-widest uppercase mb-6 animate-fade-in"
          style={{ animationDelay: '500ms' }}
        >
          Projects
        </p>
        <div className="grid gap-3">
          {projects.map((project, i) => (
            <Card key={project.name} project={project} index={i} />
          ))}
        </div>
      </main>

      {/* About */}
      <section className="px-6 max-w-2xl mx-auto mt-24 mb-20">
        <p className="text-text-subtle text-xs font-mono tracking-widest uppercase mb-6">
          About
        </p>
        <div className="max-w-lg space-y-4">
          <p className="text-text-muted text-sm leading-relaxed">
            I work in business strategy and operations at Microsoft, focused on the Xbox and Halo ecosystem. These projects are how I stay sharp on the product side — each one solves a real problem I ran into.
          </p>
          <p className="text-text-muted text-sm leading-relaxed">
            Based in Brooklyn. Interested in live service games, data products, and building tools that are genuinely useful.
          </p>
        </div>

        {/* Contact links */}
        <div className="flex gap-6 mt-8">
          <a
            href="https://github.com/mpyon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-subtle text-xs font-mono tracking-wide hover:text-text transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/michaelpyon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-subtle text-xs font-mono tracking-wide hover:text-text transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:michaelpyon@gmail.com"
            className="text-text-subtle text-xs font-mono tracking-wide hover:text-text transition-colors"
          >
            Email
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-10 max-w-2xl mx-auto border-t border-border pt-6">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-text-subtle font-mono">
            2026
          </span>
          <span className="text-[11px] text-text-subtle font-mono">
            Built with React
          </span>
        </div>
      </footer>
    </div>
  )
}
