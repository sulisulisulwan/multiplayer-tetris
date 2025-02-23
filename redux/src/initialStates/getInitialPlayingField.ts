export const getInitialPlayfield = function () {
  const initialPlayfield = new Array(40).fill(null)
  return initialPlayfield.map(row => new Array(10).fill('[_]', 0, 10))
}