import { generateUUID } from '../utils/uuid'

const FAVORITES_KEY = 'gym_favorites'

function sessionsKey(userId) { return `gym_sessions_${userId}` }

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
  getSessions(userId) {
    return readJSON(sessionsKey(userId), [])
  },

  addSession(userId, session) {
    const sessions = this.getSessions(userId)
    const newSession = {
      ...session,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
    }
    writeJSON(sessionsKey(userId), [...sessions, newSession])
    return newSession
  },

  updateSession(userId, id, updates) {
    const sessions = this.getSessions(userId)
    const idx = sessions.findIndex(s => s.id === id)
    if (idx === -1) return
    sessions[idx] = { ...sessions[idx], ...updates }
    writeJSON(sessionsKey(userId), sessions)
  },

  deleteSession(userId, id) {
    const sessions = this.getSessions(userId)
    writeJSON(sessionsKey(userId), sessions.filter(s => s.id !== id))
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
