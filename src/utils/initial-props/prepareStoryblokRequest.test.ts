import { afterEach, expect, it } from 'vitest'
import { CONFIG } from '@CONFIG'
import { prepareForStoryblok } from './prepareStoryblokRequest'

const initialRoot = CONFIG.rootDirectory
afterEach(() => {
  CONFIG.rootDirectory = initialRoot
})
const options = {
  locale: 'en',
  defaultLocale: 'en',
  locales: ['en', 'de'],
  insideStoryblok: false
}

it('uses the selected website configuration for each request', () => {
  CONFIG.rootDirectory = 'en'
  expect(prepareForStoryblok('', options).pageSlug).toBe('en/home')
  CONFIG.rootDirectory = ''
  expect(prepareForStoryblok('', options).pageSlug).toBe('home')
})

it('does not change the caller’s route segments', () => {
  CONFIG.rootDirectory = ''
  const route = ['en', 'internships', 'design']
  expect(prepareForStoryblok(route, options).pageSlug).toBe(
    'internships/design'
  )
  expect(route).toEqual(['en', 'internships', 'design'])
})

it('strips surrounding slashes from string slugs', () => {
  CONFIG.rootDirectory = ''
  expect(prepareForStoryblok('/search', options).pageSlug).toBe('search')
  expect(prepareForStoryblok('/info/faq/', options).pageSlug).toBe('info/faq')
  expect(prepareForStoryblok('/', options).pageSlug).toBe('home')
})
