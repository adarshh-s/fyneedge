import { useEffect, useRef } from 'react'
import { navState } from '../lenis.js'

/*
  A glowing ring woven from line loops (a twisted torus), drawn on a 2D canvas.
    idle   → the loops flow round the ring and the twist breathes
    cursor → the ring tilts toward the pointer; loops near it swell and lean
    click  → a lime wave races round the ring both ways from the click
  Layouts:
    hero    → hangs from the top; scroll tilts it flat, centres it and flies you through (progress 0 → 1)
    horizon → lies tilted along the bottom like a planet ring; scroll lifts and fades it (inner-page heroes)
    center  → sits around the headline; progress is "arrival" 0 → 1, it settles in from large (closing CTA)
*/

const TAU = Math.PI * 2
const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, t) => a + (b - a) * t
// one clock for every ring, so two rings drawn with the same geometry match loop for loop
const T0 = performance.now()
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a))

const LAYOUTS = {
  hero(p, w, h, st) {
    const flat = smooth(0, 0.4, p)
    const grow = smooth(0.12, 0.85, p)
    // desktop: the ring hangs from the top and ends above the headline; phones: wider than the screen
    const S = w < 700 ? w * 1.6 : Math.min(w * 0.9, h * 1.12)
    return {
      S,
      R: S * 0.37 * (1 + grow * 3.4),
      r: S * 0.115 * (1 + grow * 3.4),
      cx: w / 2 + st.px * w * 0.025,
      cy: lerp(w < 700 ? h * 0.03 : 0, h * 0.5, flat) + st.py * h * 0.025,
      rx: lerp(0.38, 0, flat) + st.py * 0.22,
      ry: st.px * 0.32,
      tw: 0.48 + Math.sin(st.t * 0.33) * 0.1 + grow * 0.5,
      fade: 1 - smooth(0.62, 0.95, p),
    }
  },
  horizon(p, w, h, st) {
    const S = w < 700 ? w * 2.3 : Math.max(w * 0.95, h * 1.2)
    return {
      S,
      R: S * 0.42,
      r: S * 0.1,
      cx: w / 2 + st.px * w * 0.02,
      cy: h * (w < 700 ? 1.02 : 1.12) - p * h * 0.3 + st.py * h * 0.02,
      rx: 1.02 - p * 0.25 + st.py * 0.1,
      ry: st.px * 0.22,
      tw: 0.55 + Math.sin(st.t * 0.33) * 0.1,
      fade: 1 - smooth(0.45, 0.95, p),
    }
  },
  center(p, w, h, st) {
    const a = smooth(0, 1, p)
    const k = lerp(2.6, 1, a)
    const S = w < 700 ? w * 1.5 : Math.min(w * 0.95, h * 1.3)
    return {
      S,
      R: S * 0.4 * k,
      r: S * 0.1 * k,
      cx: w / 2 + st.px * w * 0.02,
      cy: h * 0.5 + st.py * h * 0.02,
      rx: 0.28 + st.py * 0.2,
      ry: st.px * 0.3,
      tw: 0.5 + Math.sin(st.t * 0.33) * 0.1 + (1 - a) * 0.6,
      fade: smooth(0, 0.55, p),
    }
  },
}

/* the page's own resting ring, for the intro and page transitions to glide into/out of:
   its layout, canvas rect, the card it is clipped to (radius + bottom fade) and its pointer lean */
export function findPageRing() {
  for (const [sel, layout] of [
    ['.rhero__ring .ring__canvas:not(.ring__canvas--glow)', 'hero'],
    ['.phero__ring .ring__canvas:not(.ring__canvas--glow)', 'horizon'],
  ]) {
    const el = document.querySelector(sel)
    if (!el) continue
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) continue
    const stage = el.closest('.rhero__stage, .phero__stage')
    const cs = stage && getComputedStyle(stage)
    const masked = cs && cs.maskImage && cs.maskImage !== 'none'
    const st = el.__ringState
    return {
      layout,
      dx: r.left,
      dy: r.top,
      w: r.width,
      h: r.height,
      rTop: cs ? Math.max(0, parseFloat(cs.borderTopLeftRadius) - 1) : 0,
      rBottom: cs ? Math.max(0, parseFloat(cs.borderBottomLeftRadius) - 1) : 0,
      fadeFrom: masked ? (parseFloat(cs.getPropertyValue('--blend-from')) || 70) / 100 : null,
      st0: st ? { px: st.px, py: st.py } : null,
    }
  }
  return null
}

