import { useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

type EnvelopeProps = {
  open: boolean
  onOpen: () => void
}

export default function Envelope({ open, onOpen }: EnvelopeProps) {
  const reducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 180, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 180, damping: 20 })

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    rotateX.set(y * -10)
    rotateY.set(x * 12)
  }

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
    setHovered(false)
  }

  return (
    <motion.button
      type="button"
      className={`envelope ${open ? 'envelope--open' : ''} ${hovered ? 'envelope--hovered' : ''}`.trim()}
      onClick={onOpen}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={resetTilt}
      style={{ rotateX: springX, rotateY: springY }}
      whileHover={reducedMotion ? undefined : { scale: 1.035 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      aria-label={open ? 'The letter is open' : 'Open your letter'}
    >
      <span className="envelope__body" aria-hidden="true" />
      <span className="envelope__paper" aria-hidden="true" />
      <span className="envelope__flap" aria-hidden="true" />
      <span className="envelope__front" aria-hidden="true" />
      <span className="envelope__seal" aria-hidden="true">
        <span>19</span>
      </span>
      <span className="envelope__shine" style={{ '--hover-x': '50%' } as CSSProperties} aria-hidden="true" />
    </motion.button>
  )
}
