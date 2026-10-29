import { expect, it } from 'vitest'
import { getIframeSandbox } from './iframeSandbox'

const parent = 'https://www.example.com'

it.each([
  'https://www.youtube.com/embed/video',
  'https://www.youtube-nocookie.com/embed/video',
  'https://docs.google.com/forms/d/e/example/viewform',
  'https://mysga.studentsgoabroad.com/application'
])(
  'preserves scripts and origin storage for the trusted provider %s',
  (url) => {
    const sandbox = getIframeSandbox(url, parent).split(' ')
    expect(sandbox).toContain('allow-scripts')
    expect(sandbox).toContain('allow-same-origin')
    expect(sandbox).not.toContain('allow-top-navigation')
    expect(sandbox).not.toContain('allow-top-navigation-by-user-activation')
  }
)

it.each([
  '/same-origin',
  'https://www.example.com/frame',
  'https://www.youtube.com.attacker.test/embed/video',
  'http://www.youtube.com/embed/video',
  'https://www.youtube.com:444/embed/video',
  'https://attacker.test/',
  'data:text/html,<script>alert(1)</script>',
  undefined
])('does not grant normal origin access to %s', (url) => {
  expect(getIframeSandbox(url, parent)).not.toContain('allow-same-origin')
  expect(getIframeSandbox(url, parent)).not.toContain('allow-popups')
})

it('never trusts a provider when it is also the parent origin, or the parent is unknown', () => {
  expect(
    getIframeSandbox('https://docs.google.com/forms', 'https://docs.google.com')
  ).not.toContain('allow-same-origin')
  expect(getIframeSandbox('https://www.youtube.com/embed/video')).not.toContain(
    'allow-same-origin'
  )
})

it('grants form submission only to form providers, and downloads only to the application portal', () => {
  expect(getIframeSandbox('https://docs.google.com/forms', parent)).toContain(
    'allow-forms'
  )
  expect(
    getIframeSandbox('https://www.youtube.com/embed/video', parent)
  ).not.toContain('allow-forms')
  expect(
    getIframeSandbox('https://mysga.studentsgoabroad.com/', parent)
  ).toContain('allow-downloads')
  expect(
    getIframeSandbox('https://docs.google.com/forms', parent)
  ).not.toContain('allow-downloads')
})
