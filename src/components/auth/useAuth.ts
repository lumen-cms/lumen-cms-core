import create from 'zustand'
import shallow from 'zustand/shallow'
import { User } from '@auth0/auth0-react'

type UserProps = User & {
  id: string
  sub?: string
  email?: string
  firstName?: string
  lastName?: string
}
type AuthContext = {
  user?: UserProps | null
  actions: {
    setUser: (user: UserProps | null) => void
  }
}

const useAuthContext = create<AuthContext>()((setState) => ({
  actions: {
    setUser: (user) => setState({ user })
  }
}))

export const useUserData = () => useAuthContext((state) => state.user, shallow)
export const useUserActions = () =>
  useAuthContext((state) => state.actions, shallow)