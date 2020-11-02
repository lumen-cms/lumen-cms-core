import React, { useState } from 'react'
import Link from 'next/link'
import { auth } from '../../utils/nhost/nhost'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await auth.login(email, password)
      // refetch???
      // Router.push('/dashboard')
    } catch (error) {
      alert(`error logging in`)
      console.error({ error })
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>

      <div>
        <Link href="/register">
          <a>Register</a>
        </Link>
      </div>
      <div>
        <Link href="/">
          <a>Index</a>
        </Link>
      </div>
    </div>
  )
}
