import React from 'react'
import { SelectField } from './SelectField'
import { SearchInputField } from './SearchInputField'

function TravelSearchBox(): React.JSX.Element | null {
  return (
    <div>
      <SearchInputField />
      <SelectField
        name="travelType"
        optionKey={'travel_type'}
        label={'travel_type'}
      />
      <SelectField name="branch" optionKey={'branch'} label={'branch'} />
      <SelectField
        name="country"
        optionKey={'country'}
        label={'travelCountry'}
      />
      <SelectField name="city" label={'city'} optionKey={'city'} />
    </div>
  )
}

export default TravelSearchBox
