import React, { useEffect } from 'react'
import * as THREE from 'three'
import EnableSensorsButton from './enable-sensors-button'
import PhotoDownloaderButton from './photo-downloader-button'
import FocusRing from './focus-ring'
import AutoCaptureNotifier from './auto-capture-notifier'
import PhotosLeftIndicator from './photos-left-indicator'
import CameraAngleIndicator from './camera-angle-indicator'
import CameraResolutionSelector from './camera-resolution-selector'
import {
  generateVariableSpherePoints,
  positionToHSL,
  SPHERE_DISTANCE,
  SPHERE_OPACITY,
  SPHERE_RADIUS,
  SPHERE_SEGMENTS,
  useApp,
  uuidv4
} from '../contexts/app-context'
import CameraResolutionIndicator from './camera-resolution-indicator'

export default function ThreeScene() {
  const {
    cameraResolution,
    mountRef,
    rendererRef,
    permissionGranted,
    setCurrentScene,
    setCurrentCamera,
    setCameraAngle
  } = useApp()

  useEffect(() => {
    const mountNode = mountRef.current
    if (!mountNode) return
    if (!permissionGranted) return

    // ---------------------------
    // CREACIÓN DE LA ESCENA Y LA CÁMARA
    // ---------------------------
    const scene = new THREE.Scene()
    setCurrentScene(scene)
    const camera = new THREE.PerspectiveCamera(
      75,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 0)
    setCurrentCamera(camera)

    // ---------------------------
    // CONFIGURACIÓN DEL RENDERER
    // ---------------------------
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight)
    mountNode.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // ---------------------------
    // CREACIÓN Y AGREGADO DE ESFERAS A LA ESCENA
    // ---------------------------
    const points = generateVariableSpherePoints(12, 1, 5, SPHERE_DISTANCE)
    points.forEach((point) => {
      const { x, y, z } = point
      const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS)
      const color = positionToHSL(x / SPHERE_DISTANCE, y / SPHERE_DISTANCE, z / SPHERE_DISTANCE)
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: SPHERE_OPACITY
      })
      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(x, y, z)

      sphere.userData = {
        id: uuidv4()
      }

      scene.add(sphere)
    })

    // ---------------------------
    // AGREGAR VIDEO DE FONDO DE LA CÁMARA
    // ---------------------------
    const video = document.createElement('video')
    video.autoplay = true
    video.playsInline = true
    video.muted = true
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { exact: 'environment' },
          width: { ideal: cameraResolution.width },
          height: { ideal: cameraResolution.height }
        },
        audio: false
      })
      .then((stream) => {
        video.srcObject = stream
        video.play()
        const videoTexture = new THREE.VideoTexture(video)
        videoTexture.minFilter = THREE.LinearFilter
        videoTexture.magFilter = THREE.LinearFilter
        videoTexture.format = THREE.RGBFormat
        scene.background = videoTexture
      })
      .catch((err) => {
        console.error('Error al acceder a la cámara:', err)
      })

    // ---------------------------
    // CONFIGURAR LA ORIENTACIÓN DEL DISPOSITIVO
    // ---------------------------
    let alpha = 0
    let beta = 0
    let gamma = 0

    const euler = new THREE.Euler()
    const deviceQuaternion = new THREE.Quaternion()
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha === null || event.beta === null || event.gamma === null) return

      setCameraAngle({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      })

      alpha = THREE.MathUtils.degToRad(event.alpha)
      beta = THREE.MathUtils.degToRad(event.beta)
      gamma = THREE.MathUtils.degToRad(event.gamma)

      euler.set(beta, alpha, -gamma, 'YXZ')
      deviceQuaternion.setFromEuler(euler)
      deviceQuaternion.multiply(q1)
      camera.quaternion.copy(deviceQuaternion)
    }

    window.addEventListener('deviceorientation', handleOrientation, true)

    // ---------------------------
    // LOOP DE ANIMACIÓN
    // ---------------------------
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // ---------------------------
    // GESTIÓN DEL REDIMENSIONAMIENTO DE LA VENTANA
    // ---------------------------
    const onWindowResize = () => {
      if (!mountNode) return
      camera.aspect = mountNode.clientWidth / mountNode.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountNode.clientWidth, mountNode.clientHeight)
    }
    window.addEventListener('resize', onWindowResize)

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true)
      window.removeEventListener('resize', onWindowResize)
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionGranted])

  return (
    <React.Fragment>
      {mountRef !== null && (
        <div
          // @ts-ignore
          ref={mountRef}
          style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}
        >
          <CameraResolutionSelector />
          <CameraResolutionIndicator />
          <CameraAngleIndicator />
          <AutoCaptureNotifier />
          <EnableSensorsButton />
          <PhotosLeftIndicator />
          <PhotoDownloaderButton />
          <FocusRing />
        </div>
      )}
    </React.Fragment>
  )
}
