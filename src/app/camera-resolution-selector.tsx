import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { CAMERA_RESOLUTIONS, useApp } from '../contexts/app-context'

export default function CameraResolutionSelector() {
  const { permissionGranted, cameraResolution, setCameraResolution } = useApp()

  if (permissionGranted) return null

  return (
    <Box
      position="absolute"
      top="calc(50% - 75px)"
      left="50%"
      zIndex={3}
      sx={{
        transform: 'translate(-50%, -50%)'
      }}
    >
      <FormControl size="small" sx={{ width: 200 }}>
        <InputLabel id="camera-resolution-label">Resolución de cámara</InputLabel>
        <Select
          labelId="camera-resolution-label"
          value={cameraResolution}
          label="Resolución de cámara"
          // @ts-expect-error no-types
          onChange={(event) => setCameraResolution(event.target.value)}
          renderValue={(selected) =>
            `${selected.width} x ${selected.height} (${selected.aspectRatio})`
          }
        >
          {CAMERA_RESOLUTIONS.map((option) => (
            // @ts-expect-error no-types
            <MenuItem key={`${option.width}x${option.height}`} value={option}>
              {option.width} x {option.height} ({option.aspectRatio})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
