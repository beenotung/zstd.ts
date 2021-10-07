import { readFileSync, unlinkSync } from 'fs'
import { expect } from 'chai'
import { compressSync, decompressSync } from '../src/index'
import { execSync } from 'child_process'

describe('zstd.ts core TestSuit', () => {
  context('test with default compress level', () => {
    let actualCompressed: Buffer
    it('should compress with default compress level', () => {
      execSync('echo -n test | zstd > raw')
      let expectedCompressed = readFileSync('raw')
      actualCompressed = compressSync({ input: 'test' })
      expect(actualCompressed).to.deep.equals(expectedCompressed)
      unlinkSync('raw')
    })
    it('should decompress from default compress level', () => {
      let decompressed = decompressSync({ input: actualCompressed })
      expect(decompressed.toString()).to.equals('test')
    })
  })

  context('test with 1-19 compress level', () => {
    for (let i = 1; i <= 19; i++) {
      let actualCompressed: Buffer
      it('should compress with compress level ' + i, () => {
        execSync(`echo -n test | zstd -${i} > raw`)
        let expectedCompressed = readFileSync('raw')
        actualCompressed = compressSync({ input: 'test', compressLevel: i })
        expect(actualCompressed).to.deep.equals(expectedCompressed)
      })
      it('should decompress with compress level ' + i, () => {
        let decompressed = decompressSync({ input: actualCompressed })
        expect(decompressed.toString()).to.equals('test')
      })
    }
    after(() => {
      unlinkSync('raw')
    })
  })
})
