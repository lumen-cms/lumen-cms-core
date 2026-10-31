// Transpile the actual component sources for the isolated browser integration fixture.
const { transformSync } = require('esbuild')
module.exports = function (source) {
  return transformSync(source, {
    sourcefile: this.resourcePath,
    loader: this.resourcePath.endsWith('.tsx') ? 'tsx' : 'ts',
    target: 'es2022',
    format: 'esm',
    jsx: 'automatic'
  }).code
}
