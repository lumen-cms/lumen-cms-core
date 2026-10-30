import type { SectionStoryblok } from '../../../typings/generated/components-schema'
import { LmComponentRender } from '../../../components/CoreComponents'
import translations from '../../utils/translations'
import { mainFlexRowHeadline } from './travelSectionContent'
import type { TravelSectionProps } from './travelSectionContent'
import { Card, Container } from '@mui/material'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid'
import Image from 'next/image'

export function TravelTeam({ content, langKey }: TravelSectionProps) {
  return (
    <Container sx={{ paddingBottom: '60px' }} maxWidth={'lg'}>
      <LmComponentRender
        content={
          {
            _uid: 'travel-team',
            component: 'section',
            padding: '0 0 0 0',
            body: [
              mainFlexRowHeadline({
                icon: 'account-group-outline',
                text: translations[langKey].travelDetail.team
              })
            ]
          } as SectionStoryblok
        }
      />
      <Card
        className={'team-card'}
        elevation={2}
        sx={{
          padding: 4,
          marginTop: 4,
          borderRadius: '12px',
          borderColor: { rgba: 'rgba(28,27,27,0.25)' },
          background:
            'linear-gradient(126deg, rgba(250,247,246,0) 0%, rgba(255,111,0,0.05) 100%)',
          '&:hover': {
            background:
              'linear-gradient(126deg, rgba(250,247,246,0) 0%, rgba(255,111,0,0.15) 100%)'
          }
        }}
      >
        <Grid2 container sx={{ gap: 4, flexDirection: ['column', 'row'] }}>
          <Grid2 size={{ xs: 'grow', sm: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Image
                src={
                  content.travel_team?.file_storyblok?.url_new ||
                  'https://cebytb37gqewrsv4.public.blob.vercel-storage.com/team-89665-dGAHJGyu3Fx9cuGwPmAKtAjSfwVqY3.jpg'
                }
                alt={translations[langKey].travelDetail.team}
                width={150}
                height={150}
                style={{
                  borderRadius: '10px'
                }}
              />
            </Box>
          </Grid2>
          <Grid2 size="grow" sx={{ flex: 1 }}>
            <LmComponentRender
              content={{
                component: 'headline',
                _uid: 'headline-team',
                typography: 'body2',
                color: 'primary',
                tag: 'h4',
                text: translations[langKey].travelDetail.team
              }}
            />
            <LmComponentRender
              content={{
                _uid: '2342',
                component: 'html',
                body: content.travel_team?.description
              }}
            />
          </Grid2>
          <Grid2></Grid2>
        </Grid2>
      </Card>
    </Container>
  )
}
