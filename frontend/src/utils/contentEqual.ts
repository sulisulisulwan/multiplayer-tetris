const contentEqual = (arr1: any[], arr2: any[]): boolean => {

  if (arr1.length !== arr2.length) return false

  const sorted1 = arr1.sort()
  const sorted2 = arr2.sort()

  return sorted1.every((el: any, index: number) => {
    return el === sorted2[index]
  })
}

export default contentEqual