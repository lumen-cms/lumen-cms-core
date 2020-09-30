const path = require('path');

module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config) {
    const { file, ...output } = config.output;

    const folder = path
      .basename(file)
      .split('.')
      .join('-');

    return { ...config, output: { ...output, dir: `./dist/${folder}` } };
  },
};
