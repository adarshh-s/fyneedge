import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

const listeners = new Set()
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l))
export const getTheme = () => document.documentElement.dataset.theme || 'dark'

function apply(t) {
  document.documentElement.dataset.theme = t
  try {
    localStorage.setItem('theme', t)
  } catch {}
  flushSync(() => listeners.forEach((l) => l()))
}

/** Switch theme with a circular reveal from `origin` ({x, y} in viewport px) */
export function setTheme(t, origin) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduce) return apply(t)
  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? 0
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const vt = document.startViewTransition(() => apply(t))
  vt.ready.then(() =>
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 750, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
    )
  )
}

export const toggleTheme = (origin) => setTheme(getTheme() === 'dark' ? 'light' : 'dark', origin)

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => 'dark')
}
