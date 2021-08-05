import { LmComponentRender as LmTable } from '@LmComponentRender'
import { TableStoryblok } from '../../typings/generated/components-schema'
import { storyTable } from '../../storybook/core/various'

const body = {
  tbody: [
    ['Content 1 1', 'Content 1 2', 'Content 1 3', 'Content 1 4'],
    ['Content 2 1', 'Content 2 2', 'Content 2 3', 'Content 1 4'],
    ['Content 3 1', 'Content 3 2', 'Content 3 3', 'Content 1 4']
  ],
  thead: ['Head 1', 'Head 2', 'Head 3', 'Head 4']
}
const props: TableStoryblok = {
  _uid: '123',
  component: 'table',
  body
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Layout/Table'
}

export const Basic = () => <LmTable content={props} />
export const WithoutHeader = () => (
  <LmTable
    content={{
      ...props,
      disable_table_head: true
    }}
  />
)
export const Variant = () => (
  <>
    <div>
      <h3>Bordered</h3>
    </div>
    <LmTable
      content={{
        ...props,
        variant: 'bordered'
      }}
    />
    <div>
      <br />
    </div>
    <div>
      <h3>Bordered Bold</h3>
    </div>
    <LmTable
      content={{
        ...props,
        variant: 'bordered-bold'
      }}
    />
    <div>
      <br />
    </div>
    <div>
      <h3>Boxed</h3>
    </div>
    <LmTable
      content={{
        ...props,
        variant: 'boxed'
      }}
    />
    <div>
      <br />
    </div>
    <div>
      <h3>Comparison</h3>
    </div>
    <LmTable
      content={{
        ...props,
        variant: 'comparison'
      }}
    />
    <div>
      <br />
    </div>
    <div>
      <h3>Price</h3>
    </div>
    <LmTable
      content={{
        ...props,
        variant: 'price'
      }}
    />
  </>
)
export const Playground = () => (
  <div>
    <LmTable content={{ ...storyTable(), body: props.body }} />
  </div>
)
