import { useState, useEffect } from 'react'

type TSize = {
  width: number
  height: number
}

export function useWindowSize(): TSize {
  const [size, setSize] = useState<TSize>({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    let timeoutId: number | null = null

    const handleResize = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }

      timeoutId = window.setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
        timeoutId = null
      }, 300)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return size
}
