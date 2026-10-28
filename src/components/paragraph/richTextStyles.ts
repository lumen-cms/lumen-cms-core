import { Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'

export const richTextSx: SystemStyleObject<Theme> = {
  '& > p': {
    marginTop: 1,
    marginBottom: 1,
    '&:first-of-type': {
      marginTop: 0
    },
    '&:last-of-type': {
      marginBottom: 0
    }
  }
}
