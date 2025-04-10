import { useApp } from '../contexts/app-context'
import { Box, Stack, Typography } from '@mui/material'
import Iconify from '../components/iconify'

export default function PhotosLeftIndicator() {
  const { spheres, photosLeft, permissionGranted } = useApp()

  if (photosLeft === 0) return null
  if (!permissionGranted) return null

  return (
    <Box
      position="absolute"
      bottom="5rem"
      left="50%"
      zIndex={2}
      sx={{ transform: 'translateX(-50%)' }}
    >
      <Stack direction="column" alignItems="center" justifyContent="center">
        <Iconify
          icon="material-symbols:photo-camera"
          sx={{
            color: 'common.white',
            filter: 'drop-shadow(0 0 2px black)'
          }}
        />
        <Typography
          variant="body1"
          color="common.white"
          sx={{
            textAlign: 'left',
            textShadow: '0 0 3px rgba(0,0,0,0.8)'
          }}
        >
          {photosLeft} of {spheres.length}
        </Typography>
      </Stack>
    </Box>
  )
}
