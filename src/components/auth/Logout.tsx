import { FunctionComponent, useEffect } from 'react'
import { unsetApolloAuth } from '../../apollo/apollo-client'
import { useHistory } from 'react-router-dom'
import { RouteState } from '../../typings/router.def'

/**
 * This component is only allowed being called inside of pages
 *
 * @constructor
 */
const Logout: FunctionComponent = () => {
  const history = useHistory()

  useEffect(() => {
    unsetApolloAuth()
    history.push(RouteState.Login)
  }, [history])

  return null
}

export default Logout
