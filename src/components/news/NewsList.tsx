import { NewsListProps } from './newsTypes'
import { useState } from 'react'
import Pagination from '@material-ui/lab/Pagination'
import LmNewsListItem from './NewsListItem'

export default function LmNewsList({ content }: NewsListProps) {
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

  let paginationCount = chunkSize ? Math.ceil(list.length / chunkSize) : 0
  return (
    <div id={'news_' + content._uid} style={{ scrollMarginTop: '100px' }}>
      <div className={'mb-2'}>
        {data.map((blok) => (
          <LmNewsListItem
            content={blok}
            date_format={content.date_format}
            hide_category={content.hide_category}
            read_more_label={content.read_more_label}
            key={blok.uuid}
          />
        ))}
      </div>
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
