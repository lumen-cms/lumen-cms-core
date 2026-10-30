import { renderToStaticMarkup } from 'react-dom/server'
import { load } from 'cheerio'
import { expect, it, vi } from 'vitest'
import TravelComponent from './Travel'
import type { Travel } from '../../typings/generated/hasura-schema'

const mocks = vi.hoisted(() => ({ locale: 'en' }))
vi.mock('next/router', () => ({ useRouter: () => ({ locale: mocks.locale }) }))
vi.mock('../../../components/CoreComponents', () => ({
  LmComponentRender: ({ content }: { content: unknown }) => (
    <div data-travel-block={JSON.stringify(content)} />
  )
}))

it.each([
  ['en', undefined, true],
  ['de', undefined, true],
  ['en', 'DE', false],
  ['de', 'EN', false]
] as const)(
  'preserves travel sections for %s / %s / gallery %s',
  (locale, language, gallery) => {
    mocks.locale = locale
    vi.stubEnv(
      'NEXT_PUBLIC_TRAVEL_HEADER_FALLBACK_IMG',
      'https://example.com/fallback.jpg'
    )
    const content = {
      id: 42,
      title: 'Test trip',
      language_key: language,
      city: {
        title: 'City',
        title_de: 'Stadt',
        country: { title: 'Country', title_de: 'Land' }
      },
      mn_travel_travel_types: [
        { travel_type: { title: 'Internship', title_de: 'Praktikum' } }
      ],
      travel_fast_fact: {
        minimum_age: 18,
        working_hour: 1,
        duration: '4 weeks',
        education: 'Student',
        language_skill: 1
      },
      product: { product_price: { eur: 1234, usd: 1500 } },
      fileStoryblokByHeaderImageId: gallery
        ? { url_new: 'https://example.com/header.jpg' }
        : undefined,
      file_storybloks: gallery
        ? [
            { id: 1, url_new: 'https://example.com/gallery.jpg' },
            { id: 2, url_new: '' }
          ]
        : [],
      overview: '<p>Overview</p>',
      description: '<p>Description</p>',
      travel_itinerary: { description: '<p>Itinerary</p>' },
      travel_accommodation: { description: '<p>Accommodation</p>' },
      travel_service: { description: '<p>Services</p>' },
      travel_team: {
        description: '<p>Team</p>',
        file_storyblok: gallery
          ? { url_new: 'https://example.com/team.jpg' }
          : undefined
      }
    } as unknown as Travel
    const html = renderToStaticMarkup(<TravelComponent content={content} />)
    const $ = load(html)
    const blocks = $('[data-travel-block]')
      .map((_, el) => JSON.parse($(el).attr('data-travel-block')!))
      .get()
    expect(blocks.map((block) => block._uid)).toEqual([
      'section_parallax_headline',
      'fast-facts',
      ...(gallery ? ['image-list'] : []),
      'service-tabs',
      'travel-team',
      'headline-team',
      '2342'
    ])
    const languageKey = language || locale.toUpperCase()
    const serialized = JSON.stringify(blocks)
    expect(serialized).toContain(
      languageKey === 'DE' ? 'Stadt, Land' : 'City, Country'
    )
    expect(serialized).toContain('1234 EUR')
    expect(serialized).toContain(
      `https://admin.studentsgoabroad.com/signup?tid=42&lang=${languageKey.toLowerCase()}`
    )
    expect(serialized).toContain(languageKey === 'DE' ? '/kontakt' : '/contact')
    for (const section of [
      'Overview',
      'Description',
      'Itinerary',
      'Accommodation',
      'Services',
      'Team'
    ]) {
      expect(serialized).toContain(`<p>${section}</p>`)
    }
    expect(blocks[0].background[0].image).toBe(
      `https://example.com/${gallery ? 'header' : 'fallback'}.jpg`
    )
    if (gallery) expect(blocks[2].body[0].body).toHaveLength(1)
    expect($('.team-card img').attr('src')).toContain(
      gallery ? 'team.jpg' : 'team-89665'
    )
  }
)
