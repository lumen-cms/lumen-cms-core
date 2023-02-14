import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Magnify from 'mdi-material-ui/Magnify'
import LmIcon from '../icon/LmIcon'
import { ListSearchAutocompleteStoryblok } from '../../typings/generated/components-schema'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

export const ListSearchAutocompleteContainer: FunctionComponent<
  React.PropsWithChildren<{
    content: ListSearchAutocompleteStoryblok
    popperActive?: boolean
  }>
> = ({ content, children, popperActive }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const theme = useTheme()
  const [isMobileAction, setMobileAction] = useState(true)
  const matches = useMediaQuery(
    theme.breakpoints.down(content.mobile_breakpoint || 'xs')
  )
  const matchMobile = !!(content.mobile_breakpoint && matches)

  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    setMobileAction(matchMobile)
  }, [matchMobile, setMobileAction])

  useEffect(() => {
    if (!isMobileAction) {
      return
    }
    if (visible) {
      const input = ref.current?.querySelector('input') as HTMLInputElement
      input?.focus()
    }
  }, [visible, isMobileAction])
  useEffect(() => {
    if (!isMobileAction) {
      return
    }
    if (!popperActive) {
      setVisible(false)
    }
  }, [popperActive, isMobileAction])
  const onOpen = () => {
    setVisible(true)
  }
  if (isMobileAction) {
    return (
      <>
        <IconButton
          onClick={onOpen}
          size="large"
          style={{
            display: visible ? 'none' : undefined
          }}
        >
          {content.icon?.name ? (
            <LmIcon iconName={content.icon.name} />
          ) : (
            <Magnify />
          )}
        </IconButton>

        <Box
          ref={ref}
          sx={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            zIndex: 1,
            // height: '100%',
            verticalAlign: 'middle',
            margin: '10px 0',
            alignSelf: 'center',
            '& .MuiFormControl-root': {
              alignSelf: 'center'
            },
            // backgroundColor: bgColor || 'inherit',
            backgroundColor: 'white',
            display: !visible ? 'none' : 'inline-flex',
            '& .MuiAutocomplete-root, & .MuiFormControl-root': {
              width: '100%!important'
            }
          }}
        >
          {children}
        </Box>
      </>
    )
  }
  return <>{children}</>
}
ListSearchAutocompleteContainer.displayName = 'ListSearchAutocompleteContainer'
