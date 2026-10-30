import { createSitemapApi } from '../../pages/api/sitemap'
import { fetchTravels } from '../utils/travels'

export default createSitemapApi([
  async (stream, locale) => {
    const items = await fetchTravels(
      locale || process.env.NEXT_PUBLIC_ROOT_DIRECTORY
    )
    items.forEach((travel) => {
      stream.write({
        url: `${process.env.TRAVELS_SLUG || 'travels'}/${travel.slug}`,
        lastmod: travel.updated_at,
        priority: 0.5
      })
    })
  }
])
