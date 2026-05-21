import { generateUUID } from '../utils/uuid'

const USERS_KEY = 'gym_users'
const SESSION_KEY = 'gym_current_session'

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const AuthStore = {
  getUsers() {
    return readJSON(USERS_KEY, [])
  },

  register(username, password) {
    const users = this.getUsers()
    if (users.find(u => u.username === username.trim())) {
      throw new Error('이미 사용 중인 아이디입니다')
    }
    const user = {
      id: generateUUID(),
      username: username.trim(),
      password,
      createdAt: new Date().toISOString(),
    }
    writeJSON(USERS_KEY, [...users, user])
    return { id: user.id, username: user.username }
  },

  login(username, password) {
    const user = this.getUsers().find(
      u => u.username === username.trim() && u.password === password
    )
    if (!user) throw new Error('아이디 또는 비밀번호가 틀렸습니다')
    const session = { id: user.id, username: user.username }
    writeJSON(SESSION_KEY, session)
    return session
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
  },

  getSession() {
    return readJSON(SESSION_KEY, null)
  },

  getAllUsers() {
    return this.getUsers().map(({ id, username }) => ({ id, username }))
  },
}
