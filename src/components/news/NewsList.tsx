import { NewsListProps } from './newsTypes'
import { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { useRouter } from 'next/router'
import { getDateLocalized } from '../../utils/intlDateHelper'
import MuiNextLink from '../link/MuiNextLink'
import Pagination from '@material-ui/lab/Pagination'

export default function LmNewsList({ content }: NewsListProps) {
  const { locale } = useRouter()
  const paginate = content.pagination?.[0]
  const chunkSize = paginate?.items_per_page
    ? Number(paginate.items_per_page)
    : false
  const [page, setPage] = useState<number>(1)
  const [list] = useState(content.news_list_data || [])
  const showPagination = chunkSize ? chunkSize < list.length : false
  const data = chunkSize
    ? list.slice((page - 1) * chunkSize, page * chunkSize)
    : list

  let paginationCount = chunkSize ? list.length / chunkSize : 0
  return (
    <div id={'news_' + content._uid} style={{ scrollMarginTop: '100px' }}>
      {data.map((i) => (
        <div key={i.uuid} className={'my-3'}>
          <MuiNextLink href={`/${i.full_slug}`}>
            <Typography variant={'h4'}>{i.content.title}</Typography>
          </MuiNextLink>
          <Typography variant={'body2'}>
            <strong>
              {[
                getDateLocalized({ start: i.content.published, locale }),
                content.hide_category ? null : i.content.category?.content?.name
              ]
                .filter((i) => i)
                .join(' - ')}
            </strong>
          </Typography>
          <Typography variant={'body1'}>{i.content.description}</Typography>
          <MuiNextLink href={`/${i.full_slug}`}>
            <Typography variant={'caption'}>
              {content.read_more_label || 'read more..'}
            </Typography>
          </MuiNextLink>
        </div>
      ))}
      {showPagination && (
        <Pagination
          count={paginationCount}
          onChange={(_event, page) => {
            setPage(page)
            const destination = document.getElementById('news_' + content._uid)
            if (destination) {
              destination.scrollIntoView({
                behavior: 'smooth'
              })
            }
          }}
          size={paginate?.size}
          color={paginate?.color}
          shape={paginate?.shape}
          variant={paginate?.variant}
        />
      )}
    </div>
  )
}