/* page rings hide while a carried ring stands in for them, and stop following the pointer
   so they rest in exactly the pose the carried ring lands in */
export function holdPageRings(on) {
  navState.ringHold = on
  document.documentElement.classList.toggle('ring-hold', on)
}
const NEUTRAL = { over: false, x: 0, y: 0, mx: -9999, my: -9999, clicks: [] }
const NEUTRAL_REF = { current: NEUTRAL }

/* pointer + click plumbing shared by every ring: spread the handlers on the element that covers the canvas */
export function useRingPointer() {
  const input = useRef({ over: false, x: 0, y: 0, mx: -9999, my: -9999, clicks: [] })
  const point = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const k = input.current
    k.mx = e.clientX - r.left
    k.my = e.clientY - r.top
    k.x = (k.mx / r.width) * 2 - 1
    k.y = (k.my / r.height) * 2 - 1
    return k
  }
  const handlers = {
    onPointerEnter: (e) => (point(e).over = true),
    onPointerMove: point,
    onPointerLeave: () => {
      const k = input.current
      k.over = false
      k.x = k.y = 0
    },
    onClick: (e) => {
      if (e.target.closest('a, button, input, textarea')) return
      const k = point(e)
      k.clicks.push({ x: k.mx, y: k.my })
    },
  }
  return [input, handlers]
}

