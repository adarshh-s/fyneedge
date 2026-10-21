import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SITE } from '../config.js'
import { lenisRef } from '../lenis.js'

export const openPalette = () => window.dispatchEvent(new Event('palette:open'))

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
export const MOD = isMac ? '⌘' : 'Ctrl'

function buildCommands(navigate, close) {
  const go = (to) => () => navigate(to)
  return [
    { group: 'Pages', title: 'Home', sub: 'Start here', icon: '⌂', tone: 'ink', type: 'Page', run: go('/') },
    { group: 'Pages', title: 'Services', sub: 'Web, mobile and AI agents', icon: '◐', tone: 'sky', type: 'Page', run: go('/services') },
    { group: 'Pages', title: 'About', sub: 'Mission, vision and values', icon: '◎', tone: 'ink', type: 'Page', run: go('/about') },
    { group: 'Pages', title: 'Contact', sub: 'Tell us about your project', icon: '✉', tone: 'sky', type: 'Page', run: go('/contact') },
    { group: 'Services', title: 'Web Application Development', sub: 'Portals, dashboards, SaaS', icon: 'W', tone: 'sky', type: 'Service', run: go('/services#web') },
    { group: 'Services', title: 'Mobile App Development', sub: 'iOS and Android', icon: 'M', tone: 'lime', type: 'Service', run: go('/services#mobile') },
    { group: 'Services', title: 'AI Agent Development', sub: 'Voice, WhatsApp, email, workflows', icon: 'A', tone: 'ink', type: 'Service', run: go('/services#ai') },
    { group: 'Actions', title: 'Book a free consultation', sub: 'Free, no obligation', icon: '→', tone: 'lime', type: 'Command', run: go('/contact') },
    { group: 'Actions', title: 'Chat on WhatsApp', sub: 'Opens WhatsApp', icon: '✆', tone: 'wa', type: 'Command', run: () => window.open(SITE.whatsapp, '_blank') },
    { group: 'Actions', title: 'Copy email address', sub: SITE.email, icon: '@', tone: 'ink', type: 'Command', run: () => navigator.clipboard?.writeText(SITE.email), keepOpen: true, toast: 'Copied!' },
  ]
}

const score = (c, q) => {
  if (!q) return 1
  const hay = `${c.title} ${c.sub} ${c.group}`.toLowerCase()
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.every((w) => hay.includes(w))) return 0
  return c.title.toLowerCase().startsWith(words[0]) ? 2 : 1
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const [toast, setToast] = useState('')
  const navigate = useNavigate()
  const listRef = useRef(null)

  const close = () => setOpen(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const commands = useMemo(() => buildCommands(navigate, close), [navigate, open])
  const results = useMemo(
    () =>
      commands
        .map((c) => [c, score(c, q)])
        .filter(([, s]) => s > 0)
        .sort((a, b) => (q ? b[1] - a[1] : 0))
        .map(([c]) => c),
    [commands, q]
  )

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('palette:open', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('palette:open', onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQ('')
      setIdx(0)
      lenisRef.current?.stop()
    } else lenisRef.current?.start()
  }, [open])

  useEffect(() => setIdx(0), [q])
  useEffect(() => {
    listRef.current?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' })
  }, [idx])

  const run = (c) => {
    if (!c) return
    c.run()
    if (c.toast) {
      setToast(c.toast)
      setTimeout(() => setToast(''), 1400)
    }
    if (!c.keepOpen) close()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx((i) => (i + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx((i) => (i - 1 + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[idx])
    } else if (e.key === 'Escape') close()
  }

  let lastGroup = null
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cmdk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <motion.div
            className="cmdk__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <div className="cmdk__search">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown} placeholder="Search pages, services, products and actions…" aria-label="Search" />
              <kbd>esc</kbd>
            </div>
            <div className="cmdk__list" ref={listRef} data-lenis-prevent>
              {results.length === 0 && <p className="cmdk__empty">No results for “{q}”. Try “agent”, “app” or “WhatsApp”.</p>}
              {results.map((c, i) => {
                const header = c.group !== lastGroup && !q ? c.group : null
                lastGroup = c.group
                return (
                  <div key={c.title}>
                    {header && <p className="cmdk__group">{header}</p>}
                    <button className={`cmdk__item ${i === idx ? 'is-active' : ''}`} onMouseMove={() => setIdx(i)} onClick={() => run(c)}>
                      <span className={`cmdk__icon tone-${c.tone}`}>{c.icon}</span>
                      <span className="cmdk__title">{c.title}</span>
                      <span className="cmdk__sub">{c.sub}</span>
                      <span className="cmdk__type">{c.type}</span>
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="cmdk__foot">
              <span className="cmdk__brand">{toast || SITE.name}</span>
              <span>
                Open <kbd>↵</kbd>
              </span>
              <span>
                Navigate <kbd>↑</kbd>
                <kbd>↓</kbd>
              </span>
              <span>
                Toggle <kbd>{MOD}</kbd>
                <kbd>K</kbd>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
