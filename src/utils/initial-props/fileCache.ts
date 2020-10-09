// import * as os from 'os'

// const readFile = promises.readFile
// const writeFile = promises.writeFile
// const cacheRootPath = os.tmpdir() + '/'
let localCache: { key: string; content: any }[] = []

export const clearFileCache = () => {
  localCache = []
}

// const getFullPath = (filename: string): string => `${cacheRootPath}${filename}.json`

export const checkCacheFileExists = (filename: string) => {
  return !!localCache.find((item) => item.key === filename)
}

export const readCacheFile = async (filename: string) => {
  const current = localCache.find((item) => item.key === filename)
  if (current) {
    return current.content
  }
  throw new Error('cache not found')
}

export const writeCacheFile = async (filename: string, content: any) => {
  if (!localCache.find((item) => item.key === filename)) {
    localCache.push({ key: filename, content })
  }
  return content
}
