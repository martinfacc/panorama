import { Box } from '@mui/material'
import { AppProvider } from '../contexts/app-context'
import ThreeScene from './three-scene'

export default function TableroView() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AppProvider>
        <ThreeScene />
      </AppProvider>
    </Box>
  )
}
