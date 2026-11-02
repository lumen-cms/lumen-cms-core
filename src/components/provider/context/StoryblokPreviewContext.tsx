import { createContext, useContext, type PropsWithChildren } from 'react'
import { useAppContext, type AppContextProps } from './AppContext'

const StoryblokPreviewContext =
  createContext<AppContextProps['insideStoryblok']>(false)

// Bridge at the renderer's location so native AppContext overrides keep their
// precedence. Route updates render this adapter, but its children retain their
// identity and only receive a context update when the preview flag changes.
export function StoryblokPreviewProvider({ children }: PropsWithChildren) {
  const { insideStoryblok } = useAppContext()
  return (
    <StoryblokPreviewContext.Provider value={insideStoryblok}>
      {children}
    </StoryblokPreviewContext.Provider>
  )
}

export const useStoryblokPreview = () => useContext(StoryblokPreviewContext)
