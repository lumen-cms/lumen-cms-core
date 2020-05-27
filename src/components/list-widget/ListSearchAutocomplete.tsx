import React, { createRef, FunctionComponent, RefObject, useEffect, useState } from 'react'
import { ListSearchAutocompleteStoryblok } from '../../typings/generated/components-schema'
import { createStyles, fade, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { getLinkAttrs } from '../../utils/linkHandler'
import MuiNextLink from '../link/MuiNextLink'
import LmIcon from '../icon/LmIcon'
import Magnify from 'mdi-material-ui/Magnify'
import clsx from 'clsx'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import { StoryData } from 'storyblok-js-client'
import { PageComponent } from '../../typings/generated/schema'
import { useDebouncedCallback } from 'use-debounce'
import StoryblokService from '../../utils/StoryblokService'
import InputAdornment from '@material-ui/core/InputAdornment'
import { CONFIG } from '../../utils/config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-flex',
      verticalAlign: 'middle',
      '& .MuiInputLabel-root.Mui-focused': {
        color: 'inherit'
      }
    },
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
    },
    inputRoot: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade('rgba(0,0,0,.05)', 0.15),
      color: 'inherit',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.divider
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.action.focus
      },
      '&:hover': {
        backgroundColor: fade('rgba(0,0,0,.05)', 0.25),
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.action.focus
        }
      }
    },
    borderSquare: {
      borderRadius: 0,
      '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: 0
      }
    },
    borderRounded: {
      borderRadius: '25px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: '25px'
      }
    },
    inputDefaultWidth: {
      color: 'inherit',
      transition: theme.transitions.create('width')
    },
    variableWidth: {
      '&.MuiAutocomplete-input': {
        [theme.breakpoints.up('sm')]: {
          width: 120,
          '&:focus,&:active': {
            width: 200
          }
        }
      }
    },
    listbox: {
      '& .MuiLink-root': {
        display: 'block',
        width: '100%',
        color: 'inherit',
        '&:hover': {
          textDecoration: 'none'
        }
      }
    }
  }))

const ListSearchAutocompleteContainer: FunctionComponent<{
  content: ListSearchAutocompleteStoryblok,
  popperActive?: boolean,
  inputRef: RefObject<HTMLInputElement>,
  isMobileAction: boolean
}> = ({ content, children, popperActive, inputRef, isMobileAction }) => {

  const [visible, setVisible] = useState<boolean>(false)
  const classes = useStyles()
  const [bgColor, setBgColor] = useState<string | undefined>()
  useEffect(
    () => {
      if (isMobileAction) {
        const toolbar: HTMLDivElement | null | undefined = inputRef.current?.closest('.MuiAppBar-root')
        const bg = toolbar && window.getComputedStyle(toolbar, null).backgroundColor
        setBgColor(bg ? bg : undefined)
      }
    },
    [isMobileAction, inputRef]
  )
  useEffect(
    () => {
      if (!isMobileAction) {
        return
      }
      inputRef.current?.focus()
    },
    [visible, inputRef, isMobileAction]
  )
  useEffect(
    () => {
      if (!isMobileAction) {
        return
      }
      if (!popperActive) {
        setVisible(false)
      }
    },
    [popperActive, isMobileAction]
  )
  const onOpen = () => {
    setVisible(true)
  }
  if (isMobileAction) {
    return (
      <>
        {!visible && (
          <IconButton onClick={onOpen}>{content.icon?.name ? <LmIcon iconName={content.icon.name} /> :
            <Magnify />}</IconButton>
        )}
        <div style={{
          display: !visible ? 'none' : 'inline-flex',
          backgroundColor: bgColor
        }} className={classes.mobile}>
          {children}
        </div>
      </>
    )
  }
  return <>{children}</>
}
ListSearchAutocompleteContainer.displayName = 'ListSearchAutocompleteContainer'

export type LmListSearchAutocompleteProps = { content: ListSearchAutocompleteStoryblok }

export function LmListSearchAutocomplete({ content }: LmListSearchAutocompleteProps): JSX.Element {
  // const { allStories } = useAppContext()
  const [allStories, setAllStories] = useState<StoryData<PageComponent>[]>([])
  const classes = useStyles()
  const inputRef: RefObject<HTMLInputElement> = createRef()
  const [open, setOpen] = useState<boolean | undefined>()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down(content.mobile_breakpoint || 'xs'))
  const isMobileAction = content.mobile_breakpoint && matches

  const [debounceFunc] = useDebouncedCallback(
    (value: string) => {
      if (value.length < 2) {
        return
      }

      setOpen(true)
      StoryblokService.getSearch(`cdn/stories`, {
        per_page: 25,
        sort_by: 'content.preview_title:desc',
        excluding_fields: 'body,right_body,meta_robots,property,seo_body',
        search_term: value,
        filter_query: {
          'component': {
            'in': 'page'
          }
        }
      }).then(res => {
        setAllStories(res.data.stories)
        setOpen(true)
        // setSearchText(value)
      })
    },
    400
  )

  return (
    <ListSearchAutocompleteContainer content={content}
                                     popperActive={open}
                                     inputRef={inputRef}
                                     isMobileAction={!!isMobileAction}>
      <Autocomplete
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        style={{ width: isMobileAction ? '100%' : undefined }}
        options={allStories.map(option => ({
          uuid: option.uuid,
          full_slug: option.full_slug,
          label: option.content?.preview_title || option.content?.meta_title || option.name || ''
        })).sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))}

        freeSolo
        classes={{
          root: classes.root,
          listbox: classes.listbox,
          inputRoot: clsx(classes.inputRoot, {
            [classes.borderSquare]: content.shape === 'square',
            [classes.borderRounded]: content.shape === 'rounded'
          }),
          input: clsx(classes.inputDefaultWidth, {
            [classes.variableWidth]: !isMobileAction
          })
        }}
        renderInput={(params) => (
          <TextField {...params}
                     size={'small'}
                     variant={'outlined'}
                     label={content.label || undefined}
                     placeholder={content.placeholder}
                     fullWidth={content.fullwidth || isMobileAction ? true : false}
                     inputRef={inputRef}
                     InputProps={{
                       ...params.InputProps,
                       onFocus: () => {
                         setOpen(true)
                       },
                       onBlur: () => {
                         setOpen(false)
                       },
                       onChange: (event: React.ChangeEvent<HTMLInputElement>) => debounceFunc(event.currentTarget.value),
                       autoComplete: 'new-password',
                       startAdornment: <InputAdornment position="start"> {content.icon?.name ?
                         <LmIcon iconName={content.icon.name} /> : <Magnify />}</InputAdornment>
                     }}
          />
        )}
        noOptionsText={content.not_found_label}
        getOptionLabel={(option) => option.label}
        PaperComponent={(props) => <Paper {...props}
                                          square={content.menu_square}
                                          variant={content.menu_outlined ? 'outlined' : 'elevation'}
                                          elevation={content.menu_elevation ? Number(content.menu_elevation) : 1}
                                          style={{
                                            ...props.style,
                                            borderRadius: content.menu_border_radius ? content.menu_border_radius : undefined
                                          }}
        />}
        renderOption={(item) => {
          const { rel, target, external, ...rest } = getLinkAttrs({
            cached_url: item.full_slug as string,
            linktype: 'story'
          }, {})
          return (
            <MuiNextLink href={CONFIG.href} as={rest.href} passHref key={item.uuid as string} prefetch={false}>
              {item.label}
            </MuiNextLink>
          )
        }}
      />
    </ListSearchAutocompleteContainer>
  )
}

