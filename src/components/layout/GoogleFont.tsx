import NextHead from 'next/head'

export default function GoogleFont({
  googleFontString
}: {
  googleFontString?: string
}): JSX.Element | null {
  if (!googleFontString) {
    return null
  }
  return (
    <NextHead>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com/"
        crossOrigin="anonymous"
      />
      <style dangerouslySetInnerHTML={{ __html: googleFontString }} />
    </NextHead>
  )
}
