export type MemoryItem = {
  id: string
  type: 'image' | 'video'
  src: string
  caption: string
  date?: string
  note?: string
  alt?: string
}

export const memories: MemoryItem[] = [
  {
    id: 'together',
    type: 'image',
    src: '/images/us-together.jpeg',
    caption: 'A moment I kept close to my chest.',
    date: 'PRIVATE ARCHIVE',
    note: 'You + me / no filter needed.',
    alt: 'Ayanfe and Keziah together',
  },
 {
    id: 'video-one',
    type: 'video',
    src: '/media/video_1.mp4',
    caption: 'A tiny piece of the day, just for you.',
    date: 'PRESS PLAY',
    note: 'shy shy bby.',
    alt: 'Ayanfe Files video memory',
  },
  {
    id: 'video-two',
    type: 'video',
    src: '/media/video_2.mp4',
    caption: 'Another moment worth keeping.',
    date: 'PRESS PLAY',
    note: 'my bby.',
    alt: 'Ayanfe Files video memory',
  },
  {
    id: 'video-three',
    type: 'video',
    src: '/media/video_3.mp4',
    caption: 'Yet another moment worth keeping.',
    date: 'PRESS PLAY',
    note: 'Ife miii.',
    alt: 'Ayanfe Files video memory',
  },
 {
    id: 'video-four',
    type: 'video',
    src: '/media/video_4.mp4',
    caption: 'A tiny piece of the day, just for you.',
    date: 'PRESS PLAY',
    note: 'My love.',
    alt: 'Ayanfe Files video memory',
  },
]
