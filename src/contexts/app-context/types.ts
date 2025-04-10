import React from 'react'
import * as THREE from 'three'

export enum EAspectRatio {
  '16:9' = '16:9',
  '18:9' = '18:9',
  '19:9' = '19:9',
  '4:3' = '4:3'
}

export type TSuperFile = File & {
  id: string
  alpha: number
  beta: number
  gamma: number
  cameraTheta: number
  cameraPhi: number
  spheraTheta: number
  spheraPhi: number
}

export type TCameraResolution = {
  width: number
  height: number
  aspectRatio: EAspectRatio
}

export type TPoint = {
  x: number
  y: number
  z: number
  theta: number
  phi: number
}

export type TSphere = {
  id: string
  point: TPoint
  color: string
}

export type TAppContext = {
  mountRef: React.RefObject<HTMLDivElement | null>
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>
  permissionGranted: boolean
  setPermissionGranted: React.Dispatch<React.SetStateAction<boolean>>
  currentScene: THREE.Scene | null
  setCurrentScene: React.Dispatch<React.SetStateAction<THREE.Scene | null>>
  currentCamera: THREE.PerspectiveCamera | null
  setCurrentCamera: React.Dispatch<React.SetStateAction<THREE.PerspectiveCamera | null>>
  photoFiles: TSuperFile[]
  setPhotoFiles: React.Dispatch<React.SetStateAction<TSuperFile[]>>
  photosLeft: number
  overSphere: boolean
  setOverSphere: React.Dispatch<React.SetStateAction<boolean>>
  cameraAngle: {
    alpha: number
    beta: number
    gamma: number
  }
  setCameraAngle: React.Dispatch<
    React.SetStateAction<{
      alpha: number
      beta: number
      gamma: number
    }>
  >
  cameraResolution: TCameraResolution
  setCameraResolution: React.Dispatch<React.SetStateAction<TCameraResolution>>
  spheres: TSphere[]
  setSpheres: React.Dispatch<React.SetStateAction<TSphere[]>>
}
