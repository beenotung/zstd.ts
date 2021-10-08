import { readFileSync, unlinkSync } from 'fs'
import { expect } from 'chai'
import {
  compress,
  compressSync,
  decompress,
  decompressSync,
} from '../src/index'
import { execSync } from 'child_process'

describe('zstd.ts core TestSuit', () => {
  let expectedDefaultCompressed: Buffer
  let expectedLeveledCompressed: Buffer[]
  before(() => {
    execSync('echo -n test | zstd > raw')
    expectedDefaultCompressed = readFileSync('raw')
    expectedLeveledCompressed = []
    for (let i = 1; i <= 19; i++) {
      execSync(`echo -n test | zstd -${i} > raw`)
      expectedLeveledCompressed[i] = readFileSync('raw')
    }
    unlinkSync('raw')
  })
  context('sync API', () => {
    context('test with default compress level', () => {
      it('should compress with default compress level', () => {
        let actualCompressed = compressSync({ input: 'test' })
        expect(actualCompressed).to.deep.equals(expectedDefaultCompressed)
      })
      it('should decompress from default compress level', () => {
        let decompressed = decompressSync({ input: expectedDefaultCompressed })
        expect(decompressed.toString()).to.equals('test')
      })
    })

    context('test with 1-19 compress level', () => {
      for (let i = 1; i <= 19; i++) {
        it('should compress with compress level ' + i, () => {
          let actualCompressed = compressSync({
            input: 'test',
            compressLevel: i,
          })
          expect(actualCompressed).to.deep.equals(expectedLeveledCompressed[i])
        })
        it('should decompress with compress level ' + i, () => {
          let decompressed = decompressSync({
            input: expectedLeveledCompressed[i],
          })
          expect(decompressed.toString()).to.equals('test')
        })
      }
    })
  })
  context('async API', () => {
    context('async function overload', () => {
      context('compress()', () => {
        it('should invoke callback if given', done => {
          compress({ input: 'test' }, (error, actualCompressed) => {
            expect(error).to.be.null
            expect(actualCompressed).to.deep.equals(expectedDefaultCompressed)
            done()
          })
        })
        it('should return promise if not given callback', done => {
          let promise = compress({ input: 'test' })
          expect(promise).not.undefined
          expect(promise.then).to.be.a('function')
          promise.then(actualCompressed => {
            expect(actualCompressed).to.deep.equals(expectedDefaultCompressed)
            done()
          })
        })
      })
      context('decompress()', () => {
        it('should invoke callback if given', done => {
          decompress(
            { input: expectedDefaultCompressed },
            (error, actualDecompressed) => {
              expect(error).to.be.null
              expect(actualDecompressed.toString()).to.equals('test')
              done()
            },
          )
        })
        it('should return promise if not given callback', done => {
          let promise = decompress({ input: expectedDefaultCompressed })
          expect(promise).not.undefined
          expect(promise.then).to.be.a('function')
          promise.then(actualDecompressed => {
            expect(actualDecompressed.toString()).to.equals('test')
            done()
          })
        })
      })
    })
    context('test with default compress level', () => {
      let actualCompressed: Buffer
      it('should compress with default compress level', done => {
        compress({ input: 'test' }, (error, result) => {
          expect(error).to.be.null
          expect(result).to.deep.equals(expectedDefaultCompressed)
          actualCompressed = result
          done()
        })
      })
      it('should decompress from default compress level', done => {
        decompress({ input: actualCompressed }, (error, decompressed) => {
          expect(error).to.be.null
          expect(decompressed.toString()).to.equals('test')
          done()
        })
      })
    })
    context('test with 1-19 compress level', () => {
      for (let i = 1; i <= 19; i++) {
        it('should compress with compress level ' + i, done => {
          compress(
            {
              input: 'test',
              compressLevel: i,
            },
            (error, actualCompressed) => {
              expect(error).to.be.null
              expect(actualCompressed).to.deep.equals(
                expectedLeveledCompressed[i],
              )
              done()
            },
          )
        })
        it('should decompress with compress level ' + i, done => {
          decompress(
            {
              input: expectedLeveledCompressed[i],
            },
            (error, decompressed) => {
              expect(error).to.be.null
              expect(decompressed.toString()).to.equals('test')
              done()
            },
          )
        })
      }
    })
  })
})
