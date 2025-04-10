import { useApp } from '../contexts/app-context'
import { Box, Typography } from '@mui/material'

export default function CameraResolutionIndicator() {
  const { cameraResolution, permissionGranted } = useApp()

  if (!permissionGranted) return null

  return (
    <Box position="absolute" top={20} left={20} zIndex={2}>
      <Typography
        variant="body1"
        color="common.white"
        sx={{
          textAlign: 'left',
          textShadow: '0 0 3px rgba(0,0,0,0.8)'
        }}
      >
        {cameraResolution.width}&times;{cameraResolution.height}
        <br />
        {cameraResolution.aspectRatio}
      </Typography>
    </Box>
  )
}
