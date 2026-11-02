import type { GetStaticProps, GetStaticPaths } from 'next'
import { entries, readPage, pathnameFrom } from '../shared/data'

export { Auth0Page as default } from '@core/components/pages/Auth0Page'
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await entries())
    .filter((entry) => entry.prebuild)
    .map((entry) => ({
      params: { path: entry.slug.split('/') },
      locale: entry.locale
    })),
  fallback: 'blocking'
})
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const content = await readPage(
    pathnameFrom([
      ...(locale === 'de' ? ['de'] : []),
      ...((params?.path || []) as string[])
    ])
  )
  return content?.page && content.settings
    ? { props: content, revalidate: false }
    : { notFound: true }
}
