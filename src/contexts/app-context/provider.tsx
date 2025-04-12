import { useRef, useState, ReactNode, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { AppContext } from './context'
import { ESpherePointPreset, type TCameraResolution, type TSphere, type TSuperFile } from './types'
import { CAMERA_RESOLUTIONS, SPHERE_POINT_PRESETS } from './constants'
import { positionToHSL, uuidv4 } from './utils'

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
  const [spheres, setSpheres] = useState<TSphere[]>([])
  const [spherePointPreset, setSpherePointPreset] = useState<ESpherePointPreset>(
    ESpherePointPreset.DEFAULT
  )

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
      photosLeft: spheres.length - photoFiles.length,
      overSphere,
      setOverSphere,
      cameraAngle,
      setCameraAngle,
      cameraResolution,
      setCameraResolution,
      spheres,
      setSpheres,
      spherePointPreset,
      setSpherePointPreset
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
      spheres,
      spherePointPreset
    ]
  )

  useEffect(() => {
    const points = SPHERE_POINT_PRESETS[spherePointPreset]
    setSpheres(
      points.map((point) => ({
        id: uuidv4(),
        point,
        color: positionToHSL(point.x, point.y, point.z)
      }))
    )
  }, [spherePointPreset])

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>
}
