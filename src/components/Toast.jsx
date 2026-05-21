import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500)
    return () => clearTimeout(timer)
  }, [onClose])

  const bg = type === 'error' ? 'bg-red-500' : 'bg-green-500'

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg ${bg}`}>
      {message}
    </div>
  )
}
