# zstd.ts

compress and decompress using system-installed zstd and unzstd

[![npm Package Version](https://img.shields.io/npm/v/zstd.ts.svg?maxAge=3600)](https://www.npmjs.com/package/zstd.ts)

# Features

- [x] Typescript support
- [x] Support sync mode
- [x] Support async mode
- [x] Tested with mocha
- [x] No dependency on other packages

# Usage Example

```typescript
import { compress, decompress } from 'zstd.ts'
import { compressSync, decompressSync } from 'zstd.ts'

let compressed: Buffer = compressSync({ input: 'test' })
let uncompressed: Buffer = decompressSync({ input: compressed })
let matched = uncompressed.toString() == 'test'
console.log(matched) // true
```

# Typescript Signature

```typescript
export type CompressOptions = {
  compressLevel?: number // range: 1 - 19 (default level is 3)
  input: string | Buffer
}

export function compressSync(options: CompressOptions): Buffer

export function compress(options: CompressOptions): Promise<Buffer>
export function compress(
  options: CompressOptions,
  callback: (error: any, buffer: Buffer) => void,
): void

export type DecompressOptions = {
  input: Buffer
}

export function decompressSync(options: DecompressOptions): Buffer

export function decompress(options: DecompressOptions): Promise<Buffer>
export function decompress(
  options: DecompressOptions,
  callback: (error: any, buffer: Buffer) => void,
): void
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
