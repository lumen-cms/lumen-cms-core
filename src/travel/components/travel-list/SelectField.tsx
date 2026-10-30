import { OptionItem, SelectBoxProps } from './travelListTypes'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { usePageContext } from '../page/PageContext'
import translations from '../../utils/translations'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import ClearIcon from '@mui/icons-material/Clear'
import useTravelSearch from './useTravelSearch'
import { AllCategoriesQuery } from '../../typings/generated/hasura-schema'

type Options =
  | AllCategoriesQuery['branch']
  | AllCategoriesQuery['city']
  | AllCategoriesQuery['travel_type']
  | AllCategoriesQuery['country']

const getOptionLabel = (option: OptionItem, titleKey: 'title' | 'title_de') => {
  const travelBranchesAggregate = option.mn_travel_branches_aggregate
  let string = option[titleKey]
  if (travelBranchesAggregate) {
    string += ` [${travelBranchesAggregate.aggregate.count}]`
  } else if (option.mn_travel_travel_types_aggregate) {
    string += ` [${option.mn_travel_travel_types_aggregate.aggregate.count}]`
  } else if (option.cities) {
    let additionalCount = 0
    option.cities.forEach((item) => {
      additionalCount += item.travels_aggregate.aggregate.count
    })
    string += ` [${additionalCount}]`
  } else if (option.travels_aggregate) {
    string += ` [${option.travels_aggregate.aggregate.count}]`
  }
  return string
}

const labelIdFor = (name: string) => `${name}-label`

export function SelectField({
  name,
  label,
  optionKey
}: SelectBoxProps): React.JSX.Element {
  const theme = useTheme()
  const [interacted, setInteracted] = useState<boolean>(false)
  const [focused, setFocused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const query = router?.query || {}
  const titleKey = router.locale === 'de' ? 'title_de' : 'title'
  const { value, updateContext } = usePageContext()
  const selectValue = value[name] || (!interacted && query[name]) || ''
  const { error, data } = useTravelSearch()
  if (error) {
    console.error(error)
  }

  const options: Options = data?.[optionKey] || ([] as Options)

  const translation = translations[router.locale?.toUpperCase() as 'EN' | 'DE']
  const labelText = translation[label] as string
  const stringValue = selectValue ? `${selectValue}` : ''
  const hasSelection = Boolean(stringValue)
  const labelShrinks = hasSelection || focused || menuOpen

  const emptyPlaceholder = router.locale === 'de' ? 'Wählen…' : 'Choose…'

  const renderSelectValue = (selected: unknown) => {
    const s = selected == null || selected === '' ? '' : `${selected}`
    if (!s) {
      if (labelShrinks) {
        return (
          <span style={{ color: theme.palette.text.secondary }}>
            {emptyPlaceholder}
          </span>
        )
      }
      return '\u00a0'
    }
    const option = (options as OptionItem[]).find((o) => String(o.id) === s)
    return option ? getOptionLabel(option, titleKey) : s
  }

  const clearAria =
    router.locale === 'de' ? 'Auswahl löschen' : 'Clear selection'

  const handleChange = (ev: SelectChangeEvent<string>) => {
    updateContext({ [name]: ev.target.value })
    setInteracted(true)
  }

  return (
    <FormControl fullWidth variant="outlined" margin="normal" disabled={!data}>
      <InputLabel id={labelIdFor(name)} shrink={labelShrinks}>
        {labelText}
      </InputLabel>
      <Select
        labelId={labelIdFor(name)}
        id={name}
        label={labelText}
        value={stringValue}
        displayEmpty
        // MUI forces notched: true whenever displayEmpty + outlined (Select.js), which
        // leaves an empty top cut-out if the label is not shrunk. Override to stay in sync.
        notched={labelShrinks}
        renderValue={renderSelectValue}
        onOpen={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        endAdornment={
          hasSelection ? (
            <InputAdornment position="end" sx={{ mr: theme.spacing(1) }}>
              <IconButton
                size="small"
                aria-label={clearAria}
                disabled={!data}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  updateContext({ [name]: '' })
                  setInteracted(true)
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined
        }
      >
        {(options as OptionItem[]).map((option) => (
          <MenuItem key={option.id} value={String(option.id)}>
            {getOptionLabel(option, titleKey)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
