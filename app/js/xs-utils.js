import xstream from 'xstream'

export const switchMap = (stream, f) =>
  stream.map(f).flatten()

export const switchMapPromise = (stream, f) =>
  switchMap(stream, x => xstream.fromPromise(f(x)))
