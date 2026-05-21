const SESSIONS_KEY = 'gym_sessions'
const FAVORITES_KEY = 'gym_favorites'

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const DataStore = {
  getSessions() {
    return readJSON(SESSIONS_KEY, [])
  },

  addSession(session) {
    const sessions = this.getSessions()
    const newSession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    // localStorage.setItem throws QuotaExceededError — let it propagate
    writeJSON(SESSIONS_KEY, [...sessions, newSession])
    return newSession
  },

  updateSession(id, updates) {
    const sessions = this.getSessions()
    const idx = sessions.findIndex(s => s.id === id)
    if (idx === -1) return
    sessions[idx] = { ...sessions[idx], ...updates }
    writeJSON(SESSIONS_KEY, sessions)
  },

  deleteSession(id) {
    const sessions = this.getSessions()
    writeJSON(SESSIONS_KEY, sessions.filter(s => s.id !== id))
  },

  getFavorites() {
    return readJSON(FAVORITES_KEY, [])
  },

  addFavorite(name) {
    const favs = this.getFavorites()
    if (favs.includes(name)) return
    writeJSON(FAVORITES_KEY, [...favs, name])
  },

  removeFavorite(name) {
    const favs = this.getFavorites()
    writeJSON(FAVORITES_KEY, favs.filter(f => f !== name))
  },
}
