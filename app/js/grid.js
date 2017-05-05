import * as R from 'ramda'

export const getX = index => index % 32

export const getY = index => Math.floor(index / 32)

export const getIndex = (x, y) => 32 * y + x

export const addC = (c, a) => R.mathMod(c + a, 32)

export const threesome = index => [
  getIndex(addC(getX(index), -1), getY(index)),
  index,
  getIndex(addC(getX(index), +1), getY(index))
]
