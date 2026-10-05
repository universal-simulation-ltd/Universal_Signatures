import { useEffect, useState } from 'react'

// True on touch-first devices (phones, tablets): the primary pointer is a
// finger. Tracks live, so plugging in a mouse updates the UI without a reload.
// The same hook as Universal PDF's.
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(pointer: coarse)')
    setCoarse(mq.matches)
    const handler = (e: MediaQueryListEvent) => setCoarse(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return coarse
}
