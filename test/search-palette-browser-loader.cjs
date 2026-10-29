// Transpile the actual component sources for the isolated browser integration fixture.
const ts = require('typescript')
module.exports = function (source) {
  return ts.transpileModule(source, {
    fileName: this.resourcePath,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true
    }
  }).outputText
}
