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

/**
 * The shorter side of the screen, in CSS px, below which a touch device is a
 * phone rather than a tablet. Android's own tablet line (sw600dp): the largest
 * phones are about 440 on their short side, the smallest iPad (mini) is 744.
 */
export const PHONE_MAX_SHORT_SIDE = 600

/** A touch device with a phone-sized screen, read once, outside React. */
export function isTouchPhone(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  if (!window.matchMedia('(pointer: coarse)').matches) return false
  // The SCREEN, not the window: a phone turned sideways is ~900 wide but still
  // a phone, and an iPad in Split View has a narrow window but is a tablet.
  const s = window.screen
  return Math.min(s.width, s.height) < PHONE_MAX_SHORT_SIDE
}

// True on a phone you are holding: touch-first AND a phone-sized screen. A
// tablet is touch-first too but is not counted — on an iPad, signing on the
// phone in your pocket is a real choice (the pad is big, but a finger on glass
// held at arm's length is not how most people sign), so "Sign on phone" stays
// there and only goes away on the phone itself (James, 2026-10-09).
export function useTouchPhone(): boolean {
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const update = () => setPhone(isTouchPhone())
    update()
    const mq = window.matchMedia('(pointer: coarse)')
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return phone
}
