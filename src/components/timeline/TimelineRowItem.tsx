import React, { FunctionComponent } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { TimelineItemStoryblok } from '../../typings/generated/components-schema'
import clsx from 'clsx'
import CardActionArea from '@material-ui/core/CardActionArea'
import ContentLink from '../link/ContentLink'
import { useAppContext } from '../provider/AppProvider'

const useStyles = makeStyles((theme: Theme) => createStyles({
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
    borderLeft: '16px solid' + theme.palette.grey.A100
  },
  cardDecoratorRight: {
    borderRight: '16px solid' + theme.palette.grey.A100,
    right: '100%'
  }
}))

const CardContentContainer: FunctionComponent<{
  content: TimelineItemStoryblok
}> = ({ content, children }) => {
  if (content.link) {
    return (
      <ContentLink content={content} className="lm-timeline__link">
        <CardActionArea>
          {children}
        </CardActionArea>
      </ContentLink>
    )
  }
  return (
    <>{children}</>
  )
}
CardContentContainer.displayName = 'CardContentContainer'

export type TimelineRowItemProps = {
  isLeft: boolean
  content: TimelineItemStoryblok
}

export function TimelineRowItem({ isLeft, content }: TimelineRowItemProps): JSX.Element {
  const classes = useStyles()
  const { ComponentRender } = useAppContext()

  const body = content.body || []
  return (
    <div className={classes.cardContainer}>
      <div className={clsx(classes.cardDecorator, isLeft ? classes.cardDecoratorLeft : classes.cardDecoratorRight)} />
      <Card>
        <CardContentContainer content={content}>
          {(content.title || content.subheader) && <CardHeader title={content.title} subheader={content.subheader} />}
          {body.length > 0 && <CardContent>{body.map((blok, i) => ComponentRender({ content: blok, i }))}</CardContent>}
        </CardContentContainer>
      </Card>
    </div>
  )
}

export default TimelineRowItem
