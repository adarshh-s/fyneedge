import { useEffect, useRef } from 'react'

/*
  A full-bleed field of tiny ↗ arrows drawn on a canvas.
    idle   → comets of light stream up-right, a "ghost cursor" wanders and ripples the field,
             light bands sweep, the odd arrow glints lime
    cursor → nearby arrows turn away from the pointer under a soft spotlight
    click  → CHARGE: arrows nearby are pulled in and turn to face the point
             RELEASE: a flash, then a wave rolls outward — each arrow tumbles over in 3D,
             flashing its lime back face, and lands pointing ↗ again
    scroll → arrows turn to point straight up and fade (progress 0 → 1)
*/

const TAU = Math.PI * 2
const BASE = -Math.PI / 4 // ↗
const DIR = [Math.cos(BASE), Math.sin(BASE)]
const BUCKETS = 10
const LIME_BUCKETS = 5
// each overlapping click wave gets the next colour; the first is always lime
const WAVE_COLORS = [
  [215, 255, 62], // lime
  [80, 190, 255], // sky
  [255, 92, 170], // pink
  [160, 120, 255], // violet
  [255, 176, 64], // amber
  [60, 240, 210], // cyan
]
const CHARGE = 0.34 // seconds of pull-in before the release
const WAVE_SPEED = 720 // px / s
const WAVE_WIDTH = 150 // px over which a single arrow completes its flip
const WAVE_LIFE = 1.5 // seconds after release

const smooth = (e0, e1, x) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1)
  return t * t * (3 - 2 * t)
}
const angleLerp = (a, b, t) => {
  let d = ((b - a + Math.PI) % TAU) - Math.PI
  if (d < -Math.PI) d += TAU
  return a + d * t
}

