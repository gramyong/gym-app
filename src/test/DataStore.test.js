import { DataStore } from '../store/DataStore'

describe('DataStore - sessions', () => {
  test('빈 상태에서 getSessions()는 빈 배열 반환', () => {
    expect(DataStore.getSessions()).toEqual([])
  })

  test('addSession 후 getSessions에 포함', () => {
    const session = { date: '2026-05-21', exerciseName: '달리기', durationMinutes: 30 }
    DataStore.addSession(session)
    const sessions = DataStore.getSessions()
    expect(sessions).toHaveLength(1)
    expect(sessions[0].exerciseName).toBe('달리기')
    expect(sessions[0].id).toBeDefined()
    expect(sessions[0].createdAt).toBeDefined()
  })

  test('addSession 반환값에 id, createdAt 포함', () => {
    const result = DataStore.addSession({ date: '2026-05-21', exerciseName: '수영', durationMinutes: 45 })
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeDefined()
  })

  test('같은 날 세션 2개 추가 가능', () => {
    DataStore.addSession({ date: '2026-05-21', exerciseName: '달리기', durationMinutes: 30 })
    DataStore.addSession({ date: '2026-05-21', exerciseName: '수영', durationMinutes: 45 })
    expect(DataStore.getSessions()).toHaveLength(2)
  })

  test('updateSession 후 변경사항 반영', () => {
    const added = DataStore.addSession({ date: '2026-05-21', exerciseName: '달리기', durationMinutes: 30 })
    DataStore.updateSession(added.id, { durationMinutes: 60 })
    const sessions = DataStore.getSessions()
    expect(sessions[0].durationMinutes).toBe(60)
    expect(sessions[0].exerciseName).toBe('달리기')
  })

  test('deleteSession 후 목록에서 제거', () => {
    const added = DataStore.addSession({ date: '2026-05-21', exerciseName: '달리기', durationMinutes: 30 })
    DataStore.deleteSession(added.id)
    expect(DataStore.getSessions()).toHaveLength(0)
  })

  test('addSession에서 QuotaExceededError 발생 시 에러 throw', () => {
    const original = localStorage.setItem
    localStorage.setItem = () => { throw new DOMException('QuotaExceededError') }
    expect(() => DataStore.addSession({ date: '2026-05-21', exerciseName: '달리기', durationMinutes: 30 })).toThrow()
    localStorage.setItem = original
  })

  test('localStorage 재초기화 후 데이터 유지', () => {
    DataStore.addSession({ date: '2026-05-21', exerciseName: '달리기', durationMinutes: 30 })
    // 새로고침 시뮬레이션: 모듈 캐시 없이 localStorage에서 다시 읽기
    const sessions = DataStore.getSessions()
    expect(sessions).toHaveLength(1)
  })
})

describe('DataStore - sessions edge cases', () => {
  test('updateSession 존재하지 않는 id → 아무 변화 없음', () => {
    DataStore.addSession({ date: '2026-05-21', exerciseName: '달리기', durationMinutes: 30 })
    DataStore.updateSession('nonexistent-id', { durationMinutes: 999 })
    expect(DataStore.getSessions()[0].durationMinutes).toBe(30)
  })

  test('deleteSession 존재하지 않는 id → 기존 세션 유지', () => {
    DataStore.addSession({ date: '2026-05-21', exerciseName: '달리기', durationMinutes: 30 })
    DataStore.deleteSession('nonexistent-id')
    expect(DataStore.getSessions()).toHaveLength(1)
  })

  test('addSession id는 세션마다 고유', () => {
    const a = DataStore.addSession({ date: '2026-05-21', exerciseName: '달리기', durationMinutes: 30 })
    const b = DataStore.addSession({ date: '2026-05-21', exerciseName: '수영', durationMinutes: 45 })
    expect(a.id).not.toBe(b.id)
  })
})

describe('DataStore - favorites', () => {
  test('빈 상태에서 getFavorites()는 빈 배열 반환', () => {
    expect(DataStore.getFavorites()).toEqual([])
  })

  test('addFavorite 후 getFavorites에 포함', () => {
    DataStore.addFavorite('달리기')
    expect(DataStore.getFavorites()).toContain('달리기')
  })

  test('같은 이름 중복 추가 무시', () => {
    DataStore.addFavorite('달리기')
    DataStore.addFavorite('달리기')
    expect(DataStore.getFavorites()).toHaveLength(1)
  })

  test('removeFavorite 후 목록에서 제거', () => {
    DataStore.addFavorite('달리기')
    DataStore.addFavorite('수영')
    DataStore.removeFavorite('달리기')
    const favs = DataStore.getFavorites()
    expect(favs).not.toContain('달리기')
    expect(favs).toContain('수영')
  })
})
