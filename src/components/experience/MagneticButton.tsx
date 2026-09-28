import type { PointerEvent, ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

type MagneticButtonProps = {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
  ariaLabel?: string
}

export default function MagneticButton({
  children,
  onClick,
  type = 'button',
  className,
  disabled = false,
  ariaLabel,
}: MagneticButtonProps) {
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 360, damping: 24, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 360, damping: 24, mass: 0.35 })

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.16)
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.16)
  }

  const resetPosition = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      type={type}
      className={`magnetic-button ${className ?? ''}`.trim()}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{ x: springX, y: springY }}
      whileHover={disabled || reducedMotion ? undefined : { scale: 1.035 }}
      whileTap={disabled || reducedMotion ? undefined : { scale: 0.97 }}
    >
      <span className="magnetic-button__label">{children}</span>
      <span className="magnetic-button__sweep" aria-hidden="true" />
    </motion.button>
  )
}
