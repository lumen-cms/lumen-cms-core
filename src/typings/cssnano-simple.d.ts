// Contract verified against cssnano-simple 3.0.2's src/index.js.
declare module 'cssnano-simple' {
  import type postcss from 'postcss'

  type Options = {
    excludeAll?: boolean
    [plugin: string]:
      | boolean
      | { exclude?: boolean; [option: string]: unknown }
      | undefined
  }

  function minifier(
    options?: Options,
    processor?: typeof postcss
  ): postcss.Processor
  namespace minifier {
    const postcss: true
  }
  export = minifier
}
