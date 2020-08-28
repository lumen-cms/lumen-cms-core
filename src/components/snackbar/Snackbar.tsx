import React, { useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Cookies from 'js-cookie'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { Dialog, DialogActions, DialogContent } from '@material-ui/core'
import {
  ButtonStoryblok,
  SnackbarStoryblok
} from '../../typings/generated/components-schema'
import { LmComponentRender } from '../CoreComponents'
import { useScrollOnce } from '../../utils/hooks/useScrolledOnce'

type LmSnackbarProps = {
  content: SnackbarStoryblok
}

const devMode = process.env.NODE_ENV !== 'production'

export function LmSnackbar({ content }: LmSnackbarProps) {
  const [open, setOpen] = React.useState<boolean>(false)
  const isScrolled = useScrollOnce()
  const cookieExists = content.cookie_name
    ? Cookies.get(content.cookie_name)
    : false

  useEffect(() => {
    let initalValue = true
    if (
      cookieExists ||
      content.auto_show ||
      content.display === 'show_on_scroll'
    ) {
      initalValue = false
    }
    setOpen(initalValue)
  }, [cookieExists, content.display, content.auto_show])

  useEffect(() => {
    if (!content.display || !isScrolled) {
      return
    }
    if (content.display === 'show_on_scroll' && !cookieExists) {
      setOpen(true)
    } else if (content.display === 'hide_on_scroll') {
      setOpen(false)
    }
  }, [isScrolled, content.display, cookieExists])

  useEffect(() => {
    if (!content.auto_close) {
      return undefined
    }
    const timer = setTimeout(() => {
      setOpen(false)
    }, content.auto_close)

    return () => clearTimeout(timer)
  }, [content.auto_close])

  useEffect(() => {
    if (!content.auto_show && !cookieExists) {
      return undefined
    }
    const timer = setTimeout(() => {
      setOpen(true)
    }, content.auto_show)

    return () => clearTimeout(timer)
  }, [content.auto_show, cookieExists])

  const handleAccept = () => {
    setOpen(false)

    if (!devMode && content.cookie_name) {
      Cookies.set(content.cookie_name, 'true', {
        expires: content?.expire_in_days || 1,
        secure: window.location ? window.location.protocol === 'https:' : true
      })
    }
  }

  return content.dialog ? (
    <Dialog
      open={open}
      maxWidth={content.max_width || false}
      PaperProps={{
        elevation: content.elevation || undefined,
        square: content.square
      }}
      onClose={content.prevent_click_outside ? undefined : () => setOpen(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {(content?.close_action || []).map((blok) => (
          <LmComponentRender
            content={{ color: 'secondary_text', ...blok } as ButtonStoryblok}
            key={blok._uid}
            onClick={handleAccept}
          />
        ))}
      </div>
      <DialogContent>
        {(content?.descriptions || []).map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </DialogContent>
      <DialogActions>
        {(content?.additional_actions || []).map((blok) => (
          <LmComponentRender
            content={{ color: 'secondary_text', ...blok } as ButtonStoryblok}
            key={blok._uid}
          />
        ))}
      </DialogActions>
    </Dialog>
  ) : (
    <Snackbar
      anchorOrigin={{
        horizontal: content.anchor_horizontal || 'center',
        vertical: content.anchor_vertical || 'bottom'
      }}
      open={open}
      classes={{}}
      style={{
        width: content.width ? content.width : undefined
      }}
    >
      <SnackbarContent
        elevation={content.elevation || undefined}
        variant={content.variant === 'outlined' ? 'outlined' : 'elevation'}
        style={{
          width: content.width ? content.width : undefined,
          backgroundColor: content.background_color?.rgba || undefined,
          border: content.border_color?.rgba
            ? `1px solid ${content.border_color.rgba}`
            : undefined,
          borderRadius: content.square ? 0 : undefined
        }}
        message={
          <>
            {(content?.descriptions || []).map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </>
        }
        action={
          <>
            {(content?.additional_actions || []).map((blok) => (
              <LmComponentRender
                content={
                  { color: 'secondary_text', ...blok } as ButtonStoryblok
                }
                key={blok._uid}
              />
            ))}
            {(content?.close_action || []).map((blok) => (
              <LmComponentRender
                content={
                  { color: 'secondary_text', ...blok } as ButtonStoryblok
                }
                key={blok._uid}
                onClick={handleAccept}
              />
            ))}
          </>
        }
      />
    </Snackbar>
  )
}
