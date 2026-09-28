import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../../motionShared'

type SceneTransitionProps = {
  sceneKey: string
  children: ReactNode
}

export default function SceneTransition({ sceneKey, children }: SceneTransitionProps) {
  const reducedMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className="scene-transition"
        key={sceneKey}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.018, filter: 'blur(16px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, filter: 'blur(12px)' }}
        transition={{ duration: reducedMotion ? 0.25 : 0.9, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
