import { useMedia } from 'react-use'

export function useIsOnMobile() {
  return !useMedia('(min-width: 768px)')
}

export function useIsOnDesktop() {
  return useMedia('(min-width: 768px)')
}