export default function ArrowField({ progressRef, theme = 'light', fullBleed = false, variant }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dark = theme === 'dark'

    let w = 0
    let h = 0
    let cell = 17
    let cols = 0
    let rows = 0
    let angles = new Float32Array(0)
    let glow = new Float32Array(0)
    let mask = new Float32Array(0) // per-cell density (organic clusters for the lumina variant)
    const lumina = variant === 'lumina'
    let raf = 0
    let visible = true
    const mouse = { x: -9999, y: -9999, active: false, last: -10 }
    const ghost = { x: 0, y: 0, k: 0 }
    const clicks = []
    const comets = []
    const glints = []
    let lastComet = 0
    let lastGlint = 0
    let lastAuto = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      // layout size, unaffected by CSS transforms on ancestors
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cell = w < 700 ? 15 : 17
      cols = Math.ceil(w / cell) + 1
      rows = Math.ceil(h / cell) + 1
      angles = new Float32Array(cols * rows).fill(BASE)
      glow = new Float32Array(cols * rows)
      mask = new Float32Array(cols * rows).fill(1)
      if (lumina) {
        // smooth value noise → soft clusters that are denser toward the sides
        const hash = (x, y) => {
          const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
          return s - Math.floor(s)
        }
        const noise = (x, y) => {
          const xi = Math.floor(x)
          const yi = Math.floor(y)
          const xf = x - xi
          const yf = y - yi
          const u = xf * xf * (3 - 2 * xf)
          const v = yf * yf * (3 - 2 * yf)
          const a = hash(xi, yi) + (hash(xi + 1, yi) - hash(xi, yi)) * u
          const b = hash(xi, yi + 1) + (hash(xi + 1, yi + 1) - hash(xi, yi + 1)) * u
          return a + (b - a) * v
        }
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const n = noise(c / 9, r / 9) * 0.65 + noise(c / 3.5 + 40, r / 3.5) * 0.35
            const tower = smooth(0.14, 0.34, Math.abs(c / cols - 0.5))
            mask[r * cols + c] = Math.min(1, tower * (0.45 + 0.75 * smooth(0.3, 0.65, n)) + 0.12 * smooth(0.5, 0.75, n))
          }
        }
      }
      if (reduce) draw(performance.now())
    }

    const upper = lumina ? [105, 155, 235] : dark ? [190, 215, 255] : [210, 228, 255]
    const lower = lumina ? [215, 234, 255] : dark ? [120, 160, 255] : [47, 116, 255]

    const spawnComet = (t) => {
      const fromLeft = Math.random() < 0.45
      comets.push({
        x: fromLeft ? -40 : Math.random() * w * 0.9,
        y: fromLeft ? h * (0.25 + Math.random() * 0.7) : h + 40,
        t,
        speed: 230 + Math.random() * 140,
        tail: 160 + Math.random() * 160,
      })
      if (comets.length > 7) comets.shift()
    }

    const draw = (now) => {
      const t = now / 1000
      const p = progressRef?.current ?? 0
      ctx.clearRect(0, 0, w, h)

      // ---- ambient life ----
      if (!reduce) {
        if (t - lastComet > 0.55) {
          lastComet = t
          spawnComet(t)
        }
        if (t - lastAuto > 2.8) {
          lastAuto = t
          // soft ripple rolling out from the centre
          clicks.push({ x: w / 2, y: h * 0.45, t, auto: true })
          if (clicks.length > 6) clicks.shift()
        }
        if (t - lastGlint > 0.22) {
          lastGlint = t
          glints.push({ i: (Math.random() * cols * rows) | 0, t })
          if (glints.length > 18) glints.shift()
        }
      }
      const idle = !mouse.active || t - mouse.last > 2.5
      ghost.k += ((idle ? 1 : 0) - ghost.k) * 0.02
      ghost.x = w * (0.5 + Math.sin(t * 0.21) * 0.36 + Math.sin(t * 0.47) * 0.06)
      ghost.y = h * (0.5 + Math.sin(t * 0.29 + 1.3) * 0.26)

      const glintMap = new Map()
      for (const g of glints) {
        const life = (t - g.t) / 1.6
        if (life < 1) glintMap.set(g.i, Math.sin(life * Math.PI))
      }
      for (let k = clicks.length - 1; k >= 0; k--) if (t - clicks[k].t > CHARGE + WAVE_LIFE) clicks.splice(k, 1)
      for (let k = comets.length - 1; k >= 0; k--) {
        const c = comets[k]
        const d = (t - c.t) * c.speed
        if (c.x + DIR[0] * d > w + 400 || c.y + DIR[1] * d < -400) comets.splice(k, 1)
      }

      // ---- soft spotlight under the pointer (real or ghost) ----
      const spots = []
      if (mouse.active && !idle) spots.push([mouse.x, mouse.y, 1])
      if (ghost.k > 0.02) spots.push([ghost.x, ghost.y, ghost.k * 0.7])
      for (const [sx, sy, k] of spots) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 260)
        g.addColorStop(0, `rgba(255,255,255,${0.13 * k})`)
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = g
        ctx.fillRect(sx - 260, sy - 260, 520, 520)
      }

      // ---- click glow: gathers during the charge, flashes on release ----
      for (const c of clicks) {
        const age = t - c.t
        const charge = c.auto ? 0 : CHARGE
        let a = 0
        let rad = 0
        if (age < charge) {
          const k = age / charge
          a = 0.15 + k * 0.35
          rad = 160 - k * 100
        } else {
          const k = (age - charge) / (c.auto ? 0.9 : 0.8)
          if (k > 1) continue
          a = (c.auto ? 0.1 : 0.85) * Math.pow(1 - k, 2)
          rad = c.auto ? 40 + k * 240 : 80 + k * 460
        }
        const [r1, g1, b1] = c.auto ? [150, 200, 255] : WAVE_COLORS[c.c]
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, rad)
        g.addColorStop(0, `rgba(255,255,255,${a.toFixed(3)})`)
        g.addColorStop(0.35, `rgba(${r1},${g1},${b1},${(a * 0.5).toFixed(3)})`)
        g.addColorStop(1, `rgba(${r1},${g1},${b1},0)`)
        ctx.fillStyle = g
        ctx.fillRect(c.x - rad, c.y - rad, rad * 2, rad * 2)
      }

      const paths = []
      for (let b = 0; b < BUCKETS * 2; b++) paths.push(new Path2D())
      const colorPaths = WAVE_COLORS.map(() => Array.from({ length: LIME_BUCKETS }, () => new Path2D()))

      const cx = w / 2
      const cy = h * (fullBleed || lumina ? 0.42 : 0.47)
      const scrollAngle = lumina ? BASE : BASE + (-Math.PI / 2 - BASE) * smooth(0, 0.8, p)
      const fadeAll = lumina ? 1 - smooth(0.42, 0.72, p) : 1 - smooth(0.2, 1, p)
      // lumina fly-through: on scroll the field zooms toward the viewer from the centre
      const zoom = lumina ? 1 + Math.pow(smooth(0, 0.7, p), 1.6) * 3.6 : 1
      const lane = cell * 0.75

      for (let r = 0; r < rows; r++) {
        const y = r * cell + cell / 2
        const yn = y / h
        const vert = lumina ? smooth(-0.05, 0.2, yn) * (0.6 + 0.4 * yn) : fullBleed ? smooth(-0.1, 0.12, yn) * (1 - smooth(0.88, 1.05, yn)) : smooth(-0.05, 0.35, yn) * (1 - smooth(0.62, 0.98, yn))
        if (vert <= 0.01) continue
        const family = lumina ? (yn > 0.55 ? 1 : 0) : !fullBleed && yn > 0.62 ? 1 : 0
        for (let c = 0; c < cols; c++) {
          const x = c * cell + cell / 2
          const i = r * cols + c

          const dx = (x - cx) / (w * 0.34)
          const dy = (y - cy) / (h * 0.22)
          const calm = smooth(0.55, 1.15, Math.sqrt(dx * dx + dy * dy))

          const band = Math.max(0, Math.sin((x * 0.55 - y * 0.85) / 150 + t * 1.1))
          let a = vert * calm * mask[i] * (lumina ? 0.55 + Math.pow(band, 6) * 0.45 : 0.32 + Math.pow(band, 6) * 0.4)

          let target = scrollAngle
          let boost = (zoom - 1) * 0.12
          let ox = 0
          let oy = 0
          let flip = 1 // 1 = front face, -1 = back face (cos of the tumble angle)
          let back = 0 // 0 → 1 how strongly the coloured back face shows
          let backColor = 0

          for (const [sx, sy, k] of spots) {
            const mx = x - sx
            const my = y - sy
            const d = Math.sqrt(mx * mx + my * my)
            if (d < 190) {
              const f = smooth(190, 20, d) * k
              target = angleLerp(target, Math.atan2(my, mx), f)
              boost = Math.max(boost, f)
            }
          }

          for (const cm of comets) {
            const d = (t - cm.t) * cm.speed
            const vx = x - (cm.x + DIR[0] * d)
            const vy = y - (cm.y + DIR[1] * d)
            const along = vx * DIR[0] + vy * DIR[1]
            if (along > 6 || along < -cm.tail) continue
            const perp = Math.abs(vx * DIR[1] - vy * DIR[0])
            if (perp > lane) continue
            boost = Math.max(boost, (1 + along / cm.tail) * (1 - perp / lane) * 0.95)
          }

          // ---- click: charge, then a tumbling wave ----
          for (const ck of clicks) {
            const age = t - ck.t
            const kx = x - ck.x
            const ky = y - ck.y
            const d = Math.sqrt(kx * kx + ky * ky) || 1
            const charge = ck.auto ? 0 : CHARGE
            if (age < charge) {
              // click charge: arrows face the point and get pulled in hard
              const f = smooth(300, 0, d) * smooth(0, charge, age)
              if (f > 0) {
                target = angleLerp(target, Math.atan2(-ky, -kx), f)
                ox -= (kx / d) * f * Math.min(d * 0.3, 22)
                oy -= (ky / d) * f * Math.min(d * 0.3, 22)
                boost = Math.max(boost, f)
              }
            } else {
              const ra = age - charge
              const local = (ra * (ck.auto ? 420 : WAVE_SPEED) - d) / (ck.auto ? 120 : WAVE_WIDTH)
              if (local > 0 && local < 1) {
                const e = local < 0.5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2
                if (ck.auto) {
                  // low intensity: a gentle tilt and glow that fades out with distance
                  const amp = Math.max(0, 1 - ra / 2.6)
                  flip = Math.min(flip, 1 - (1 - Math.cos(e * TAU)) * 0.28 * amp)
                  const bump = Math.sin(local * Math.PI) * amp
                  ox += (kx / d) * bump * 4
                  oy += (ky / d) * bump * 4
                  boost = Math.max(boost, bump * 0.55)
                } else {
                  // high intensity: full tumble with a coloured back face and a strong push
                  const amp = Math.max(0, 1 - ra / WAVE_LIFE)
                  flip = Math.cos(e * TAU)
                  const bk = flip < 0 ? -flip * amp : 0
                  if (bk > back) {
                    back = bk
                    backColor = ck.c
                  }
                  const bump = Math.sin(local * Math.PI) * amp
                  ox += (kx / d) * bump * 20
                  oy += (ky / d) * bump * 20
                  boost = Math.max(boost, bump)
                  angles[i] = angleLerp(angles[i], target, 0.25)
                }
              }
            }
          }

          angles[i] = reduce ? target : angleLerp(angles[i], target, 0.12)
          glow[i] += (boost - glow[i]) * 0.18
          a = Math.min(1, (a + glow[i] * 0.8 * Math.max(vert, 0.45)) * fadeAll)
          const glint = (glintMap.get(i) || 0) * fadeAll
          const lime = Math.max(glint, back * fadeAll)
          const colorIdx = back * fadeAll >= glint ? backColor : 0
          if (a < 0.03 && lime < 0.05) continue

          // arrow in local coords (u along the shaft, v across), tumbling scales u
          const s = cell * 0.26 * (1 + glow[i] * 0.4) * Math.sqrt(zoom)
          const hs = s * 0.75
          const ca = Math.cos(angles[i])
          const sa = Math.sin(angles[i])
          const px = zoom === 1 ? x + ox : cx + (x + ox - cx) * zoom
          const py = zoom === 1 ? y + oy : cy + (y + oy - cy) * zoom
          const u0 = -s * flip
          const u1 = s * flip
          const ua = (s - hs * 0.7071) * flip
          const va = hs * 0.7071
          const path = lime > 0.12 ? colorPaths[colorIdx][Math.min(LIME_BUCKETS - 1, (lime * LIME_BUCKETS) | 0)] : paths[family * BUCKETS + Math.min(BUCKETS - 1, (a * BUCKETS) | 0)]
          path.moveTo(px + ca * u0, py + sa * u0)
          path.lineTo(px + ca * u1, py + sa * u1)
          path.moveTo(px + ca * ua - sa * va, py + sa * ua + ca * va)
          path.lineTo(px + ca * u1, py + sa * u1)
          path.lineTo(px + ca * ua + sa * va, py + sa * ua - ca * va)
        }
      }

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = lumina ? 1.1 : 1.35
      for (let fam = 0; fam < 2; fam++) {
        const [cr, cg, cb] = fam ? lower : upper
        for (let b = 0; b < BUCKETS; b++) {
          ctx.strokeStyle = ctx.fillStyle = `rgba(${cr},${cg},${cb},${((b + 0.5) / BUCKETS).toFixed(2)})`
          ctx.stroke(paths[fam * BUCKETS + b])
        }
      }
      ctx.lineWidth = 1.7
      ctx.shadowBlur = 8
      WAVE_COLORS.forEach(([cr, cg, cb], ci) => {
        ctx.shadowColor = `rgba(${cr},${cg},${cb},0.75)`
        for (let b = 0; b < LIME_BUCKETS; b++) {
          ctx.strokeStyle = ctx.fillStyle = `rgba(${cr},${cg},${cb},${((b + 1) / LIME_BUCKETS).toFixed(2)})`
          ctx.stroke(colorPaths[ci][b])
        }
      })
      ctx.shadowBlur = 0
    }

    const loop = (now) => {
      raf = 0
      if (!visible) return
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    const host = canvas.parentElement.parentElement
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - r.left) * w) / r.width
      mouse.y = ((e.clientY - r.top) * h) / r.height
      mouse.active = true
      mouse.last = performance.now() / 1000
    }
    const onLeave = () => (mouse.active = false)
    const onDown = (e) => {
      if (e.target.closest('a, button')) return
      const r = canvas.getBoundingClientRect()
      const now = performance.now() / 1000
      const active = clicks.filter((c) => !c.auto && now - c.t < CHARGE + WAVE_LIFE)
      // a fresh click starts at lime; clicks during a live wave take the next colour
      const c = active.length ? (active[active.length - 1].c + 1) % WAVE_COLORS.length : 0
      clicks.push({ x: ((e.clientX - r.left) * w) / r.width, y: ((e.clientY - r.top) * h) / r.height, t: now, c })
      if (clicks.length > 6) clicks.shift()
      if (reduce) draw(performance.now())
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf && !reduce) raf = requestAnimationFrame(loop)
    })
    io.observe(canvas)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    host.addEventListener('pointerdown', onDown)
    if (!reduce) raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('pointerdown', onDown)
    }
  }, [theme, progressRef, fullBleed, variant])

  return <canvas ref={canvasRef} className="ghero__canvas" aria-hidden="true" />
}
