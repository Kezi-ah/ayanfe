import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type ParticleBackgroundProps = {
  tone?: 'plum' | 'rose' | 'violet' | 'ink'
  className?: string
}

type Particle = {
  left: number
  top: number
  size: number
  opacity: number
  delay: number
  duration: number
  driftX: number
  driftY: number
  hue: number
}

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

export default function ParticleBackground({
  tone = 'plum',
  className,
}: ParticleBackgroundProps) {
  const reducedMotion = useReducedMotion()

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        left: pseudoRandom(index + 11) * 100,
        top: pseudoRandom(index + 71) * 100,
        size: 1 + pseudoRandom(index + 131) * 3.2,
        opacity: 0.16 + pseudoRandom(index + 191) * 0.5,
        delay: pseudoRandom(index + 251) * 7,
        duration: 10 + pseudoRandom(index + 311) * 15,
        driftX: (pseudoRandom(index + 371) - 0.5) * 34,
        driftY: -18 - pseudoRandom(index + 431) * 72,
        hue: 280 + pseudoRandom(index + 491) * 85,
      })),
    [],
  )

  const orbs: ReactNode[] = [
    <span className="particle-field__orb particle-field__orb--one" key="one" />,
    <span className="particle-field__orb particle-field__orb--two" key="two" />,
    <span className="particle-field__orb particle-field__orb--three" key="three" />,
  ]

  return (
    <div className={`particle-field particle-field--${tone} ${className ?? ''}`.trim()} aria-hidden="true">
      {orbs}
      <span className="particle-field__star particle-field__star--one" />
      <span className="particle-field__star particle-field__star--two" />
      <span className="particle-field__star particle-field__star--three" />
      {particles.map((particle, index) => {
        const style = {
          left: `${particle.left}%`,
          top: `${particle.top}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          opacity: particle.opacity,
          animationDelay: `${particle.delay}s`,
          animationDuration: `${particle.duration}s`,
          '--drift-x': `${particle.driftX}px`,
          '--drift-y': `${particle.driftY}px`,
          '--particle-hue': `${particle.hue}`,
        } as CSSProperties

        return <span className="particle-field__particle" key={index} style={style} />
      })}
      {reducedMotion ? <span className="particle-field__reduced" /> : null}
    </div>
  )
}
