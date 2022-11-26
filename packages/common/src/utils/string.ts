export function isEmptyOrBlank(string: string) {
  return string.trim() === ''
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
