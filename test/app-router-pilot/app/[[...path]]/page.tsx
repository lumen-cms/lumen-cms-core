import { notFound } from 'next/navigation'
import { cachedPage, entries, pathnameFrom } from '../shared/data'
import { PublicPage } from '@core/app-router/PublicPage'
import { ResourceScripts } from '@core/app-router/Resources'
import { publicMetadata } from '@core/app-router/metadata'
import { Hydrated } from '../shared/Hydrated'

export const dynamic = 'error'
export const dynamicParams = true
export const revalidate = false
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1
}

type Props = { params: Promise<{ path?: string[] }> }
export async function generateStaticParams() {
  return (await entries())
    .filter((entry) => entry.prebuild)
    .map((entry) => ({ path: entry.path.split('/').filter(Boolean) }))
}
export async function generateMetadata({ params }: Props) {
  const pathname = pathnameFrom((await params).path)
  const content = await cachedPage(pathname)
  if (!content?.page) notFound()
  return publicMetadata(content, pathname)
}
export default async function Page({ params }: Props) {
  const content = await cachedPage(pathnameFrom((await params).path))
  if (!content?.page || !content.settings) notFound()
  return (
    <>
      <PublicPage content={content} />
      <ResourceScripts settings={content.settings} />
      <Hydrated />
    </>
  )
}
