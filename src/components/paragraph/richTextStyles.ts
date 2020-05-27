import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useRichTextStyles = makeStyles((theme: Theme) => createStyles({
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
}))
