import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { ESpherePointPreset, useApp } from '../contexts/app-context'

export default function SpherePointPresetSelector() {
  const { permissionGranted, spherePointPreset, setSpherePointPreset } = useApp()

  if (permissionGranted) return null

  return (
    <Box
      position="absolute"
      top="calc(50% - 150px)"
      left="50%"
      zIndex={3}
      sx={{
        transform: 'translate(-50%, -50%)'
      }}
    >
      <FormControl size="small" sx={{ width: 200 }}>
        <InputLabel id="sphere-point-preset-label">Sphere Point Preset</InputLabel>
        <Select
          labelId="sphere-point-preset-label"
          value={spherePointPreset}
          label="Resolución de cámara"
          // @ts-expect-error no-types
          onChange={(event) => setSpherePointPreset(event.target.value)}
          renderValue={(selected) => selected}
        >
          {Object.values(ESpherePointPreset).map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
