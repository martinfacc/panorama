import { EAspectRatio } from './types'

export const SPHERE_DISTANCE = 5

export const SPHERE_RADIUS = 0.3

export const SPHERE_SEGMENTS = 16

export const SPHERE_ECUATORIAL_COUNT = 24

export const SPHERE_POLAR_COUNT = 1

export const SPHERE_OPACITY = 0.5

export const SPHERE_CIRCLE_COUNT = 5

export const CAMERA_RESOLUTIONS = [
  { width: 320, height: 240, aspectRatio: EAspectRatio['4:3'] },
  { width: 640, height: 480, aspectRatio: EAspectRatio['4:3'] },
  { width: 640, height: 360, aspectRatio: EAspectRatio['16:9'] },
  { width: 720, height: 1440, aspectRatio: EAspectRatio['18:9'] },
  { width: 720, height: 1520, aspectRatio: EAspectRatio['19:9'] },
  { width: 800, height: 600, aspectRatio: EAspectRatio['4:3'] },
  { width: 1024, height: 768, aspectRatio: EAspectRatio['4:3'] },
  { width: 1080, height: 2160, aspectRatio: EAspectRatio['18:9'] },
  { width: 1080, height: 2280, aspectRatio: EAspectRatio['19:9'] },
  { width: 1280, height: 720, aspectRatio: EAspectRatio['16:9'] },
  { width: 1440, height: 2880, aspectRatio: EAspectRatio['18:9'] },
  { width: 1440, height: 3040, aspectRatio: EAspectRatio['19:9'] },
  { width: 1600, height: 1200, aspectRatio: EAspectRatio['4:3'] },
  { width: 1920, height: 1080, aspectRatio: EAspectRatio['16:9'] },
  { width: 2560, height: 1440, aspectRatio: EAspectRatio['16:9'] },
  { width: 3840, height: 2160, aspectRatio: EAspectRatio['16:9'] }
]
