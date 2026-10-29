import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SWRConfig } from 'swr'
import { CONFIG } from '../../../src/utils/config'
import { AppContext } from '../../../src/components/provider/context/AppContext'
import LmListSearchAutocomplete from '../../../src/components/list-widget/ListSearchAutocomplete'
import { SearchPaletteProvider } from '../../../src/components/list-widget/SearchPaletteProvider'

CONFIG.publicToken = 'browser-test-public-token'
CONFIG.rootDirectory = 'en'
CONFIG.enableLocaleSuffix = false

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <AppContext.Provider
        value={{
          locale: 'en',
          defaultLocale: 'en',
          locales: ['en', 'de'],
          slug: '',
          insideStoryblok: false
        }}
      >
        <SWRConfig value={{ shouldRetryOnError: false }}>
          <SearchPaletteProvider>
            <header style={{ padding: 16, display: 'flex', gap: 16 }}>
              <LmListSearchAutocomplete
                content={{
                  _uid: 'primary',
                  component: 'list_search_autocomplete',
                  label: 'Search the site',
                  placeholder: 'Find content',
                  mobile_breakpoint: 'sm',
                  outlined: true,
                  large: true,
                  height: 56
                }}
              />
              <LmListSearchAutocomplete
                content={{
                  _uid: 'secondary',
                  component: 'list_search_autocomplete',
                  label: 'Other search',
                  mobile_breakpoint: 'sm',
                  shape: 'rounded',
                  menu_outlined: true
                }}
              />
            </header>
            <main>
              <h1>Search integration fixture</h1>
              <a href="#footer">Outside dialog</a>
            </main>
          </SearchPaletteProvider>
        </SWRConfig>
      </AppContext.Provider>
    </ThemeProvider>
  </StrictMode>
)
