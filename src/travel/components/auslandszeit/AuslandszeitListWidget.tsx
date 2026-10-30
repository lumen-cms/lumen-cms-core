import { useState } from 'react'
import { AuslandszeitData } from './auslandszeitTypes'
import {
  Card,
  CardContent,
  CardActionArea,
  Stack,
  TextField,
  Typography,
  Box,
  CardMedia,
  Chip,
  InputAdornment,
  IconButton
} from '@mui/material'
import { useDebouncedCallback } from 'use-debounce'
import Grid2 from '@mui/material/Grid'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
export type AuslandszeitListWidgetProps = {
  content: {
    _uid: string
    component: 'auslandszeit_list_widget'
    auslandszeit_list_widget_data: {
      jobs: AuslandszeitData[]
    }
  }
}
export default function AuslandszeitListWidget({
  content
}: AuslandszeitListWidgetProps) {
  const [search, setSearch] = useState('')

  const q = search?.toLowerCase()

  const fields = [
    'title',
    'category',
    'address_string',
    'country_string',
    'description'
  ]

  const filteredJobs = search
    ? content.auslandszeit_list_widget_data.jobs.filter((job) =>
        fields.some((field) => (job as any)[field]?.toLowerCase().includes(q))
      )
    : content.auslandszeit_list_widget_data.jobs

  return (
    <Stack spacing={3}>
      <SearchInput onChange={setSearch} />
      <Grid2 container spacing={2}>
        {filteredJobs.map((job) => (
          <Grid2
            key={job.id}
            size={{ xs: 12, sm: 6, md: 4 }}
            sx={{ display: 'flex' }}
          >
            <AuslandszeitListItem item={job} />
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  )
}

function AuslandszeitListItem({ item }: { item: AuslandszeitData }) {
  const content = {
    title: item.title,
    start: item.start_date,
    duration: item.duration,
    address: item.address_string,
    image: item.thumbnail_urls.medium_large[0],
    type: item.type,
    isHighlighted: item.highlight,
    category: item.category,
    url: item.url
  }
  return (
    <Card
      elevation={2}
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        transition: '0.3s',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardActionArea
        component="a"
        href={content.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ height: '100%' }}
      >
        <CardMedia
          component="img"
          height="180"
          image={content.image}
          alt={content.title}
          sx={{ objectFit: 'cover' }}
          loading="lazy"
        />

        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            {content.category && <Chip size="small" label={content.category} />}
            {content.type && (
              <Chip
                size="small"
                label={content.type}
                variant="outlined"
                color="primary"
              />
            )}
          </Stack>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {content.title}
          </Typography>

          <Box sx={{ color: 'text.secondary', fontSize: 14 }}>
            {content.start && (
              <Typography variant="body2">
                <strong>Start:</strong> {content.start}
              </Typography>
            )}
            {content.duration && (
              <Typography variant="body2">
                <strong>Dauer:</strong> {content.duration}
              </Typography>
            )}
            {content.address && (
              <Typography variant="body2">
                <strong>Ort:</strong> {content.address}
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

function SearchInput({ onChange }: { onChange: (val: string) => void }) {
  const [searchInput, setSearchInput] = useState('')
  const debounced = useDebouncedCallback((val: string) => {
    onChange(val)
  }, 500)
  return (
    <TextField
      name="search"
      fullWidth
      value={searchInput || ''}
      variant="outlined"
      size="small"
      margin="dense"
      placeholder={'Suche nach einem Auslandsjob...'}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.currentTarget.value)
        debounced(event.currentTarget.value)
      }}
      slotProps={{
        htmlInput: { autoComplete: 'new-password' },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchInput ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  debounced.cancel()
                  setSearchInput('')
                  onChange('')
                }}
                edge="end"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }
      }}
    />
  )
}
