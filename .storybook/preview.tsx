import StoriesLayout from '../src/storybook/components/StoriesLayout'
import { CONFIG } from '@CONFIG'

// overwrite and make sure ENV always same (studentsgoabroad)
CONFIG.publicToken = 'm85LRUo0sX4yo9Q96VMQlQtt'
CONFIG.previewToken = 'qASJXPT2cwH76pA9vpJbxAtt'
CONFIG.rootDirectory = 'en'

export const parameters = {
  nextjs: { appDirectory: false },
  options: {
    storySort: (a, b) =>
      a.title === b.title
        ? 0
        : a.id.localeCompare(b.id, undefined, { numeric: true })
  }
}

export const decorators = [StoriesLayout]
