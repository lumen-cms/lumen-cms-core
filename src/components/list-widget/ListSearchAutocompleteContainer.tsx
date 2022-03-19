import React, { FunctionComponent, RefObject, useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Magnify from 'mdi-material-ui/Magnify'
import LmIcon from '../icon/LmIcon'
import { ListSearchAutocompleteStoryblok } from '../../typings/generated/components-schema'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  mobile: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    zIndex: 1,
    height: '100%',
    verticalAlign: 'middle',
    backgroundColor: 'inherit',
    '& .MuiFormControl-root': {
      alignSelf: 'center'
    }
  }
})

export const ListSearchAutocompleteContainer: FunctionComponent<{
  content: ListSearchAutocompleteStoryblok
  popperActive?: boolean
  inputRef: RefObject<HTMLInputElement>
  isMobileAction: boolean
}> = ({ content, children, popperActive, inputRef, isMobileAction }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const { classes } = useStyles()
  const [bgColor, setBgColor] = useState<string | undefined>()
  useEffect(() => {
    if (isMobileAction) {
      const toolbar: HTMLDivElement | null | undefined =
        inputRef.current?.closest('.MuiAppBar-root')
      const bg =
        toolbar && window.getComputedStyle(toolbar, null).backgroundColor
      setBgColor(bg || undefined)
    }
  }, [isMobileAction, inputRef])
  useEffect(() => {
    if (!isMobileAction) {
      return
    }
    inputRef.current?.focus()
  }, [visible, inputRef, isMobileAction])
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
        {!visible && (
          <IconButton onClick={onOpen} size="large">
            {content.icon?.name ? (
              <LmIcon iconName={content.icon.name} />
            ) : (
              <Magnify />
            )}
          </IconButton>
        )}
        <div
          style={{
            display: !visible ? 'none' : 'inline-flex',
            backgroundColor: bgColor
          }}
          className={classes.mobile}
        >
          {children}
        </div>
      </>
    )
  }
  return <>{children}</>
}
ListSearchAutocompleteContainer.displayName = 'ListSearchAutocompleteContainer'
