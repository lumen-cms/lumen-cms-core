import React, { useState } from 'react'
import { alpha, useTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Magnify from 'mdi-material-ui/Magnify'
import Paper from '@mui/material/Paper'
import { StoriesParams, StoryData } from 'storyblok-js-client'
import { useDebouncedCallback } from 'use-debounce'
import InputAdornment from '@mui/material/InputAdornment'
import useSWR from 'swr'
import { CONFIG } from '@CONFIG'
import { PageComponent } from '../../typings/generated/schema'
import LmIcon from '../icon/LmIcon'
import MuiNextLink from '../link/MuiNextLink'
import { getLinkAttrs } from '../../utils/linkHandler'
import { LmListSearchAutocompleteProps } from './listWidgetTypes'
import { ListSearchAutocompleteContainer } from './ListSearchAutocompleteContainer'
import { match, parse } from './autosuggest'
import { useAppContext } from '@context/AppContext'
import { ListItem } from '@mui/material'
import { LmStoryblokService } from '../../utils/initial-props/StoryblokService'

const fetcher = async (
  path: string,
  searchterm: string,
  locale?: string,
  locales?: string
): Promise<StoryData<PageComponent>[]> => {
  if (!searchterm) {
    return []
  }
  let excluding_slugs = 'demo-content*'

  const params: StoriesParams = {
    per_page: 25,
    sort_by: 'content.preview_title:desc',
    filter_query: {
      component: {
        in: 'page'
      }
    },
    excluding_fields: 'body,right_body,meta_robots,property,seo_body',
    search_term: searchterm
  }
  if (locale) {
    params.starts_with = `${locale}/`
  } else if (locales) {
    params.excluding_slugs = `${excluding_slugs},${locales
      .split(',')
      .map((lang) => `${lang}/*`)
      .join(',')}`
  }
  const { data } = await LmStoryblokService.get(path, params)

  // const v2Url = new URL(`https://api.storyblok.com/v2${path}`)
  // if (cacheVersion) {
  //   v2Url.searchParams.append('cv', `${cacheVersion}`)
  // }
  // v2Url.searchParams.append('token', CONFIG.publicToken)
  // v2Url.searchParams.append('filter_query[component][in]', 'page')
  // v2Url.searchParams.append('per_page', '25')
  // v2Url.searchParams.append('sort_by', 'content.preview_title:desc')
  // v2Url.searchParams.append(
  //   'excluding_fields',
  //   'body,right_body,meta_robots,property,seo_body'
  // )
  // v2Url.searchParams.append('search_term', searchterm)
  //
  // v2Url.searchParams.append('excluding_slugs', excluding_slugs)
  // const result = await fetch(v2Url.toString()).then((r) => r.json())
  // if (!cacheVersion) {
  //   cacheVersion = result.cv
  // }
  return data.stories || []
}

type ListOptions = {
  uuid: string
  full_slug: string
  label: string
}[]

export default function LmListSearchAutocomplete({
  content
}: LmListSearchAutocompleteProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>()
  const theme = useTheme()
  const { defaultLocale, locale, locales } = useAppContext()
  const [open, setOpen] = useState<boolean | undefined>()

  let prefixLocale = defaultLocale !== locale ? locale : undefined
  if (CONFIG.rootDirectory) {
    prefixLocale = CONFIG.rootDirectory
  }
  if (CONFIG.enableLocaleSuffix) {
    prefixLocale = locale
  }
  const callback = useDebouncedCallback((value: string) => {
    if (value.length < 2) {
      return
    }
    setSearchTerm(value)
    setOpen(true)
  }, 400)
  const additionalLocales = locales
    ?.filter((i) => i !== defaultLocale)
    .join(',')
  const { data } = useSWR(
    searchTerm
      ? [`cdn/stories`, searchTerm, prefixLocale, additionalLocales]
      : null,
    fetcher
  )
  const allStories = data || []

  const options: ListOptions = allStories
    .map((option) => ({
      uuid: option.uuid,
      full_slug: option.full_slug,
      label:
        option.content?.preview_title ||
        option.content?.meta_title ||
        option.name ||
        ''
    }))
    .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0))
  return (
    <ListSearchAutocompleteContainer content={content} popperActive={open}>
      <Autocomplete
        autoComplete
        fullWidth={content.fullwidth}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        freeSolo
        sx={{
          display: 'inline-flex',
          verticalAlign: 'middle',
          color: 'inherit',
          '& .MuiOutlinedInput-notchedOutline': {
            backgroundColor: alpha('rgba(0,0,0,.05)', 0.15),
            borderRadius:
              content.shape === 'square'
                ? '0px'
                : content.shape === 'rounded'
                ? '20px'
                : undefined
          },
          '& .MuiInputBase-root': {
            color: 'inherit'
          },
          '& .MuiTextField-root': {
            width: 180,
            transition: theme.transitions.create('width')
          },
          '&.Mui-focused .MuiTextField-root': {
            width: 220,
            '& .MuiOutlinedInput-notchedOutline': {
              backgroundColor: alpha('rgba(0,0,0,.05)', 0.2),
              borderColor: theme.palette.action.focus
            }
          }
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              size={content.large ? 'medium' : 'small'}
              variant="outlined"
              label={content.label || undefined}
              placeholder={content.placeholder}
              fullWidth={!!content.fullwidth}
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
                  <InputAdornment position="start" sx={{ color: 'inherit' }}>
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
          )
        }}
        noOptionsText={content.not_found_label}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.label
        }
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
        renderOption={(_props, item, { inputValue }) => {
          const { href } = getLinkAttrs(
            {
              cached_url: item.full_slug,
              linktype: 'story'
            },
            {}
          )
          const matchValue = match(item.label, inputValue)
          const parts = parse(item.label, matchValue)

          return (
            <ListItem
              component={MuiNextLink}
              href={href}
              passHref
              key={item.uuid as string}
              prefetch={false}
              sx={{
                display: 'block',
                width: '100%',
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)!important',
                  textDecoration: 'none'
                }
              }}
            >
              {parts.map((part, index) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${index}`}
                  style={{
                    fontWeight: part.highlight ? 700 : undefined,
                    backgroundColor: part.highlight ? '#fff59d' : undefined
                  }}
                >
                  {part.text}
                </span>
              ))}
            </ListItem>
          )
        }}
      />
    </ListSearchAutocompleteContainer>
  )
}
