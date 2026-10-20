import { useEffect, useRef } from 'react'

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

export default function HaloRing({ progress, input, layout = 'hero' }) {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const place = LAYOUTS[layout]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 700
    const N = small ? 52 : 84
    const SEG = small ? 72 : 96
    const loops = Array.from({ length: N }, (_, i) => ({ th: (i / N) * TAU, boost: 0, lime: 0 }))
    const xs = new Float32Array(SEG + 1)
    const ys = new Float32Array(SEG + 1)
    const st = { t: 0, px: 0, py: 0, hover: 0, last: performance.now(), waves: [] }
    let w = 0
    let h = 0
    let raf = 0
    let onScreen = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - st.last) / 1000, 0.05)
      st.last = now
      if (!onScreen) return
      const p = progress.current
      const k = input.current
      if (!reduce) st.t += dt

      st.hover += ((k.over ? 1 : 0) - st.hover) * 0.06
      st.px += (k.x - st.px) * 0.05
      st.py += (k.y - st.py) * 0.05

      const { S, R, r, cx, cy, rx, ry, tw, fade } = place(p, w, h, st)
      ctx.clearRect(0, 0, w, h)
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

      for (const L of loops) {
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

        for (let j = 0; j <= SEG; j++) {
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
        for (let j = 1; j <= SEG; j++) path.lineTo(xs[j], ys[j])

        ctx.strokeStyle = L.lime > 0.25 ? lime : blue
        ctx.globalAlpha = (0.09 + L.boost * 0.08) * fade
        ctx.lineWidth = 7
        ctx.stroke(path)
        ctx.globalAlpha = (0.85 + L.boost * 0.15) * fade
        ctx.lineWidth = 1.3 + L.boost * 0.9
        ctx.stroke(path)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
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
  }, [progress, input, layout])

  return <canvas ref={ref} className="ring__canvas" aria-hidden="true" />
}
