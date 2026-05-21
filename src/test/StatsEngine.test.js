import { getWeeklyStats, getMonthlyHeatmap, getTrendData, getSunday } from '../stats/StatsEngine'

// 테스트용 세션 생성 헬퍼
function s(date, minutes) {
  return { id: crypto.randomUUID(), date, durationMinutes: minutes, createdAt: new Date().toISOString() }
}

// local midnight Date (UTC 파싱 회피)
function localDate(yyyy, mm, dd) {
  return new Date(yyyy, mm - 1, dd)
}

function localDateStr(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

describe('getSunday', () => {
  test('일요일이면 그대로 반환', () => {
    expect(localDateStr(getSunday(localDate(2026, 5, 17)))).toBe('2026-05-17')
  })

  test('수요일이면 해당 주 일요일 반환', () => {
    expect(localDateStr(getSunday(localDate(2026, 5, 20)))).toBe('2026-05-17')
  })

  test('토요일이면 해당 주 일요일 반환', () => {
    expect(localDateStr(getSunday(localDate(2026, 5, 23)))).toBe('2026-05-17')
  })
})

describe('getWeeklyStats', () => {
  const sunday = localDate(2026, 5, 17)

  test('세션 없으면 7일 모두 0', () => {
    const result = getWeeklyStats([], sunday)
    expect(result).toHaveLength(7)
    expect(result.every(d => d.minutes === 0)).toBe(true)
  })

  test('일요일 세션 → 첫 번째 항목에 반영', () => {
    const result = getWeeklyStats([s('2026-05-17', 30)], sunday)
    expect(result[0].minutes).toBe(30)
    expect(result[0].label).toBe('일')
  })

  test('토요일 세션 → 마지막 항목에 반영', () => {
    const result = getWeeklyStats([s('2026-05-23', 45)], sunday)
    expect(result[6].minutes).toBe(45)
    expect(result[6].label).toBe('토')
  })

  test('운동 안 한 날은 0', () => {
    const result = getWeeklyStats([s('2026-05-19', 30)], sunday)
    expect(result[0].minutes).toBe(0) // 일
    expect(result[2].minutes).toBe(30) // 화
    expect(result[5].minutes).toBe(0) // 금
  })

  test('같은 날 세션 여러 개 → 합산', () => {
    const sessions = [s('2026-05-18', 20), s('2026-05-18', 40)] // 월요일
    const result = getWeeklyStats(sessions, sunday)
    expect(result[1].minutes).toBe(60)
  })

  test('주 경계: 다른 주 세션은 포함 안 함', () => {
    const result = getWeeklyStats([s('2026-05-16', 999)], sunday) // 이전 주 토요일
    expect(result.every(d => d.minutes === 0)).toBe(true)
  })
})

describe('getMonthlyHeatmap', () => {
  test('5월은 31일', () => {
    expect(getMonthlyHeatmap([], 2026, 5)).toHaveLength(31)
  })

  test('운동한 날 active=true', () => {
    const result = getMonthlyHeatmap([s('2026-05-20', 30)], 2026, 5)
    expect(result[19].active).toBe(true) // 20일 = index 19
  })

  test('운동 안 한 날 active=false', () => {
    const result = getMonthlyHeatmap([s('2026-05-20', 30)], 2026, 5)
    expect(result[0].active).toBe(false)
  })

  test('같은 날 세션 여러 개여도 active=true 1개', () => {
    const sessions = [s('2026-05-20', 30), s('2026-05-20', 20)]
    const result = getMonthlyHeatmap(sessions, 2026, 5)
    const may20 = result.filter(d => d.date === '2026-05-20')
    expect(may20).toHaveLength(1)
    expect(may20[0].active).toBe(true)
  })

  test('월 첫날/마지막날 포함', () => {
    const sessions = [s('2026-05-01', 30), s('2026-05-31', 30)]
    const result = getMonthlyHeatmap(sessions, 2026, 5)
    expect(result[0].active).toBe(true)
    expect(result[30].active).toBe(true)
  })
})

describe('getTrendData', () => {
  test('세션 없으면 빈 배열', () => {
    expect(getTrendData([])).toEqual([])
  })

  test('weeksBack만큼 항목 반환', () => {
    const result = getTrendData([s('2026-05-20', 30)], 4)
    expect(result).toHaveLength(4)
  })

  test('각 항목에 weekStart, totalMinutes 포함', () => {
    const result = getTrendData([s('2026-05-20', 30)], 2)
    expect(result[0]).toHaveProperty('weekStart')
    expect(result[0]).toHaveProperty('totalMinutes')
  })
})
