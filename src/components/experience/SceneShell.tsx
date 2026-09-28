import type { ReactNode } from 'react'
import ParticleBackground from './ParticleBackground'

type SceneShellProps = {
  children: ReactNode
  backdrop?: ReactNode
  tone?: 'plum' | 'rose' | 'violet' | 'ink'
  className?: string
  contentClassName?: string
  id?: string
  ariaLabel?: string
}

export default function SceneShell({
  children,
  backdrop,
  tone = 'plum',
  className,
  contentClassName,
  id,
  ariaLabel,
}: SceneShellProps) {
  return (
    <section
      id={id}
      className={`scene-shell scene-shell--${tone} ${className ?? ''}`.trim()}
      aria-label={ariaLabel}
    >
      <ParticleBackground tone={tone} />
      <div className="scene-shell__wash" aria-hidden="true" />
      {backdrop}
      <div className={`scene-shell__content ${contentClassName ?? ''}`.trim()}>
        {children}
      </div>
    </section>
  )
}
