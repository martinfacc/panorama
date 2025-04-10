import { CircularProgress, Box } from '@mui/material'
import { useApp } from '../contexts/app-context'
import { useWindowSize } from '../hooks/use-window-size'

const M_FACTOR = 0.08

export default function FocusRing() {
  const { height } = useWindowSize()
  const { permissionGranted, overSphere } = useApp()

  const RING_SIZE = height * M_FACTOR

  if (!permissionGranted) return null

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: '50%',
        boxShadow: overSphere ? `0 0 10px 5px rgba(34, 197, 94, 0.4)` : 'none'
      }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={RING_SIZE}
        sx={{
          color: overSphere ? 'rgba(34, 197, 94)' : 'rgba(34, 197, 94, 0.3)'
        }}
      />
    </Box>
  )
}
