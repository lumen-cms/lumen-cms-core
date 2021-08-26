import { LmNewsListProps } from './listWidgetTypes'
import LmNewsListItem from './NewsListItem'

export default function LmNewsList({ items, options }: LmNewsListProps) {
  return (
    <>
      {items.map((story) => {
        return (
          <LmNewsListItem content={story} options={options} key={story.uuid} />
        )
      })}
    </>
  )
}
