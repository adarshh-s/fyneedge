// Shared handle to the Lenis smooth-scroll instance (set in App)
export const lenisRef = { current: null }

// true once the first page has been shown — after that, pages arrive behind the iris transition,
// so their entrance animations for big visuals (the rings) are skipped: they must already be there when it opens
export const navState = { arrived: false, introReady: true, listeners: new Set() }

// the intro loader holds page entrances back until its black starts lifting
export function setIntroReady(v) {
  navState.introReady = v
  navState.listeners.forEach((fn) => fn(v))
}
