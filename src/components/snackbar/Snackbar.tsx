import React, { useEffect, useEffectEvent, useSyncExternalStore } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Cookies from 'js-cookie'
import SnackbarContent from '@mui/material/SnackbarContent'
import { Dialog, DialogActions, DialogContent } from '@mui/material'
import { LmComponentRender } from '../CoreComponents'
import { ButtonStoryblok } from '../../typings/generated/components-schema'
import { useScrollOnce } from '../../utils/hooks/useScrolledOnce'
import { LmSnackbarProps } from './snackbarTypes'
import { useAppContext } from '../provider/context/AppContext'

// Server output and the first hydration render stay closed. Visibility is
// reconciled before children render once the client snapshot is available.
const subscribeToMount = () => () => {}
const clientMounted = () => true
const serverMounted = () => false

type VisibilityInputs = {
  mounted: boolean
  display: LmSnackbarProps['content']['display']
  autoShow: LmSnackbarProps['content']['auto_show']
  isScrolled: boolean
}

function getNextVisibility(
  previous: VisibilityInputs,
  current: VisibilityInputs,
  open: boolean,
  cookieExists: boolean
) {
  if (!current.mounted) return open
  const reset =
    previous.mounted !== current.mounted ||
    previous.display !== current.display ||
    previous.autoShow !== current.autoShow
  const scrollChanged =
    previous.mounted !== current.mounted ||
    previous.isScrolled !== current.isScrolled ||
    previous.display !== current.display
  let nextOpen = reset
    ? !(
        cookieExists ||
        current.autoShow ||
        current.display === 'show_on_scroll'
      )
    : open
  if (scrollChanged && current.isScrolled) {
    if (current.display === 'show_on_scroll' && !cookieExists) nextOpen = true
    else if (current.display === 'hide_on_scroll') nextOpen = false
  }
  return nextOpen
}

function useSnackbarOpen(
  content: LmSnackbarProps['content'],
  cookieExists: boolean
) {
  const mounted = useSyncExternalStore(
    subscribeToMount,
    clientMounted,
    serverMounted
  )
  const isScrolled = useScrollOnce()
  const [open, setOpen] = React.useState(false)
  const [previous, setPrevious] = React.useState({
    mounted: false,
    display: content.display,
    autoShow: content.auto_show,
    isScrolled: false
  })
  if (
    previous.mounted !== mounted ||
    previous.display !== content.display ||
    previous.autoShow !== content.auto_show ||
    previous.isScrolled !== isScrolled
  ) {
    const current = {
      mounted,
      display: content.display,
      autoShow: content.auto_show,
      isScrolled
    }
    setPrevious(current)
    setOpen(getNextVisibility(previous, current, open, cookieExists))
  }
  return [open, setOpen] as const
}

type SnackbarPresentationProps = LmSnackbarProps & {
  open: boolean
  handleAccept: () => void
}

function SnackbarDialog({
  content,
  open,
  handleAccept,
  onClose
}: SnackbarPresentationProps & { onClose: () => void }) {
  return (
    <Dialog
      open={open}
      maxWidth={content.max_width || false}
      onClose={content.prevent_click_outside ? undefined : onClose}
      slotProps={{
        paper: {
          elevation: content.elevation ? Number(content.elevation) : undefined,
          square: content.square
        }
      }}
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
  )
}

function getToastStyle(
  content: LmSnackbarProps['content']
): React.CSSProperties {
  return {
    width: content.width ? content.width : undefined,
    backgroundColor: content.background_color?.rgba || undefined,
    alignItems: content.button_top_align ? 'flex-start' : undefined,
    border: content.border_color?.rgba
      ? `1px solid ${content.border_color.rgba}`
      : undefined,
    borderRadius: content.square ? 0 : undefined
  }
}

function SnackbarToast({
  content,
  open,
  handleAccept
}: SnackbarPresentationProps) {
  return (
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
        elevation={content.elevation ? Number(content.elevation) : undefined}
        variant={content.variant === 'outlined' ? 'outlined' : 'elevation'}
        style={getToastStyle(content)}
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

export default function LmSnackbar({ content }: LmSnackbarProps) {
  const { insideStoryblok } = useAppContext()
  const [cookieExists, setCookieExists] = React.useState(() =>
    content.cookie_name ? !!Cookies.get(content.cookie_name) : false
  )
  const [open, setOpen] = useSnackbarOpen(content, cookieExists)
  const hasDismissalCookie = useEffectEvent(() => cookieExists)

  useEffect(() => {
    if (!content.auto_close) {
      return undefined
    }
    const timer = setTimeout(() => {
      setOpen(false)
    }, Number(content.auto_close))

    return () => clearTimeout(timer)
  }, [content.auto_close, setOpen])

  useEffect(() => {
    if (!content.auto_show && !hasDismissalCookie()) {
      return undefined
    }
    const timer = setTimeout(
      () => {
        setOpen(true)
      },
      content.auto_show === undefined ? undefined : Number(content.auto_show)
    )

    return () => clearTimeout(timer)
  }, [content.auto_show, setOpen])

  const handleAccept = () => {
    setOpen(false)

    if (content.cookie_name) {
      const cookieOptions: Cookies.CookieAttributes = {
        expires: content?.expire_in_days ? Number(content.expire_in_days) : 1,
        sameSite: 'lax',
        secure: window.location ? window.location.protocol === 'https:' : true
      }
      Cookies.set(content.cookie_name, 'true', cookieOptions)
      setCookieExists(true)
    }
  }
  if (cookieExists && !insideStoryblok) {
    return null
  }
  return content.dialog ? (
    <SnackbarDialog
      content={content}
      open={open}
      handleAccept={handleAccept}
      onClose={() => setOpen(false)}
    />
  ) : (
    <SnackbarToast content={content} open={open} handleAccept={handleAccept} />
  )
}
