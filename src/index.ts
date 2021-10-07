import { spawnSync } from 'child_process'

export type CompressSyncOptions = {
  compressLevel?: number // 1 to 19, default is 3
  input: string | Buffer
}

export function compressSync(options: CompressSyncOptions): Buffer {
  const cmd = 'zstd'
  const args: string[] = []
  if ('compressLevel' in options) {
    args.push('-' + options.compressLevel)
  }
  const result = spawnSync(cmd, args, {
    input: options.input,
  })
  if (result.error) {
    throw result.error
  }
  if (result.status) {
    throw new Error(result.stderr.toString())
  }
  return result.stdout
}

export type DeCompressSyncOptions = {
  input: Buffer
}

export function decompressSync(options: DeCompressSyncOptions): Buffer {
  const result = spawnSync('unzstd', {
    input: options.input,
  })
  if (result.error) {
    throw result.error
  }
  if (result.status) {
    throw new Error(result.stderr.toString())
  }
  return result.stdout
}
