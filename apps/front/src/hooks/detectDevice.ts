import { useMedia } from 'react-use'

export function useIsOnMobile() {
  return !useMedia('(min-width: 1024px)')
}

export function useIsOnDesktop() {
  return useMedia('(min-width: 1024px)')
}
