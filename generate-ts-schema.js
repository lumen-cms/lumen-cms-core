// Backwards-compatible entry point for the official, local CLI workflow.
process.argv[2] = 'generate'
require('./scripts/storyblok-schema.cjs')
