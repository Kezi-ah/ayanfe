import { motion } from 'framer-motion'

type ProgressNavProps = {
  currentScene: number
  totalScenes: number
  onNavigate: (scene: number) => void
  visible: boolean
}

const navItems = [
  { label: 'Letter', scene: 3 },
  { label: 'Memories', scene: 4 },
  { label: 'Ending', scene: 5 },
]

export default function ProgressNav({
  currentScene,
  totalScenes,
  onNavigate,
  visible,
}: ProgressNavProps) {
  if (!visible) return null

  const progress = ((currentScene + 1) / totalScenes) * 100

  return (
    <nav className="experience-nav" aria-label="Birthday experience navigation">
      <div className="experience-nav__topline">
        <span>AYANFE FILES</span>
        <span className="experience-nav__counter">
          {String(currentScene + 1).padStart(2, '0')} / {String(totalScenes).padStart(2, '0')}
        </span>
      </div>
      <div className="experience-nav__track" aria-hidden="true">
        <motion.span
          className="experience-nav__fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="experience-nav__items">
        {navItems.map((item) => (
          <button
            type="button"
            className={currentScene === item.scene ? 'is-active' : ''}
            key={item.label}
            onClick={() => onNavigate(item.scene)}
            aria-current={currentScene === item.scene ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          className="experience-nav__step"
          onClick={() => onNavigate(currentScene - 1)}
          disabled={currentScene === 0}
          aria-label="Previous scene"
        >
          ←
        </button>
        <button
          type="button"
          className="experience-nav__step"
          onClick={() => onNavigate(currentScene + 1)}
          disabled={currentScene === totalScenes - 1}
          aria-label="Next scene"
        >
          →
        </button>
      </div>
    </nav>
  )
}
