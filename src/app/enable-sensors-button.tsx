import { useApp } from '../contexts/app-context'
import { Button, Box } from '@mui/material'
import Iconify from '../components/iconify'

export default function EnableSensorsButton() {
  const { permissionGranted, setPermissionGranted } = useApp()

  const requestPermission = () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      // @ts-expect-error no-types
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      // @ts-expect-error no-types
      DeviceOrientationEvent.requestPermission()
        .then((response: 'granted' | 'denied') => {
          if (response === 'granted') {
            setPermissionGranted(true)
          }
        })
        .catch(console.error)
    } else {
      setPermissionGranted(true)
    }
  }

  if (permissionGranted) return null

  return (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      zIndex={2}
      sx={{
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Button size="small" variant="contained" onClick={requestPermission}>
        <Iconify icon="game-icons:gyroscope" sx={{ mr: 1 }} />
        Enable Sensors
      </Button>
    </Box>
  )
}
