import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { LmDivider } from './Divider'
import type { LmDividerProps } from './dividerTypes'
const fixture = vi.hoisted(() => ({ props: {} as any }))
vi.mock('@mui/material/Divider', () => ({
  default: (props: any) => {
    fixture.props = props
    return <div>{props.children}</div>
  }
}))
vi.mock('../icon/LmIcon', () => ({
  default: ({ iconName, style }: any) => <span style={style}>{iconName}</span>
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content }: any) => <b>{content._uid}</b>
}))
it.each([false, true])(
  'preserves default horizontal/stack styles (stack: %s)',
  (isStackDivider) => {
    renderToStaticMarkup(
      <LmDivider
        content={{ _uid: 'divider', component: 'divider' }}
        isStackDivider={isStackDivider}
      />
    )
    expect(fixture.props.orientation).toBe(
      isStackDivider ? 'vertical' : 'horizontal'
    )
    expect(fixture.props.flexItem).toBe(isStackDivider ? true : undefined)
    expect(fixture.props.textAlign).toBe('center')
    expect(fixture.props.sx).toMatchObject({
      width: isStackDivider ? '50%' : '100%',
      color: 'grey.400',
      borderColor: 'currentColor',
      '&.MuiDivider-vertical': { borderRightWidth: '1px' }
    })
    expect(fixture.props.children).toBeUndefined()
  }
)
it.each(['horizontal', 'vertical'] as const)(
  'preserves configured dimensions, colors, alignment and children (%s)',
  (orientation) => {
    const content = {
      _uid: 'divider',
      component: 'divider',
      orientation,
      width: '70',
      thickness: '3',
      vertical_height: '120',
      alignment: 'left',
      theme_color: 'primary.main',
      color: { rgba: 'red' },
      icon: { name: 'Star' },
      size: '24',
      body: [{ _uid: 'body', component: 'paragraph' }]
    } as unknown as LmDividerProps['content']
    const html = renderToStaticMarkup(<LmDivider content={content} />)
    expect(html).toContain('font-size:24px')
    expect(html).toContain('Star')
    expect(html).toContain('<b>body</b>')
    expect(fixture.props.textAlign).toBe('left')
    expect(fixture.props.sx).toMatchObject({
      width: '70%',
      color: 'primary.main',
      marginX: orientation === 'horizontal' ? 'auto' : undefined,
      borderBottomWidth: '3px',
      '&.MuiDivider-vertical': { height: '120px', borderRightWidth: '3px' },
      '&.MuiDivider-withChildren': {
        '&:before': { borderTopWidth: '3px', marginTop: '-3px' },
        '&:after': { borderTopWidth: '3px', marginTop: '-3px' }
      }
    })
  }
)
it('uses a custom color when no theme color is configured', () => {
  renderToStaticMarkup(
    <LmDivider
      content={
        {
          _uid: 'd',
          component: 'divider',
          color: { rgba: 'red' }
        } as LmDividerProps['content']
      }
    />
  )
  expect(fixture.props.sx.color).toBe('red')
})
