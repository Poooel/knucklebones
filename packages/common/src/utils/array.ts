export function getMaxBy<T extends Object>(array: T[], key: keyof T) {
  return array.reduce((acc, current) => {
    return current[key] > acc[key] ? current : acc
  })
}

export function getMinBy<T extends Object>(array: T[], key: keyof T) {
  return array.reduce((acc, current) => {
    return current[key] < acc[key] ? current : acc
  })
}

export function sum(array: number[]): number {
  return array.reduce((accumulator, total) => accumulator + total, 0)
}
