import ChevronDown from 'mdi-material-ui/ChevronDown'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import LmIcon from '../icon/LmIcon'
import { LmNavListProps } from './navListTypes'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { LmComponentRender } from '../CoreComponents'
import { LmFlexRow } from '../flex-row/FlexRow'
import { HeadlineStoryblok } from '../../typings/generated/components-schema'
import clsx from 'clsx'

function HeadlineHeader({ content }: LmNavListProps) {
  const { header, headline_styles } = content
  const headlineStyle = headline_styles?.[0]
  return (
    <LmComponentRender
      content={
        {
          _uid: headlineStyle?._uid || content._uid,
          component: 'headline',
          text: headlineStyle?.text || header,
          tag: headlineStyle?.tag || 'h5',
          typography: headlineStyle?.typography || 'headline5',
          ...headlineStyle
        } as HeadlineStoryblok
      }
    >
      {header}
    </LmComponentRender>
  )
}

function ChildrenRender({ content }: LmNavListProps) {
  const body = content.body || []
  const properties = content.properties || []
  const listItemStyle = content.navigation_item_styles?.[0]
  const isColumn = properties.some((i) => i === 'flex-column')
  const isCentered = properties.some((i) => i === 'justify-content-center')
  return (
    <LmFlexRow
      content={{
        _uid: content._uid,
        component: 'flex_row',
        gap: isColumn ? 0.5 : 1,
        column: isColumn,
        justify: isCentered ? 'center' : undefined,
        align_content: isCentered ? 'center' : undefined
      }}
    >
      {body.map((blok) => (
        <LmComponentRender
          content={blok}
          key={blok._uid}
          options={listItemStyle}
        />
      ))}
    </LmFlexRow>
  )
}

export function LmNavList({ content }: LmNavListProps): React.JSX.Element {
  const { isMobile } = useDeviceDimensions()
  const { header } = content
  if ((isMobile && content.collapse_on_mobile) || content.forceCollapse) {
    return (
      <Accordion>
        <AccordionSummary
          // IconButtonProps={{
          //   style: {
          //     color: 'inherit'
          //   }
          // }}
          sx={{
            color: 'inherit'
          }}
          expandIcon={
            content.collapse_icon && content.collapse_icon.name ? (
              <LmIcon iconName={content.collapse_icon.name} />
            ) : (
              <ChevronDown color={'inherit'} />
            )
          }
        >
          <HeadlineHeader content={content} />
        </AccordionSummary>
        <AccordionDetails>
          <div
            className={clsx('lm-nav-list w-100', content.class_names?.values)}
          >
            <ChildrenRender content={content} />
          </div>
        </AccordionDetails>
      </Accordion>
    )
  }
  return (
    <div className={clsx('lm-nav-list w-100', content.class_names?.values)}>
      {header && <HeadlineHeader content={content} />}
      <ChildrenRender content={content} />
    </div>
  )
}
