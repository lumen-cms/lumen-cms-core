type Aggregate = {
  aggregate: {
    count: number
  }
}
type CountryCityAggregate = {
  travels_aggregate: Aggregate
}
export type OptionItem = {
  id: number
  title: string
  title_de: string
  mn_travel_branches_aggregate?: Aggregate
  mn_travel_travel_types_aggregate?: Aggregate
  travels_aggregate?: Aggregate
  cities?: CountryCityAggregate[]
}
export type SelectBoxProps = {
  name: 'travelType' | 'branch' | 'country' | 'city'
  label: 'travel_type' | 'branch' | 'travelCountry' | 'city'
  // options: OptionItem[]
  titleKey?: 'title_de' | 'title'
  optionKey: 'travel_type' | 'branch' | 'country' | 'city'
}
