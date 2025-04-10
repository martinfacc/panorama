import { useApp } from '../contexts/app-context'
import { Box, Stack, Typography } from '@mui/material'

export default function CameraAngleIndicator() {
  const { cameraAngle, permissionGranted } = useApp()

  if (!permissionGranted) return null

  return (
    <Box position="absolute" top={20} right={20} zIndex={2}>
      <Stack direction="column">
        <Typography
          variant="body1"
          color="common.white"
          sx={{
            textAlign: 'right',
            textShadow: '0 0 3px rgba(0,0,0,0.8)'
          }}
        >
          &alpha;: {cameraAngle.alpha.toFixed(2)}°
          <br />
          &beta;: {cameraAngle.beta.toFixed(2)}°
          <br />
          &gamma;: {cameraAngle.gamma.toFixed(2)}°
          <br />
        </Typography>
      </Stack>
    </Box>
  )
}
