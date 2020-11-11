import React, { createRef, RefObject, useState } from 'react'
import {
  createStyles,
  fade,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Magnify from 'mdi-material-ui/Magnify'
import clsx from 'clsx'
import Paper from '@material-ui/core/Paper'
import { StoryData } from 'storyblok-js-client'
import { useDebouncedCallback } from 'use-debounce'
import InputAdornment from '@material-ui/core/InputAdornment'
import useSWR from 'swr'
import { CONFIG } from '@CONFIG'
import { useRouter } from 'next/router'
import { PageComponent } from '../../typings/generated/schema'
import LmIcon from '../icon/LmIcon'
import MuiNextLink from '../link/MuiNextLink'
import { getLinkAttrs } from '../../utils/linkHandler'

import { LmListSearchAutocompleteProps } from './listWidgetTypes'

import { ListSearchAutocompleteContainer } from './ListSearchAutocompleteContainer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-flex',
      verticalAlign: 'middle',
      '& .MuiInputLabel-root.Mui-focused': {
        color: 'inherit'
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
  })
)

const fetcher = async (
  path: string,
  searchterm: string,
  locale?: string
): Promise<StoryData<PageComponent>[]> => {
  console.log(searchterm, locale)
  const isDev = process.env.NODE_ENV === 'development'
  const token = isDev ? CONFIG.previewToken : CONFIG.publicToken
  const url = new URL(`https://cdn-api.lumen.media${path}`)
  url.searchParams.append('token', token)
  url.searchParams.append('searchterm', searchterm)
  if (isDev) {
    url.searchParams.append('no_cache', 'true')
  }
  if (locale) {
    url.searchParams.append('locale', locale)
  }

  const stories = await fetch(url.toString()).then((r) => r.json())
  return stories
}

export default function LmListSearchAutocomplete({
  content
}: LmListSearchAutocompleteProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>()
  const classes = useStyles()
  const { defaultLocale, locale } = useRouter()
  const inputRef: RefObject<HTMLInputElement> = createRef()
  const [open, setOpen] = useState<boolean | undefined>()
  const theme = useTheme()
  const matches = useMediaQuery(
    theme.breakpoints.down(content.mobile_breakpoint || 'xs')
  )
  let prefixLocale = defaultLocale !== locale ? locale : undefined
  if (CONFIG.rootDirectory) {
    prefixLocale = CONFIG.rootDirectory
  }
  const isMobileAction = content.mobile_breakpoint && matches
  const { callback } = useDebouncedCallback((value: string) => {
    if (value.length < 2) {
      return
    }
    setSearchTerm(value)
    setOpen(true)
  }, 400)
  const { data } = useSWR(
    searchTerm ? [`/api/search-stories`, searchTerm, prefixLocale] : null,
    fetcher
  )
  const allStories = data || []

  return (
    <ListSearchAutocompleteContainer
      content={content}
      popperActive={open}
      inputRef={inputRef}
      isMobileAction={!!isMobileAction}
    >
      <Autocomplete
        fullWidth={content.fullwidth}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        style={{ width: isMobileAction ? '100%' : undefined }}
        options={allStories
          .map((option) => ({
            uuid: option.uuid,
            full_slug: option.full_slug,
            label:
              option.content?.preview_title ||
              option.content?.meta_title ||
              option.name ||
              ''
          }))
          .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0))}
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
          <TextField
            {...params}
            size={content.large ? 'medium' : 'small'}
            variant="outlined"
            label={content.label || undefined}
            placeholder={content.placeholder}
            fullWidth={!!(content.fullwidth || isMobileAction)}
            inputRef={inputRef}
            InputProps={{
              ...params.InputProps,
              style: {
                height: content.height ? Number(content.height) : undefined
              },
              onFocus: () => {
                setOpen(true)
              },
              onBlur: () => {
                setOpen(false)
              },
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                callback(event.currentTarget.value),
              autoComplete: 'new-password',
              startAdornment: (
                <InputAdornment position="start">
                  {' '}
                  {content.icon?.name ? (
                    <LmIcon iconName={content.icon.name} />
                  ) : (
                    <Magnify />
                  )}
                </InputAdornment>
              )
            }}
          />
        )}
        noOptionsText={content.not_found_label}
        getOptionLabel={(option) => option.label}
        PaperComponent={(props) => (
          <Paper
            {...props}
            square={content.menu_square}
            variant={content.menu_outlined ? 'outlined' : 'elevation'}
            elevation={
              content.menu_elevation ? Number(content.menu_elevation) : 1
            }
            style={{
              ...props.style,
              borderRadius: content.menu_border_radius
                ? content.menu_border_radius
                : undefined
            }}
          />
        )}
        renderOption={(item) => {
          const { href } = getLinkAttrs(
            {
              cached_url: item.full_slug as string,
              linktype: 'story'
            },
            {}
          )
          return (
            <MuiNextLink
              href={CONFIG.href}
              as={href}
              passHref
              key={item.uuid as string}
              prefetch={false}
            >
              {item.label}
            </MuiNextLink>
          )
        }}
      />
    </ListSearchAutocompleteContainer>
  )
}
