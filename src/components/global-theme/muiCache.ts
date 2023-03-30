import { createEmotionSsrAdvancedApproach } from 'tss-react/next/pagesDir'

export const {
  augmentDocumentWithEmotionCache: augmentDocumentWithEmotionCache_mui,
  withAppEmotionCache: withAppEmotionCache_mui
} = createEmotionSsrAdvancedApproach({ key: 'css' })
