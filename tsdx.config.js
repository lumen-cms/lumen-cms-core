module.exports = {
  rollup (config, options) {
    console.log(config, options)
    if (options.entry === 'src/nextjs.tsx') {
      config.output.file = config.output.file.replace('dist', 'base/dist')
    }
    return config
  }
}
