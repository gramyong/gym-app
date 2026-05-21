import { useEffect, useState } from 'react'
import { ImageStore } from '../store/ImageStore'

export default function SessionPhoto({ imageId, className = '' }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    if (!imageId) return
    let objectUrl
    ImageStore.get(imageId).then(blob => {
      if (blob) {
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      }
    })
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [imageId])

  if (!src) return null
  return <img src={src} alt="운동 사진" className={`object-cover rounded-xl ${className}`} />
}
