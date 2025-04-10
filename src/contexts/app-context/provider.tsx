import { useRef, useState, ReactNode, useMemo } from 'react'
import * as THREE from 'three'
import { AppContext } from './context'
import { TCameraResolution, TPoint, TSphere, type TSuperFile } from './types'
import {
  CAMERA_RESOLUTIONS,
  SPHERE_CIRCLE_COUNT,
  SPHERE_DISTANCE,
  SPHERE_ECUATORIAL_COUNT,
  SPHERE_POLAR_COUNT
} from './constants'
import { generateVariableSpherePoints, positionToHSL, uuidv4 } from './utils'

const POINTS = generateVariableSpherePoints(
  SPHERE_ECUATORIAL_COUNT,
  SPHERE_POLAR_COUNT,
  SPHERE_CIRCLE_COUNT,
  SPHERE_DISTANCE
)

const SPHERES = POINTS.map((point: TPoint) => ({
  id: uuidv4(),
  point,
  color: positionToHSL(point.x, point.y, point.z)
}))

export const AppProvider = (props: { children: ReactNode }) => {
  const { children } = props
  const mountRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [currentScene, setCurrentScene] = useState<THREE.Scene | null>(null)
  const [currentCamera, setCurrentCamera] = useState<THREE.PerspectiveCamera | null>(null)
  const [photoFiles, setPhotoFiles] = useState<TSuperFile[]>([])
  const [overSphere, setOverSphere] = useState(false)
  const [cameraAngle, setCameraAngle] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0
  })
  const [cameraResolution, setCameraResolution] = useState<TCameraResolution>(CAMERA_RESOLUTIONS[2])
  const [spheres, setSpheres] = useState<TSphere[]>(SPHERES)

  const values = useMemo(
    () => ({
      mountRef,
      rendererRef,
      permissionGranted,
      setPermissionGranted,
      currentScene,
      setCurrentScene,
      currentCamera,
      setCurrentCamera,
      photoFiles,
      setPhotoFiles,
      photosLeft: POINTS.length - photoFiles.length,
      overSphere,
      setOverSphere,
      cameraAngle,
      setCameraAngle,
      cameraResolution,
      setCameraResolution,
      spheres,
      setSpheres
    }),
    [
      mountRef,
      rendererRef,
      permissionGranted,
      currentScene,
      currentCamera,
      photoFiles,
      overSphere,
      cameraAngle,
      cameraResolution,
      spheres
    ]
  )

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>
}
