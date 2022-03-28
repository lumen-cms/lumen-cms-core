import React, { CSSProperties, FunctionComponent } from 'react'
import LmIcon from '../icon/LmIcon'
import { LmDividerProps } from './dividerTypes'
import { makeStyles } from 'tss-react/mui'
import Divider from '@mui/material/Divider'

const useStyles = makeStyles({ name: 'Divider' })({
  hSeparator: {
    clear: 'both',
    width: '100%',
    color: '#ccc',
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '1px',
    '& > div, > div > div > div': {
      margin: '0 auto',
      overflow: 'hidden',
      position: 'relative',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderColor: 'transparent'
    },
    '& div > span:before': {
      right: '100%'
    },
    '& div > span:after': {
      left: '100%'
    },
    '& div > span:before, & div > span:after': {
      content: '""',
      display: 'inline-block',
      verticalAlign: 'top',
      position: 'absolute',
      top: '50%',
      height: 0,
      width: '2000px',
      borderTopWidth: 'inherit',
      borderTopStyle: 'solid',
      borderColor: 'currentColor'
    },
    '& div > span': {
      display: 'inline-block',
      verticalAlign: 'top',
      position: 'relative',
      height: 'inherit',
      borderColor: 'inherit',
      color: 'inherit',
      borderTopWidth: 'inherit',
      borderTopStyle: 'solid',

      '&> .material-icons': {
        color: 'inherit'
      }
    }
  },
  hSeparatorIcon: {
    height: '24px',
    textAlign: 'center',
    '&.large': {
      height: '32px'
    },
    '& div > div > i': {
      '&:before': {
        marginRight: '15px'
      },
      '&:after': {
        marginLeft: '15px'
      }
    }
  }
})

const DividerContainer: FunctionComponent<{
  style: CSSProperties
  className: string
  childStyle: CSSProperties
}> = ({ children, style, className, childStyle }) => (
  <div className={className} style={style}>
    <div style={childStyle}>{children}</div>
  </div>
)

DividerContainer.displayName = 'DividerContainer'

export function LmDivider({ content }: LmDividerProps): JSX.Element {
  const { classes, cx: clsx } = useStyles()

  const style: CSSProperties = {
    color: content.color?.rgba || undefined
  }
  const iconName = content.icon?.name
  const iconSize = content.size

  if (iconSize) {
    style.height = `${iconSize}px`
  }
  const className = clsx(
    classes.hSeparator,
    iconName && classes.hSeparatorIcon,
    content.class_names && content.class_names.values
  )
  const childStyle: CSSProperties = {
    borderTopWidth: `${content.thickness || 1}px`
  }
  if (content.width) {
    childStyle.width = `${content.width}%`
  }
  if (iconName) {
    return (
      <Divider
        sx={{
          maxWidth: content.width ? `${content.width}%` : undefined,
          marginX: content.width ? `auto` : undefined,
          color: style.color,
          '&:before': {
            borderTopColor: 'currentColor'
          },
          '&:after': {
            borderTopColor: 'currentColor'
          }
        }}
      >
        <LmIcon
          iconName={iconName}
          style={{
            fontSize: `${iconSize}px`,
            marginTop: `${content.thickness || 1}px`
          }}
        />
      </Divider>
      //     <DividerContainer
      //       style={style}
      //       childStyle={childStyle}
      //       className={className}
      //     >
      //       <div>
      //         <div style={{ borderTopWidth: `${content.thickness || 1}px` }}>
      //           <span>
      //             <LmIcon
      //               iconName={iconName}
      //               style={{
      //                 fontSize: `${iconSize}px`,
      //                 marginTop: `${content.thickness || 1}px`
      //               }}
      //             />
      //           </span>
      //         </div>
      //       </div>
      //     </DividerContainer>
    )
  }
  return (
    <DividerContainer
      style={style}
      childStyle={childStyle}
      className={className}
    >
      <span />
    </DividerContainer>
  )
}
