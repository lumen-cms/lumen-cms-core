export default function web3DataFetcher(...args: string[]) {
  const [path, chain, functions, account] = args
  const functionNames = (functions || '').split(',').map((i) => i.trim())
  if (!functionNames.length) {
    return null
  }
  const params = new URLSearchParams()
  params.append('chain', chain)
  params.append('functions', functionNames.join(','))
  if (account) {
    params.append('userToken', account)
  }
  const currentPathToApi = path + '?' + params.toString()
  return fetch(currentPathToApi).then((r) => r.json())
}
