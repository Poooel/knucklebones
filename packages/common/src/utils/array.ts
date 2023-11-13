export function getMaxBy<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T
) {
  return array.reduce((acc, current) => {
    return current[key] > acc[key] ? current : acc
  })
}

export function getMinBy<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T
) {
  return array.reduce((acc, current) => {
    return current[key] < acc[key] ? current : acc
  })
}

export function sortBy<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T,
  order: 'ascending' | 'descending' = 'ascending'
) {
  array = array.slice()

  return array.sort((a, b) => {
    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
      if (order === 'ascending') {
        return a[key] > b[key] ? 1 : -1
      } else {
        return a[key] > b[key] ? -1 : 1
      }
    } else {
      throw new Error('Unsupported type for comparison')
    }
  })
}

export function sum(array: number[]): number {
  return array.reduce((accumulator, total) => accumulator + total, 0)
}
