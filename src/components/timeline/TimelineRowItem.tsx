import React, { FunctionComponent } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import clsx from 'clsx'
import CardActionArea from '@material-ui/core/CardActionArea'
import { TimelineItemStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmComponentRender } from '../CoreComponents'
import { TimelineRowItemProps } from './TimelineProps'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardContainer: {
      position: 'relative',
      padding: `${theme.spacing(1)}px 0`
    },
    cardDecorator: {
      position: 'absolute',
      width: 0,
      height: 0,
      borderTop: '16px solid transparent',
      borderBottom: '16px solid transparent',
      top: 'calc(50% - 16px)'
    },
    cardDecoratorLeft: {
      left: '100%',
      borderLeft: `16px solid${theme.palette.grey.A100}`
    },
    cardDecoratorRight: {
      borderRight: `16px solid${theme.palette.grey.A100}`,
      right: '100%'
    }
  })
)

const CardContentContainer: FunctionComponent<{
  content: TimelineItemStoryblok
}> = ({ content, children }) => {
  const { LinkRender } = useAppContext()
  if (content.link) {
    const btnProps: any = content.link?.cached_url
      ? {
          ...getLinkAttrs(content.link as LinkType, {
            openExternal: !!content.open_external
          }),
          naked: true,
          component: LinkRender
        }
      : {}
    return <CardActionArea {...btnProps}>{children}</CardActionArea>
  }
  return <>{children}</>
}
CardContentContainer.displayName = 'CardContentContainer'

export function TimelineRowItem({
  isLeft,
  content
}: TimelineRowItemProps): JSX.Element {
  const classes = useStyles()

  const body = content.body || []
  return (
    <div className={classes.cardContainer}>
      <div
        className={clsx(
          classes.cardDecorator,
          isLeft ? classes.cardDecoratorLeft : classes.cardDecoratorRight
        )}
      />
      <Card>
        <CardContentContainer content={content}>
          {(content.title || content.subheader) && (
            <CardHeader title={content.title} subheader={content.subheader} />
          )}
          {body.length > 0 && (
            <CardContent>
              {body.map((blok, i) => LmComponentRender({ content: blok, i }))}
            </CardContent>
          )}
        </CardContentContainer>
      </Card>
    </div>
  )
}