// `reveal` (optional ref, 0 → 1): how much of the ring is woven in — loops appear in order round the ring,
// the newest one drawing itself segment by segment (used by the intro loader)
// `morph` (optional ref): { m: 0 → 1, layout, dx, dy, w, h } — glide from this ring's own layout into another
// ring's resting geometry (another canvas, offset by dx/dy) — how the intro ring settles into the page's ring
// `carried`: this is the travelling ring (intro / transitions), never held; `onDraw` runs after every drawn frame
export default function HaloRing({ progress, input, layout = 'hero', reveal, morph, carried, onDraw }) {
  const ref = useRef(null)
  const glowRef = useRef(null)
  const drawCb = useRef(onDraw)
  drawCb.current = onDraw

  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    // the soft glow lives on its own canvas at half resolution (1/4 of the pixels) — soft enough to look
    // like light, fine enough not to show blocks when upscaled. Stroking it at full size cost ~70 dropped frames per 150 on a full ring.
    const gcv = glowRef.current
    const gctx = gcv.getContext('2d')
    const GLOW = 0.5
    const place = LAYOUTS[layout]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 700
    const N = small ? 52 : 84
    // enough segments that big loops read as true curves, not polygons
    const SEG = small ? 110 : 168
    const loops = Array.from({ length: N }, (_, i) => ({ th: (i / N) * TAU, boost: 0, lime: 0 }))
    const xs = new Float32Array(SEG + 1)
    const ys = new Float32Array(SEG + 1)
    const st = { t: 0, px: 0, py: 0, hover: 0, last: performance.now(), waves: [] }
    // a carried ring starts in the lean of the page ring it lifts out of; page rings expose theirs
    if (carried && morph?.current?.st0) Object.assign(st, morph.current.st0)
    if (!carried) cv.__ringState = st
    let w = 0
    let h = 0
    let raf = 0
    let onScreen = true

    const resize = () => {
      // full device resolution for crisp lines (the expensive glow lives on its own low-res canvas)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // resizing resets context state; round joins keep tight bends smooth
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      gcv.width = Math.max(1, Math.round(w * GLOW))
      gcv.height = Math.max(1, Math.round(h * GLOW))
      gctx.setTransform(GLOW, 0, 0, GLOW, 0, 0)
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - st.last) / 1000, 0.05)
      st.last = now
      if (!onScreen) return
      const p = progress.current
      const k = !carried && navState.ringHold ? NEUTRAL : input.current
      if (!reduce) st.t = (now - T0) / 1000

      st.hover += ((k.over ? 1 : 0) - st.hover) * 0.06
      st.px += (k.x - st.px) * 0.05
      st.py += (k.y - st.py) * 0.05

      let { S, R, r, cx, cy, rx, ry, tw, fade } = place(p, w, h, st)
      const mo = morph?.current
      if (mo && mo.m > 0) {
        const B = LAYOUTS[mo.layout](0, mo.w, mo.h, st)
        const m = mo.m
        S = lerp(S, B.S, m)
        R = lerp(R, B.R, m)
        r = lerp(r, B.r, m)
        cx = lerp(cx, B.cx + mo.dx, m)
        cy = lerp(cy, B.cy + mo.dy, m)
        rx = lerp(rx, B.rx, m)
        ry = lerp(ry, B.ry, m)
        tw = lerp(tw, B.tw, m)
        fade = lerp(fade, B.fade, m)
      }
      ctx.clearRect(0, 0, w, h)
      gctx.clearRect(0, 0, w, h)
      if (fade <= 0.005) return
      const flow = st.t * 0.45
      const D = S * 1.8
      const cosX = Math.cos(rx)
      const sinX = Math.sin(rx)
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)
      // screen → ring-plane: undo the vertical squash of a tilted ring so angles line up with the loops
      const squash = Math.max(0.2, cosX)
      const angleAt = (x, y) => Math.atan2((y - cy) / squash, x - cx)

      // clicks become waves that start at the clicked angle
      for (const c of k.clicks.splice(0)) st.waves.push({ th: angleAt(c.x, c.y), age: 0 })
      st.waves = st.waves.filter((v) => (v.age += dt) < 2.4)

      // pointer angle and how close it is to the ring band
      const pa = angleAt(k.mx, k.my)
      const pd = Math.hypot(k.mx - cx, (k.my - cy) / squash)
      const nearBand = (1 - smooth(r * 0.8, r * 3, Math.abs(pd - R))) * st.hover

      ctx.globalCompositeOperation = 'lighter'

      // soft halo under the lines
      const halo = ctx.createRadialGradient(cx, cy, Math.max(1, R - r * 1.8), cx, cy, R + r * 2)
      halo.addColorStop(0, 'rgba(40,90,255,0)')
      halo.addColorStop(0.5, `rgba(40,100,255,${0.22 * fade})`)
      halo.addColorStop(1, 'rgba(40,90,255,0)')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, w, h)

      const inner = Math.max(1, R - r * 1.15)
      const outer = R + r * 1.15
      const blue = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer)
      blue.addColorStop(0, '#effaff')
      blue.addColorStop(0.3, '#8fcaff')
      blue.addColorStop(0.62, '#3a7bff')
      blue.addColorStop(1, '#1b2fc4')
      const lime = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer)
      lime.addColorStop(0, '#f7ffd6')
      lime.addColorStop(0.45, '#d7ff3e')
      lime.addColorStop(1, '#5fae1a')

      // soft glow for every loop, gathered into one path and stroked once after the loop —
      // one wide stroke instead of 84 overlapping ones (the old per-loop glow halved the frame rate)
      const glow = new Path2D()

      const woven = reveal ? Math.max(0, Math.min(1, reveal.current)) * N : N
      for (let li = 0; li < N; li++) {
        const L = loops[li]
        if (li >= Math.ceil(woven)) break
        // the loop being woven right now draws only part of its length
        const segs = li < Math.floor(woven) ? SEG : Math.max(2, Math.round((woven - Math.floor(woven)) * SEG))
        // swell toward the pointer
        let target = nearBand * Math.exp(-(wrap(L.th - pa) ** 2) * 7)
        let lim = 0
        for (const v of st.waves) {
          const d = Math.abs(wrap(L.th - v.th))
          const wv = Math.exp(-((d - v.age * 3) ** 2) * 14) * Math.exp(-v.age * 1.3)
          target += wv * 0.9
          lim = Math.max(lim, wv)
        }
        L.boost += (target - L.boost) * 0.12
        L.lime += (lim - L.lime) * 0.2
        const ri = r * (1 + L.boost * 0.42)
        const lean = L.boost * 0.25

        for (let j = 0; j <= segs; j++) {
          const ph = (j / SEG) * TAU
          const th = L.th + tw * Math.sin(ph + flow) + lean * Math.cos(ph)
          const rr = R + ri * Math.cos(ph)
          const x = rr * Math.cos(th)
          const y = rr * Math.sin(th)
          const z = ri * Math.sin(ph)
          // rotate about y, then x
          const x1 = x * cosY + z * sinY
          const z1 = -x * sinY + z * cosY
          const y1 = y * cosX - z1 * sinX
          const z2 = y * sinX + z1 * cosX
          const s = D / (D - z2)
          xs[j] = cx + x1 * s
          ys[j] = cy + y1 * s
        }

        const path = new Path2D()
        path.moveTo(xs[0], ys[0])
        for (let j = 1; j <= segs; j++) path.lineTo(xs[j], ys[j])
        glow.addPath(path)

        ctx.strokeStyle = L.lime > 0.25 ? lime : blue
        ctx.globalAlpha = (0.85 + L.boost * 0.15) * fade
        ctx.lineWidth = 1.15 + L.boost * 0.9
        ctx.stroke(path)
      }
      // one union stroke doesn't stack where loops cross, so it runs a little stronger than the old per-loop glow
      gctx.globalCompositeOperation = 'lighter'
      gctx.strokeStyle = blue
      gctx.globalAlpha = 0.22 * fade
      gctx.lineWidth = 10
      gctx.stroke(glow)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      drawCb.current?.()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)
    // no drawing while the ring is off screen
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting))
    io.observe(cv)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, input, layout, reveal, morph])

  return (
    <>
      <canvas ref={glowRef} className="ring__canvas ring__canvas--glow" aria-hidden="true" />
      <canvas ref={ref} className="ring__canvas" aria-hidden="true" />
    </>
  )
}

