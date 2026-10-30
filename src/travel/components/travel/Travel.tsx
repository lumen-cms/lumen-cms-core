import { FunctionComponent } from 'react'
import Box from '@mui/material/Box'
import {
  BackgroundStoryblok,
  ButtonStoryblok,
  CardStoryblok,
  ColumnStoryblok,
  DividerStoryblok,
  FlexRowStoryblok,
  HeadlineStoryblok,
  HtmlStoryblok,
  IconStoryblok,
  ImageStoryblok,
  RowStoryblok,
  SectionStoryblok,
  SwiperItemStoryblok,
  SwiperStoryblok
} from '../../../typings/generated/components-schema'
import { LmComponentRender } from '../../../components/CoreComponents'
import translations from '../../utils/translations'
import { Travel } from '../../typings/generated/hasura-schema'
import { useRouter } from 'next/router'
import { useCurrency } from '../travel-list/helpers'
import { Card, Container } from '@mui/material'
import Grid2 from '@mui/material/Grid'
import Image from 'next/image'

// const demoUrl = 'https://a.storyblok.com/f/69559/1920x1280/b349c2b8d3/header-auslandspraktikum-valencia.jpg'

const TravelComponent: FunctionComponent<{ content: Travel }> = ({
  content
}) => {
  const { locale } = useRouter()
  const langKey =
    content.language_key || ((locale || '').toUpperCase() as 'DE' | 'EN')
  const currency = useCurrency(langKey === 'DE' ? 'de' : 'en')
  const isGerman = langKey === 'DE'
  const fastFacts = [
    {
      icon: 'briefcase-clock-outline',
      text: translations[langKey].workingHour_label,
      subtext: (translations[langKey].workingHour as Record<number, string>)[
        content.travel_fast_fact?.working_hour || 0
      ]
    },
    {
      icon: 'account_arrow_right_outline',
      text: translations[langKey].minimumAge_label,
      subtext: content.travel_fast_fact?.minimum_age
        ? (translations[langKey].minimumAge as Record<number, string>)[
            content.travel_fast_fact?.minimum_age
          ]
        : ''
    },
    {
      icon: 'school-outline',
      text: translations[langKey].education_label,
      noTranslate: true,
      subtext: content.travel_fast_fact?.education
    },
    {
      icon: 'account-tie-voice-outline',
      text: translations[langKey].languageSkill_label,
      subtext: content.travel_fast_fact?.language_skill
        ? (translations[langKey].languageSkill as Record<number, string>)[
            content.travel_fast_fact?.language_skill
          ]
        : ''
    }
  ]

  const localeTitleString = isGerman ? 'title_de' : 'title'
  const countryName = content.city?.country?.[localeTitleString]
  const cityName = content?.city?.[localeTitleString]
  const travelTypes = content.mn_travel_travel_types
    ?.map((i) => i.travel_type?.[localeTitleString])
    .join(', ')
  let orangeColor = 'rgba(255,154,77,1)'
  const mainFlexRowHeadline = ({
    icon,
    text
  }: {
    icon: string
    text: string
  }) =>
    ({
      _uid: icon,
      component: 'flex_row',
      gap: 1,
      styles: [{ margin: '40px 0 0 0' }],
      body: [
        {
          component: 'icon',
          _uid: 'icon-' + icon,
          class_names: { values: ['text-primary'] },
          name: { name: icon }
        } as IconStoryblok,
        {
          _uid: 'head-' + icon,
          component: 'headline',
          typography: 'headline5',
          font: 'alt1',
          class_names: { values: ['font-weight-800'] },
          text: text
        }
      ]
    } as FlexRowStoryblok)
  const swiperItems = (content.file_storybloks || [])
    .filter((i) => i.url_new)
    .map(
      (item) =>
        ({
          _uid: `image_list_item${item.id}`,
          component: 'swiper_item',
          body: [
            {
              component: 'flex_row',
              _uid: `wrap-${item.url_new}`,
              column: true,
              styles: [
                {
                  component: 'styles',
                  _uid: `style-${item.url_new}`,
                  height: '120px',
                  border_radius: '10px',
                  'object-fit': 'cover'
                }
              ],
              body: [
                {
                  component: 'image',
                  _uid: item.url_new,
                  source: item.url_new,
                  border_radius: '8px'
                } as ImageStoryblok
              ]
            } as FlexRowStoryblok
          ]
        } as SwiperItemStoryblok)
    )
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
      <LmComponentRender
        content={
          {
            _uid: 'section_parallax_headline',
            component: 'section',
            padding: '17rem 0',
            background: [
              {
                _uid: 'xyz2',
                component: 'background',
                // height: '50vh',
                image:
                  content.fileStoryblokByHeaderImageId?.url_new ??
                  process.env.NEXT_PUBLIC_TRAVEL_HEADER_FALLBACK_IMG
              } as BackgroundStoryblok
            ],
            body: [
              {
                _uid: 'row-1',
                component: 'row',
                styles: [
                  {
                    margin: '170px 0px -200px 0px'
                  }
                ],
                styles_mobile: [
                  {
                    margin: '100px 0px -200px 0px'
                  }
                ],
                body: [
                  {
                    _uid: 'column-1',
                    component: 'column',
                    body: [
                      {
                        _uid: 'first-row-headline',
                        component: 'headline',
                        tag: 'h3',
                        typography: 'headline6',
                        custom_color: { rgba: orangeColor },
                        text: `${translations[langKey].ad} | ${travelTypes} in ${countryName}`,
                        class_names: { values: ['mb-0'] }
                      } as HeadlineStoryblok,
                      {
                        _uid: 'headline-1',
                        component: 'headline',
                        tag: 'h1',
                        typography: 'headline4',
                        font: 'alt1',
                        text: content.title,
                        class_names: { values: ['font-weight-800', 'my-0'] },
                        custom_color: { rgba: '#fff' }
                      } as HeadlineStoryblok,
                      {
                        _uid: 'headline-3',
                        component: 'flex_row',
                        align_items: 'center',
                        align_content: 'center',
                        gap: 1,
                        body: [
                          {
                            component: 'icon',
                            name: { name: 'google-maps' },
                            color: { rgba: orangeColor }
                          } as IconStoryblok,
                          {
                            custom_color: { rgba: orangeColor },
                            component: 'headline',
                            typography: 'headline6',
                            text: `${cityName}, ${countryName}`
                          } as HeadlineStoryblok
                        ]
                      } as FlexRowStoryblok
                    ]
                  } as ColumnStoryblok
                ]
              } as RowStoryblok
            ]
          } as SectionStoryblok
        }
      />
      <LmComponentRender
        content={{
          _uid: 'fast-facts',
          component: 'section',
          body: [
            {
              _uid: 'row-1',
              component: 'row',
              reverse_on_mobile: true,
              justify: 'flex-start',
              align_items: 'flex-start',
              body: [
                {
                  _uid: 'col-1',
                  component: 'column',
                  width_general: '8',
                  width_tablet: '8',
                  body: [
                    {
                      _uid: 'col-1',
                      component: 'flex_row',
                      gap: 1,
                      body: [
                        {
                          _uid: 'head-1',
                          component: 'headline',
                          typography: 'headline5',
                          font: 'alt1',
                          color: 'primary',
                          class_names: { values: ['font-weight-800'] },
                          text: translations[langKey].quickFact
                        },
                        {
                          _uid: 'headsasad-1',
                          font: 'alt1',
                          typography: 'headline5',
                          class_names: { values: ['font-weight-800'] },
                          component: 'headline',
                          text: translations[langKey].adShort
                        }
                      ] as HeadlineStoryblok[]
                    } as FlexRowStoryblok,
                    {
                      component: 'row',
                      _uid: 'row22',
                      direction: 'row',
                      styles: [{ margin: '0 0 40px 0' }],
                      body: fastFacts.map(
                        (fact, index) =>
                          ({
                            _uid: index + '-column',
                            component: 'column',
                            width_general: 'true',
                            width_tablet: 'true',
                            width_phone: '2',
                            background: [
                              {
                                component: 'background',
                                _uid: 'bg',
                                elevation: 1,
                                border_radius: '12px',
                                shadow_effect: 'soft'
                              } as BackgroundStoryblok
                            ],
                            styles_hover: [
                              {
                                css_properties: [
                                  {
                                    component: 'item_key_value',
                                    key: 'background',
                                    value:
                                      'linear-gradient(126deg, rgba(250,247,246,0) 0%, rgba(255,111,0,0.15) 100%)'
                                  }
                                ]
                              }
                            ],
                            body: [
                              {
                                component: 'flex_row',
                                column: true,
                                gap: 1,
                                align_items: 'center',
                                body: [
                                  {
                                    component: 'icon',
                                    _uid: `icon-${index}`,
                                    name: { name: fact.icon }
                                  } as IconStoryblok,
                                  {
                                    component: 'headline',
                                    _uid: `head-1-${index}`,
                                    text: fact.text,
                                    font: 'alt1',
                                    typography: 'body2',
                                    align: 'center',
                                    class_names: { values: ['font-weight-800'] }
                                  } as HeadlineStoryblok,
                                  {
                                    component: 'headline',
                                    _uid: `head-2-${index}`,
                                    text: fact.subtext,
                                    typography: 'body2',
                                    align: 'center'
                                  } as HeadlineStoryblok
                                ]
                              } as FlexRowStoryblok
                            ]
                          } as ColumnStoryblok)
                      ) as ColumnStoryblok[]
                    } as RowStoryblok,
                    {
                      component: 'divider',
                      _uid: 'dddi1'
                    } as DividerStoryblok,
                    mainFlexRowHeadline({
                      icon: 'map-marker-check-outline',
                      text: translations[langKey].travelDetail.overview
                    }),
                    {
                      _uid: '12asdas3',
                      component: 'html',
                      body: content.overview,
                      styles: [{ margin: '0 0 40px 0' }]
                    } as HtmlStoryblok,
                    {
                      component: 'divider',
                      _uid: 'dddi1assa'
                    } as DividerStoryblok,
                    mainFlexRowHeadline({
                      icon: 'map-check-outline',
                      text: translations[langKey].travelDetail.description
                    }),
                    {
                      _uid: '123adassas',
                      component: 'html',
                      body: content.description,
                      styles: [{ margin: '0 0 40px 0' }]
                    } as HtmlStoryblok,
                    {
                      component: 'divider',
                      _uid: 'dddassassi1'
                    },
                    mainFlexRowHeadline({
                      icon: 'clipboard-list-outline',
                      text: translations[langKey].travelDetail.program_flow
                    }),
                    {
                      _uid: '1adsas23',
                      component: 'html',
                      body: content.travel_itinerary?.description
                    } as HtmlStoryblok
                  ]
                } as ColumnStoryblok,
                {
                  _uid: 'col-2',
                  component: 'column',
                  width_general: '4',
                  width_tablet: '8',
                  body: [
                    {
                      _uid: 'card',
                      component: 'card',
                      content_padding: 4,
                      styles: [
                        {
                          margin: '0 25px',
                          elevation: 0,
                          border_radius: '12px',
                          border_color: { rgba: 'rgba(28,27,27,0.25)' },
                          css_properties: [
                            {
                              component: 'item_key_value',
                              key: 'background',
                              value:
                                'linear-gradient(126deg, rgba(250,247,246,0) 0%, rgba(255,111,0,0.05) 100%)'
                            }
                          ]
                        }
                      ],
                      styles_hover: [
                        {
                          elevation: 4,
                          css_properties: [
                            {
                              component: 'item_key_value',
                              key: 'background',
                              value:
                                'linear-gradient(126deg, rgba(250,247,246,0) 0%, rgba(255,111,0,0.15) 100%)'
                            }
                          ]
                        }
                      ],
                      body: [
                        {
                          component: 'headline',
                          _uid: 'el-1',
                          typography: 'body2',
                          color: 'primary',
                          tag: 'h3',
                          text: translations[langKey].readyStart,
                          class_names: { values: ['mb-0'] }
                        } as HeadlineStoryblok,
                        {
                          component: 'headline',
                          _uid: 'el-2',
                          typography: 'headline6',
                          font: 'alt1',
                          class_names: { values: ['pb-2', 'font-weight-800'] },
                          text: content.title
                        } as HeadlineStoryblok,
                        {
                          component: 'flex_row',
                          _uid: 'el-3',
                          align_items: 'center',
                          justify: 'flex-start',
                          gap: 1,
                          body: [
                            {
                              component: 'icon',
                              _uid: 'el-4',
                              name: { name: 'check-bold' },
                              class_names: { values: ['text-primary'] }
                            } as IconStoryblok,
                            {
                              component: 'headline',
                              _uid: 'el-5',
                              typography: 'body1',
                              text: translations[langKey].flexibleStart
                            } as HeadlineStoryblok
                          ]
                        } as FlexRowStoryblok,
                        {
                          component: 'flex_row',
                          _uid: 'el-4',
                          align_items: 'center',
                          justify: 'flex-start',
                          gap: 1,
                          body: [
                            {
                              component: 'icon',
                              _uid: 'el-4',
                              name: { name: 'check-bold' },
                              class_names: { values: ['text-primary'] }
                            } as IconStoryblok,
                            {
                              component: 'headline',
                              _uid: 'el-5',
                              typography: 'body1',
                              text: content.travel_fast_fact?.duration
                            } as HeadlineStoryblok
                          ]
                        } as FlexRowStoryblok,
                        {
                          component: 'flex_row',
                          _uid: 'el-5',
                          align_items: 'center',
                          justify: 'flex-start',
                          gap: 1,
                          body: [
                            {
                              component: 'icon',
                              _uid: 'el-4',
                              name: { name: 'check-bold' },
                              class_names: { values: ['text-primary'] }
                            } as IconStoryblok,
                            {
                              component: 'headline',
                              _uid: 'el-5',
                              typography: 'body1',
                              text: content.travel_fast_fact?.minimum_age
                                ? (
                                    translations[langKey].minimumAge as Record<
                                      number,
                                      string
                                    >
                                  )[content.travel_fast_fact?.minimum_age]
                                : ''
                            } as HeadlineStoryblok
                          ]
                        } as FlexRowStoryblok,
                        {
                          component: 'flex_row',
                          _uid: 'el-6',
                          align_items: 'center',
                          justify: 'flex-start',
                          gap: 1,
                          body: [
                            {
                              component: 'icon',
                              _uid: 'el-4',
                              name: { name: 'check-bold' },
                              class_names: { values: ['text-primary'] }
                            } as IconStoryblok,
                            {
                              component: 'headline',
                              _uid: 'el-5',
                              typography: 'body1',
                              text: content.travel_fast_fact?.language_skill
                                ? (
                                    translations[langKey]
                                      .languageSkill as Record<number, string>
                                  )[content.travel_fast_fact?.language_skill]
                                : ''
                            } as HeadlineStoryblok
                          ]
                        } as FlexRowStoryblok,
                        {
                          component: 'flex_row',
                          _uid: 'el-7',
                          align_items: 'baseline',
                          gap: 1,
                          class_names: { values: ['py-3'] },
                          body: [
                            {
                              component: 'headline',
                              _uid: 'el-4',
                              typography: 'body1',
                              text: translations[langKey].price_starting
                            } as HeadlineStoryblok,
                            {
                              component: 'headline',
                              _uid: 'el-5',
                              typography: 'headline3',
                              font: 'alt1',
                              class_names: { values: ['font-weight-800'] },
                              text:
                                content.product?.product_price?.[currency] +
                                ' ' +
                                currency.toUpperCase()
                            } as HeadlineStoryblok
                          ]
                        } as FlexRowStoryblok,
                        {
                          _uid: 'el-9787',
                          component: 'button',
                          icon: { name: 'account-check-outline' },
                          custom_color: { rgba: 'rgba(255,255,255,1)' },
                          font: 'alt1',
                          label: translations[langKey].travelDetail.costs,
                          properties: ['fullWidth'],
                          link: {
                            linktype: 'url',
                            cached_url: `https://admin.studentsgoabroad.com/signup?tid=${
                              content.id
                            }&lang=${langKey.toLowerCase()}`
                          },
                          class_names: { values: ['py-1'] },
                          styles: [
                            {
                              css_properties: [
                                {
                                  key: 'background',
                                  value:
                                    'linear-gradient(to top right, #FF6F00 0%, #FA391B 100%)'
                                }
                              ]
                            }
                          ],
                          styles_hover: [
                            {
                              css_properties: [
                                {
                                  key: 'background',
                                  value:
                                    'linear-gradient(to bottom right, #FF6F00 0%, #FA391B 100%)'
                                }
                              ]
                            }
                          ]
                        } as ButtonStoryblok,
                        {
                          component: 'headline',
                          _uid: 'afasfasfsa',
                          typography: 'body2',
                          class_names: { values: ['mt-3'] },
                          text: translations[langKey].questionText
                        } as HeadlineStoryblok,
                        {
                          component: 'button',
                          _uid: 'elasdas9',
                          icon: { name: 'arrow-right' },
                          link: {
                            linktype: 'story',
                            cached_url:
                              langKey === 'EN' ? '/contact' : '/kontakt'
                          },
                          label: translations[langKey].questionLink
                        } as ButtonStoryblok
                      ]
                    } as CardStoryblok
                  ]
                } as ColumnStoryblok
              ]
            } as RowStoryblok
          ],
          background: [
            {
              _uid: '2',
              component: 'background'
            } as BackgroundStoryblok
          ]
        }}
      />

      {swiperItems.length > 0 && (
        <LmComponentRender
          content={
            {
              _uid: 'image-list',
              component: 'section',
              max_width: 'none',
              body: [
                {
                  component: 'swiper',
                  _uid: 'wiperxxs',
                  body: swiperItems,
                  theme_color: 'primary.main',
                  slides_per_view: '2,3,6',
                  autoslide_duration: 4000,
                  property: ['hide_pagination'],
                  space_between_slides: '20'
                } as SwiperStoryblok
              ]
            } as SectionStoryblok
          }
        />
      )}
      <LmComponentRender
        content={{
          _uid: 'service-tabs',
          component: 'section',
          body: [
            mainFlexRowHeadline({
              icon: 'home-circle-outline',
              text: translations[langKey].travelDetail.accommodation
            }),
            {
              _uid: 'asdasfa',
              component: 'html',
              body: content.travel_accommodation?.description,
              styles: [{ margin: '0 0 40px 0' }]
            } as HtmlStoryblok,
            {
              component: 'divider',
              _uid: '123322asdsa'
            } as DividerStoryblok,
            mainFlexRowHeadline({
              icon: 'beaker-check-outline',
              text: translations[langKey].travelDetail.service
            }),
            {
              _uid: '12332asdfsa2',
              component: 'html',
              body: content.travel_service?.description
            } as HtmlStoryblok
          ]
        }}
      />

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
                // }
                // [{
                //   component: 'headline',
                //   _uid: 'headline-team',
                //   typography: 'body2',
                //   color: 'primary',
                //   tag: 'h4',
                //   text: translations[langKey].travelDetail.team
                // } as HeadlineStoryblok, {
                //   _uid: '2342',
                //   component: 'html',
                //   body: content.travel_team?.description
                // } as HtmlStoryblok]}
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
    </Box>
  )
}

export default TravelComponent
