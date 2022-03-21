import { makeStyles } from 'tss-react/mui'

export const useRichTextStyles = makeStyles({ name: 'RichTextStyles' })(
  (theme) => ({
    richText: {
      '& > p': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        '&:first-of-type': {
          marginTop: 0
        },
        '&:last-of-type': {
          marginBottom: 0
        }
      }
    }
  })
)
