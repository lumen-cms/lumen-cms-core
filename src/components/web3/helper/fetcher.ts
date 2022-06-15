export async function fetchApiCall(
  path: string,
  params: { [k: string]: string }
) {
  const url = `${process.env.STORYBOOK ? 'http://localhost:3000' : ''}${path}`
  const searchParams = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key])
  })
  const fullPath = url + '?' + searchParams.toString()
  return fetch(fullPath).then((res) => res.json())
}
