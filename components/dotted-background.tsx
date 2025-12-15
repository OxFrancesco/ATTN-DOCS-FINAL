"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

type Dot = {
  x: number
  y: number
  neighbors: Dot[]
  pulseStart: number
  pulseEnd: number
  lastTriggered: number
}

type Trail = {
  x1: number
  y1: number
  x2: number
  y2: number
  start: number
  life: number
}

export function DottedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  // Use refs for values accessed in the animation loop to avoid re-binding the loop
  const themeRef = useRef(resolvedTheme)
  const dotsRef = useRef<Dot[]>([])
  const trailsRef = useRef<Trail[]>([])
  const requestRef = useRef<number | null>(null)

  useEffect(() => {
    themeRef.current = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    const baseSize = 2.3
    const gap = 13
    const activeColor = "#bd0927"
    const pulseDuration = 2000
    const basePassChance = 0.5
    const decayFactor = 0.8
    const maxDepth = 80
    const baseCooldown = 1500
    const trailLife = 1200
    const trailWidth = 1
    const trailAlpha = 0.45
    const scaleFactor = 2.2
    const randomTriggerRate = 2500
    const randomTriggerCount = 1
    const randomDecayFactor = 1.1
    const randomMaxDepth = 120

    const hexToRgb = (hex: string) => {
      const h = hex.replace("#", "")
      const bigint = parseInt(h, 16)
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      }
    }

    const trailRgb = hexToRgb(activeColor)

    let cooldown = baseCooldown
    let mouse = { x: Number.NaN, y: Number.NaN }
    let holdInterval: number | null = null
    let randomInterval: number | null = null

    const initDots = (w: number, h: number) => {
      const newDots: Dot[] = []
      // Use a map for O(1) neighbor lookup
      const dotMap = new Map<string, Dot>()

      for (let x = 0; x < w; x += gap) {
        for (let y = 0; y < h; y += gap) {
          const dot: Dot = {
            x,
            y,
            neighbors: [],
            pulseStart: 0,
            pulseEnd: 0,
            lastTriggered: 0,
          }
          newDots.push(dot)
          dotMap.set(`${x},${y}`, dot)
        }
      }

      // Link neighbors using the map (O(N) instead of O(N^2))
      newDots.forEach((dot) => {
        const neighborsCoords = [
          { x: dot.x + gap, y: dot.y },
          { x: dot.x - gap, y: dot.y },
          { x: dot.x, y: dot.y + gap },
          { x: dot.x, y: dot.y - gap },
        ]

        neighborsCoords.forEach(coord => {
          const neighbor = dotMap.get(`${coord.x},${coord.y}`)
          if (neighbor) {
            dot.neighbors.push(neighbor)
          }
        })
      })
      
      dotsRef.current = newDots
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      // Use client dimensions to avoid layout thrashing loop if possible, 
      // but window is standard for full screen bg
      width = Math.floor(window.innerWidth)
      height = Math.floor(window.innerHeight)
      
      // Check if size actually changed to avoid unnecessary re-init
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
          canvas.width = Math.floor(width * dpr)
          canvas.height = Math.floor(height * dpr)
          canvas.style.width = `${width}px`
          canvas.style.height = `${height}px`
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          initDots(width, height)
      }
    }

    const triggerChain = (held = false) => {
      if (!Number.isFinite(mouse.x) || !Number.isFinite(mouse.y)) return

      let nearest: Dot | null = null
      let nearestDist = Infinity
      
      // Optimization: limit search to nearby dots only? 
      // For now, linear scan is fast enough for interaction (N=12k), 
      // but if we wanted to optimize we could bucket them.
      // Keeping linear for simplicity as N is manageable for mouse events.
      for (const dot of dotsRef.current) {
        const dx = mouse.x - dot.x
        const dy = mouse.y - dot.y
        const dist = dx * dx + dy * dy
        // Optimization: Stop if we find something "close enough" (e.g. inside the dot)?
        // Actually finding the absolute nearest is best feel.
        if (dist < nearestDist) {
          nearestDist = dist
          nearest = dot
        }
      }

      if (!nearest) return

      const chance = held ? basePassChance * 1.2 : basePassChance
      const prevCooldown = cooldown
      if (held) cooldown = 400
      propagate(nearest, 0, chance, null, decayFactor, maxDepth)
      cooldown = prevCooldown
    }

    const propagate = (
      dot: Dot,
      depth: number,
      chance: number,
      parent: Dot | null,
      localDecay: number,
      localMaxDepth: number,
      preferredDir?: { dx: number; dy: number } | null,
    ) => {
      const now = performance.now()
      if (depth > localMaxDepth) return
      if (now - dot.lastTriggered < cooldown) return

      dot.pulseStart = now
      dot.pulseEnd = now + pulseDuration
      dot.lastTriggered = now

      if (parent) {
        trailsRef.current.push({
          x1: parent.x,
          y1: parent.y,
          x2: dot.x,
          y2: dot.y,
          start: now,
          life: trailLife,
        })
      }

      let direction = preferredDir
      if (!direction && parent) {
        direction = { dx: dot.x - parent.x, dy: dot.y - parent.y }
      }

      const nextNeighbors = dot.neighbors.filter((n) => {
        if (!direction) return true
        const dx = n.x - dot.x
        const dy = n.y - dot.y
        if (dx === direction.dx && dy === direction.dy) return true
        return Math.random() < 0.3
      })

      nextNeighbors.forEach((neighbor) => {
        if (Math.random() < chance) {
          // Use setTimeout for stagger effect - this is fine but creates many timers.
          // For massive grids, a central ticker is better, but this matches original logic.
          window.setTimeout(() => {
            propagate(
              neighbor,
              depth + 1,
              chance * localDecay,
              dot,
              localDecay,
              localMaxDepth,
              direction,
            )
          }, 80 + Math.random() * 180)
        }
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      const now = performance.now()
      
      // Determine color based on current theme ref
      const currentDotColor = themeRef.current === 'dark' ? "#232324" : "#DFE0E1"

      // Filter dead trails
      if (trailsRef.current.length > 0) {
          trailsRef.current = trailsRef.current.filter((trail) => now < trail.start + trail.life)
      }
      
      trailsRef.current.forEach((trail) => {
        const age = now - trail.start
        const frac = Math.max(0, 1 - age / trail.life)
        const alpha = frac * trailAlpha
        ctx.lineWidth = trailWidth
        ctx.lineCap = "round"
        ctx.strokeStyle = `rgba(${trailRgb.r},${trailRgb.g},${trailRgb.b},${alpha})`
        ctx.beginPath()
        ctx.moveTo(trail.x1, trail.y1)
        ctx.lineTo(trail.x2, trail.y2)
        ctx.stroke()
      })

      dotsRef.current.forEach((dot) => {
        let size = baseSize
        if (now < dot.pulseEnd) {
          ctx.fillStyle = activeColor
          const elapsed = now - dot.pulseStart
          const progress = elapsed / pulseDuration
          let scale: number
          if (progress < 0.5) {
            scale = 1 + (scaleFactor - 1) * (progress / 0.5)
          } else {
            scale = scaleFactor - (scaleFactor - 1) * ((progress - 0.5) / 0.5)
          }
          size = baseSize * scale
        } else {
          ctx.fillStyle = currentDotColor
        }

        ctx.fillRect(dot.x - size / 2, dot.y - size / 2, size, size)
      })

      requestRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
      triggerChain()
      restartHoldLoop()
    }

    const handleMouseLeave = () => {
      if (holdInterval) clearInterval(holdInterval)
      mouse = { x: Number.NaN, y: Number.NaN }
    }

    const restartHoldLoop = () => {
      if (holdInterval) clearInterval(holdInterval)
      holdInterval = window.setInterval(() => {
        triggerChain(true)
      }, 400)
    }

    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    resize()
    requestRef.current = requestAnimationFrame(animate)

    randomInterval = window.setInterval(() => {
      if (dotsRef.current.length === 0) return;
      for (let i = 0; i < randomTriggerCount; i++) {
        const randDot = dotsRef.current[Math.floor(Math.random() * dotsRef.current.length)]
        if (randDot) {
          propagate(randDot, 0, basePassChance, null, randomDecayFactor, randomMaxDepth)
        }
      }
    }, randomTriggerRate)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      if (holdInterval) clearInterval(holdInterval)
      if (randomInterval) clearInterval(randomInterval)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, []) // Empty dependency array - purely ref-based updates for theme

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {/* Background div uses CSS variable for bg-background */}
      <div className="absolute inset-0 bg-background transition-colors duration-300" />
      <canvas
        id="dotGrid"
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  )
}
