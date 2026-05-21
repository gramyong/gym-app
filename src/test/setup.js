import '@testing-library/jest-dom'

// localStorage mock
const store = {}
global.localStorage = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = String(value) },
  removeItem: (key) => { delete store[key] },
  clear: () => { Object.keys(store).forEach(k => delete store[k]) },
}

beforeEach(() => {
  localStorage.clear()
})
