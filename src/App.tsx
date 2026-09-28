import { useCallback, useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { experience } from './data/birthdayExperience'
import CinematicGrain from './components/experience/CinematicGrain'
import ProgressNav from './components/experience/ProgressNav'
import SceneTransition from './components/experience/SceneTransition'
import IntroScene from './components/experience/IntroScene'
import PasswordScene from './components/experience/PasswordScene'
import BirthdayCelebration from './components/experience/BirthdayCelebration'
import LetterScene from './components/experience/LetterScene'
import MemoryGallery from './components/experience/MemoryGallery'
import FinalScene from './components/experience/FinalScene'

type MusicStatus = 'idle' | 'ready' | 'playing' | 'blocked' | 'missing'

const TOTAL_SCENES = 6

export default function App() {
  const [currentScene, setCurrentScene] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const [musicStatus, setMusicStatus] = useState<MusicStatus>('idle')
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [musicProgress, setMusicProgress] = useState(0)
  const [musicCurrentTime, setMusicCurrentTime] = useState(0)
  const [musicDuration, setMusicDuration] = useState(0)
  const musicRef = useRef<HTMLAudioElement>(null)

  const goToScene = useCallback((scene: number) => {
    const nextScene = Math.max(0, Math.min(TOTAL_SCENES - 1, scene))
    setCurrentScene(nextScene)
    window.scrollTo(0, 0)
  }, [])

  const startMusic = useCallback(() => {
    const audio = musicRef.current
    if (!audio) return

    audio.currentTime = 0
    setMusicCurrentTime(0)
    setMusicProgress(0)
    setMusicDuration(0)
    audio.volume = 0.24
    void audio
      .play()
      .then(() => {
        setMusicPlaying(true)
        setMusicStatus('playing')
      })
      .catch(() => {
        setMusicPlaying(false)
        setMusicStatus((current) => (current === 'missing' ? 'missing' : 'blocked'))
      })
  }, [])

  const enterCelebration = useCallback(() => {
    setUnlocked(true)
    goToScene(2)
  }, [goToScene])

  const toggleMusic = useCallback(() => {
    const audio = musicRef.current
    if (!audio) return

    if (audio.paused) {
      void audio
        .play()
        .then(() => {
          setMusicPlaying(true)
          setMusicStatus('playing')
        })
        .catch(() => {
          setMusicPlaying(false)
          setMusicStatus((current) => (current === 'missing' ? 'missing' : 'blocked'))
        })
    } else {
      audio.pause()
      setMusicPlaying(false)
    }
  }, [])

  const softenMusic = useCallback(() => {
    if (musicRef.current) musicRef.current.volume = 0.13
  }, [])

  const replay = useCallback(() => {
    const audio = musicRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setMusicCurrentTime(0)
      setMusicProgress(0)
      setMusicDuration(0)
      audio.volume = 0.24
    }
    setMusicProgress(0)
    setMusicCurrentTime(0)
    setMusicDuration(0)
    setMusicPlaying(false)
    setMusicStatus('idle')
    setUnlocked(false)
    goToScene(0)
  }, [goToScene])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const audio = musicRef.current
    if (!audio) return

    const handleCanPlay = () => {
      setMusicStatus((current) => (current === 'playing' ? 'playing' : 'ready'))
      if (Number.isFinite(audio.duration)) setMusicDuration(audio.duration)
    }
    const handleError = () => setMusicStatus('missing')
    const handleTimeUpdate = () => {
      setMusicCurrentTime(audio.currentTime)
      if (audio.duration) {
        setMusicDuration(audio.duration)
        setMusicProgress(audio.currentTime / audio.duration)
      }
    }
    const handlePlay = () => {
      setMusicPlaying(true)
      setMusicStatus('playing')
    }
    const handlePause = () => setMusicPlaying(false)

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [])

  useEffect(() => {
    const audio = musicRef.current
    if (!audio) return
    audio.volume = currentScene >= 3 ? 0.13 : 0.24
  }, [currentScene])

  const renderScene = () => {
    switch (currentScene) {
      case 0:
        return <IntroScene onStart={() => goToScene(1)} />
      case 1:
        return <PasswordScene onVerified={startMusic} onContinue={enterCelebration} />
      case 2:
        return (
          <BirthdayCelebration
            onContinue={() => goToScene(3)}
            musicStatus={musicStatus}
            musicPlaying={musicPlaying}
            musicProgress={musicProgress}
            musicCurrentTime={musicCurrentTime}
            musicDuration={musicDuration}
            musicBlocked={musicStatus === 'blocked'}
            onToggleMusic={toggleMusic}
          />
        )
      case 3:
        return <LetterScene onContinue={() => goToScene(4)} onOpenLetter={softenMusic} />
      case 4:
        return <MemoryGallery onContinue={() => goToScene(5)} />
      case 5:
        return <FinalScene onReplay={replay} />
      default:
        return null
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="experience-app">
        <audio
          ref={musicRef}
          className="sr-only"
          src={experience.music.src}
          loop
          preload="auto"
          aria-hidden="true"
        />
        <ProgressNav
          currentScene={currentScene}
          totalScenes={TOTAL_SCENES}
          onNavigate={goToScene}
          visible={unlocked}
        />
        <div className="experience-vignette" aria-hidden="true" />
        <CinematicGrain />
        <main className="experience-main" aria-live="polite">
          <SceneTransition sceneKey={`scene-${currentScene}`}>{renderScene()}</SceneTransition>
        </main>
      </div>
    </MotionConfig>
  )
}
