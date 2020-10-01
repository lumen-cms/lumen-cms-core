const path = require('path')

module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    const { file, ...output } = config.output
    //
    const folder = path.basename(file)
    console.log(options)
    return { ...config, output: { ...output, dir: `./dist/${folder}` } }
  }
}
