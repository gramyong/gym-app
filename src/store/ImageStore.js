const DB_NAME = 'gym_images'
const STORE_NAME = 'images'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE_NAME)
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = e => reject(e.target.error)
  })
}

export const ImageStore = {
  async save(blob) {
    const id = crypto.randomUUID()
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(blob, id)
      tx.oncomplete = () => resolve(id)
      tx.onerror = e => reject(e.target.error)
    })
  },

  async get(id) {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(id)
      req.onsuccess = e => resolve(e.target.result ?? null)
      req.onerror = e => reject(e.target.error)
    })
  },

  async delete(id) {
    if (!id) return
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = e => reject(e.target.error)
    })
  },
}
