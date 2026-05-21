import { createContext, useContext, useState } from 'react'
import { AuthStore } from '../store/AuthStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => AuthStore.getSession())

  function login(username, password) {
    const session = AuthStore.login(username, password)
    setUser(session)
  }

  function register(username, password) {
    AuthStore.register(username, password)
    const session = AuthStore.login(username, password)
    setUser(session)
  }

  function logout() {
    AuthStore.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
