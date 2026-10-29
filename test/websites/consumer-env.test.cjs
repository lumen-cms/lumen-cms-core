const { test } = require('node:test')
const assert = require('node:assert/strict')
const { migrateConsumerEnv } = require('../../scripts/consumer-env.cjs')

test('consumer credential migration separates public and preview tokens and preserves modern overrides', () => {
  assert.equal(
    migrateConsumerEnv(
      'NEXT_PUBLIC_PUBLIC_TOKEN=public\nNEXT_PUBLIC_PREVIEW_TOKEN=private\n'
    ),
    'NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY=public\nSTORYBLOK_PREVIEW_TOKEN=private\n'
  )
  assert.equal(
    migrateConsumerEnv('NEXT_PUBLIC_PREVIEW_TOKEN=private'),
    'STORYBLOK_PREVIEW_TOKEN=private'
  )
  assert.equal(
    migrateConsumerEnv(
      'NEXT_PUBLIC_PUBLIC_TOKEN=old\nNEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY=\n'
    ),
    'NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY=\n'
  )
  assert.equal(
    migrateConsumerEnv(
      '# comment\nexport NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN = "public"'
    ),
    '# comment\nexport NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLISHABLE_KEY = "public"'
  )
})
