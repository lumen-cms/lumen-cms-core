export type AuslandszeitData = {
  address_string: string
  az_job_categories: {
    [key: number]: string
  }
  category: string
  country_string: string
  date_time_modified: string
  date_time_published: string
  description: string
  duration: string
  flag_code: string
  highlight: boolean
  id: number
  start_date: string
  teaser_note: string
  thumbnail_urls: {
    thumbnail: string[]
    medium: string[]
    medium_large: string[]
    large: string[]
    full: string[]
  }
  title: string
  type: string
  vacancies: string
  url: string
}