/*
  The travelling ring used by the intro and page transitions. Full-screen while it travels; as morph.m → 1 its
  window narrows to the target page ring's card (rounded corners, bottom fade), so on landing it is pixel-for-pixel
  what the page ring draws — then `land()` swaps them in the same frame.
*/
export function CarriedRing({ morph, reveal, api, onFirstDraw }) {
  const win = useRef(null)
  const inner = useRef(null)
  const drawn = useRef(false)
  const settled = useRef(1)

  useEffect(() => {
    let raf
    const lerp2 = (a, b, t) => a + (b - a) * t
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const w = win.current
      const i = inner.current
      if (!w || !i) return
      const vw = window.innerWidth
      const vh = window.innerHeight
      const mo = morph.current
      const m = mo ? mo.m : 0
      const x = mo ? lerp2(0, mo.dx, m) : 0
      const y = mo ? lerp2(0, mo.dy, m) : 0
      const ww = mo ? lerp2(vw, mo.w, m) : vw
      const hh = mo ? lerp2(vh, mo.h, m) : vh
      w.style.transform = `translate(${x}px, ${y}px)`
      w.style.width = `${ww}px`
      w.style.height = `${hh}px`
      w.style.borderRadius = mo ? `${mo.rTop * m}px ${mo.rTop * m}px ${mo.rBottom * m}px ${mo.rBottom * m}px` : '0'
      const fade = mo && mo.fadeFrom != null ? lerp2(1, mo.fadeFrom, m) * 100 : 100
      const mask = `linear-gradient(180deg, #000 0%, #000 ${fade}%, ${fade >= 100 ? '#000' : 'transparent'} 100%)`
      w.style.webkitMaskImage = mask
      w.style.maskImage = mask
      // the canvas stays pinned to the viewport while its window moves
      i.style.transform = `translate(${-x}px, ${-y}px)`
      i.style.width = `${vw}px`
      i.style.height = `${vh}px`
    }
    tick()
    if (api) {
      api.current = {
        // swap with the page ring in one frame
        land: () => {
          if (win.current) win.current.style.visibility = 'hidden'
          holdPageRings(false)
        },
      }
    }
    return () => cancelAnimationFrame(raf)
  }, [morph, api])

  return (
    <div className="carry" ref={win}>
      <div className="carry__inner" ref={inner}>
        <HaloRing
          layout="center"
          progress={settled}
          input={NEUTRAL_REF}
          reveal={reveal}
          morph={morph}
          carried
          onDraw={() => {
            if (!drawn.current) {
              drawn.current = true
              onFirstDraw?.()
            }
          }}
        />
      </div>
    </div>
  )
}
