type Options = {
  total?: number
  sameLine?: boolean
  minIter?: number
  minInterval?: number
  render?: (
    n: number,
    total: number,
    elapsed: number,
    sameLine: boolean,
  ) => string
}
function tqdm<T extends Iterable>(iterable: T, options?: Options): T

export default tqdm
