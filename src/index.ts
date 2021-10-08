import { spawn, spawnSync } from 'child_process'

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

export type CompressOptions = CompressSyncOptions

export function compress(options: CompressOptions): Promise<Buffer>
export function compress(
  options: CompressOptions,
  callback: (error: any, buffer: Buffer) => void,
): void
export function compress(
  options: CompressOptions,
  maybeCallback?: (error: any, buffer: Buffer) => void,
): Promise<Buffer> | void {
  if (!maybeCallback) {
    return new Promise((resolve, reject) =>
      compress(options, (error, result) =>
        error ? reject(error) : resolve(result),
      ),
    )
  }
  const callback = maybeCallback
  const cmd = 'zstd'
  const args: string[] = []
  if ('compressLevel' in options) {
    args.push('-' + options.compressLevel)
  }
  const child = spawn(cmd, args)
  const buffer: Buffer[] = []
  let totalLength = 0
  let hasError = false
  child.stdout
    .on('data', chunk => {
      if (hasError) return
      buffer.push(chunk)
      totalLength += chunk.length
    })
    .on('error', error => {
      if (hasError) return
      hasError = true
      callback(error, null as any)
    })
    .on('end', () => {
      if (!hasError) callback(null, Buffer.concat(buffer, totalLength))
    })
  child.stdin.write(options.input)
  child.stdin.end()
}

export type DecompressSyncOptions = {
  input: Buffer
}

/** @deprecated renamed to DecompressSyncOptions */
export type DeCompressSyncOptions = DecompressSyncOptions

export function decompressSync(options: DecompressSyncOptions): Buffer {
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

export type DecompressOptions = DecompressSyncOptions

export function decompress(options: DecompressSyncOptions): Promise<Buffer>
export function decompress(
  options: DecompressSyncOptions,
  callback: (error: any, buffer: Buffer) => void,
): void
export function decompress(
  options: DecompressSyncOptions,
  maybeCallback?: (error: any, buffer: Buffer) => void,
): Promise<Buffer> | void {
  if (!maybeCallback) {
    return new Promise((resolve, reject) =>
      decompress(options, (error, result) =>
        error ? reject(error) : resolve(result),
      ),
    )
  }
  const callback = maybeCallback
  const child = spawn('unzstd')
  const buffer: Buffer[] = []
  let totalLength = 0
  let hasError = false
  child.stdout
    .on('data', chunk => {
      if (hasError) return
      buffer.push(chunk)
      totalLength += chunk.length
    })
    .on('error', error => {
      if (hasError) return
      hasError = true
      callback(error, null as any)
    })
    .on('end', () => {
      if (!hasError) callback(null, Buffer.concat(buffer, totalLength))
    })
  child.stdin.write(options.input)
  child.stdin.end()
}
