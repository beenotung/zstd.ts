import { compress, decompress } from 'zstd.ts'
import { compressSync, decompressSync } from 'zstd.ts'

let compressed: Buffer = compressSync({ input: 'test' })
let uncompressed: Buffer = decompressSync({ input: compressed })
let matched = uncompressed.toString() == 'test'
console.log(matched) // true
