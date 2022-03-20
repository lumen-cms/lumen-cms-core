import { makeStyles } from 'tss-react/mui'

export const useRichTextStyles = makeStyles({ name: 'RichTextStyles' })(
  (theme) => ({
    richText: {
      '& > p': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        '&:first-child': {
          marginTop: 0
        },
        '&:last-child': {
          marginBottom: 0
        }
      }
    }
  })
)
