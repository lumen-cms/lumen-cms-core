import { FunctionComponent } from 'react'
import Box from '@mui/material/Box'
import { Travel } from '../../typings/generated/hasura-schema'
import { useRouter } from 'next/router'
import { TravelHeader } from './TravelHeader'
import { TravelOverview } from './TravelOverview'
import { TravelGallery } from './TravelGallery'
import { TravelServices } from './TravelServices'
import { TravelTeam } from './TravelTeam'

const TravelComponent: FunctionComponent<{ content: Travel }> = ({
  content
}) => {
  const { locale } = useRouter()
  const langKey =
    content.language_key || ((locale || '').toUpperCase() as 'DE' | 'EN')
  return (
    <Box
      id="travel-detail"
      sx={{
        //  fontSize: '1rem',
        //  fontFamily: 'Roboto',
        //  fontWeight: 400,
        //  lineHeight: 1.5,

        '& h3': {
          fontWeight: 400
        },

        '& h2': {
          textAlign: 'left',
          fontSize: '1rem',
          lineHeight: '1.5',
          fontWeight: 600
        },
        '& ul > li > p': {
          margin: 0
        }
      }}
    >
      <TravelHeader content={content} langKey={langKey} />
      <TravelOverview content={content} langKey={langKey} />
      <TravelGallery content={content} />
      <TravelServices content={content} langKey={langKey} />
      <TravelTeam content={content} langKey={langKey} />
    </Box>
  )
}

export default TravelComponent
