import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useApp } from '../contexts/app-context'
import { type TSuperFile } from '../contexts/app-context'
import { Howl } from 'howler'

function playSnapSound() {
  const sound = new Howl({
    src: ['/snap.mp3'],
    volume: 0.5,
    preload: true
  })
  sound.play()
}

export default function AutoCaptureNotifier() {
  const {
    currentScene,
    currentCamera,
    rendererRef,
    overSphere,
    setOverSphere,
    setPhotoFiles,
    setCameraAngle
  } = useApp()
  const overStartTimeRef = useRef<number | null>(null)
  const lastIntersectedIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!currentScene || !currentCamera || !rendererRef.current) {
      console.warn('Current scene or camera is not available.')
    }

    if (currentScene && currentCamera && rendererRef.current) {
      const raycaster = new THREE.Raycaster()
      const center = new THREE.Vector2(0, 0)

      const checkIntersection = () => {
        raycaster.setFromCamera(center, currentCamera)
        const intersects = raycaster.intersectObjects(currentScene.children, true)

        if (intersects.length > 0) {
          const intersectedObject = intersects[0].object
          const sphereId = intersectedObject.userData.id

          if (sphereId) {
            if (lastIntersectedIdRef.current !== sphereId) {
              // Nueva esfera: resetear el temporizador
              overStartTimeRef.current = performance.now()
              lastIntersectedIdRef.current = sphereId
              setOverSphere(true)
            } else {
              const elapsed = performance.now() - (overStartTimeRef.current ?? 0)
              if (elapsed >= 1000) {
                const cameraDirection = new THREE.Vector3()
                currentCamera.getWorldDirection(cameraDirection)
                cameraDirection.normalize()
                takePhoto(sphereId, cameraDirection)
                overStartTimeRef.current = null
                lastIntersectedIdRef.current = null
                setOverSphere(false)
              }
            }
          }
        } else {
          if (overSphere) {
            setOverSphere(false)
          }
          overStartTimeRef.current = null
          lastIntersectedIdRef.current = null
        }

        requestAnimationFrame(checkIntersection)
      }

      const takePhoto = (sphereId: string, cameraVector: THREE.Vector3) => {
        const renderer = rendererRef.current
        if (!renderer) return

        const spheres: THREE.Mesh[] = currentScene.children.filter(
          (obj) => obj instanceof THREE.Mesh && obj.geometry instanceof THREE.SphereGeometry
        ) as THREE.Mesh[]

        const sphere = spheres.find((s) => s.userData.id === sphereId)
        if (sphere) {
          const videoTexture = currentScene.background as THREE.VideoTexture
          if (!(videoTexture instanceof THREE.VideoTexture) || !videoTexture.image) {
            console.error('No video texture found on the scene background.')
            return
          }

          const video = videoTexture.image as HTMLVideoElement
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')

          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            canvas.toBlob((blob) => {
              if (blob) {
                const filename = sphere.userData.id
                const file = new File([blob], `${filename}.png`, {
                  type: 'image/png'
                }) as TSuperFile

                const theta = Math.atan2(cameraVector.z, cameraVector.x)
                const phi = Math.asin(cameraVector.y)
                const thetaDeg = (theta * 180) / Math.PI
                const phiDeg = (phi * 180) / Math.PI

                file.id = sphere.userData.id
                file.cameraTheta = thetaDeg
                file.cameraPhi = phiDeg
                file.spheraTheta = sphere.userData.theta
                file.spheraPhi = sphere.userData.phi

                setCameraAngle((prev) => {
                  file.alpha = prev.alpha
                  file.beta = prev.beta
                  file.gamma = prev.gamma
                  return prev
                })
                setPhotoFiles((prevFiles) => [...prevFiles, file])
                currentScene.remove(sphere)
                playSnapSound()
              }
            }, 'image/png')
          }
        }
      }

      requestAnimationFrame(checkIntersection)
    }

    return () => {
      overStartTimeRef.current = null
      lastIntersectedIdRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene, currentCamera, rendererRef, overSphere])

  return null
}
