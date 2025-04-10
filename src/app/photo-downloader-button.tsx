import JSZip from 'jszip'
import { useApp } from '../contexts/app-context'
import { Button, Box } from '@mui/material'
import Iconify from '../components/iconify'

export default function PhotoDownloaderButton() {
  const { photoFiles, permissionGranted } = useApp()

  const downloadPhotos = () => {
    if (photoFiles.length === 0) return

    const zip = new JSZip()

    const metadata: Array<{
      id: string
      alpha: number
      beta: number
      gamma: number
      theta: number
      phi: number
    }> = []

    photoFiles.forEach((file) => {
      metadata.push({
        id: file.name,
        alpha: file.alpha,
        beta: file.beta,
        gamma: file.gamma,
        theta: file.theta,
        phi: file.phi
      })
      zip.file(`${file.name}`, file)
    })

    zip.file('metadata.json', JSON.stringify(metadata, null, 2))

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `photos-${new Date().toISOString().replace(/:/g, '-')}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  if (!permissionGranted) return null

  return (
    <Box
      position="absolute"
      bottom="2rem"
      left="50%"
      zIndex={2}
      sx={{
        transform: 'translateX(-50%)'
      }}
    >
      <Button variant="contained" onClick={downloadPhotos} disabled={photoFiles.length === 0}>
        <Iconify icon="material-symbols:download" sx={{ mr: 1 }} />
        Descargar Fotos
      </Button>
    </Box>
  )
}
