import { EAspectRatio, ESpherePointPreset, type TPoint } from './types'
import { generateDefaultSpherePoints, generateVerticalSegmentsSpherePoints } from './utils'

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

export const SPHERE_POINT_PRESETS: Record<ESpherePointPreset, TPoint[]> = {
  [ESpherePointPreset.DEFAULT]: generateDefaultSpherePoints(
    SPHERE_ECUATORIAL_COUNT,
    SPHERE_POLAR_COUNT,
    SPHERE_CIRCLE_COUNT,
    SPHERE_DISTANCE
  ),
  [ESpherePointPreset.CUBE]: [
    { x: 0, y: SPHERE_DISTANCE, z: 0, theta: 90, phi: 0 },
    { x: 0, y: -SPHERE_DISTANCE, z: 0, theta: 270, phi: 0 },
    { x: SPHERE_DISTANCE, y: 0, z: 0, theta: 180, phi: 0 },
    { x: -SPHERE_DISTANCE, y: 0, z: 0, theta: 0, phi: 0 },
    { x: 0, y: 0, z: SPHERE_DISTANCE, theta: 90, phi: 90 },
    { x: 0, y: 0, z: -SPHERE_DISTANCE, theta: 90, phi: 270 }
  ],
  [ESpherePointPreset.VERTICAL_SEGMENTS]: generateVerticalSegmentsSpherePoints(
    6,
    16,
    SPHERE_DISTANCE
  )
}
