import { notFound } from 'next/navigation'
import { cachedPage, pathnameFrom } from '../shared/data'
import { ResourceHead } from '@core/app-router/Resources'

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ path?: string[] }>
}) {
  const content = await cachedPage(pathnameFrom((await params).path))
  if (!content?.page || !content.settings) notFound()
  return (
    <html lang={content.locale}>
      <head>
        <ResourceHead settings={content.settings} />
      </head>
      <body className="lm-body__root">{children}</body>
    </html>
  )
}
