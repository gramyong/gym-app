import { toDateString } from '../utils/dateUtils'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export function getMonthlySummary(sessions, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  const thisMonth = sessions.filter(s => s.date.startsWith(prefix))
  return {
    count: new Set(thisMonth.map(s => s.date)).size,
    totalMinutes: thisMonth.reduce((sum, s) => sum + s.durationMinutes, 0),
  }
}

// weekStart: Date object — 해당 주의 일요일 0시
export function getWeeklyStats(sessions, weekStart) {
  const result = DAY_LABELS.map((label, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    const dateStr = toDateString(d)
    const minutes = sessions
      .filter(s => s.date === dateStr)
      .reduce((sum, s) => sum + s.durationMinutes, 0)
    return { label, date: dateStr, minutes }
  })
  return result
}

// year, month: 1-based
export function getMonthlyHeatmap(sessions, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const activeDates = new Set(
    sessions
      .filter(s => {
        const [y, m] = s.date.split('-').map(Number)
        return y === year && m === month
      })
      .map(s => s.date)
  )

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return { date: dateStr, day, active: activeDates.has(dateStr) }
  })
}

// weeksBack: 몇 주치 반환 (현재 주 포함)
export function getTrendData(sessions, weeksBack = 8) {
  if (sessions.length === 0) return []

  const now = new Date()
  const currentSunday = getSunday(now)
  const weeks = []

  for (let i = weeksBack - 1; i >= 0; i--) {
    const sunday = new Date(currentSunday)
    sunday.setDate(sunday.getDate() - i * 7)
    const weekData = getWeeklyStats(sessions, sunday)
    const total = weekData.reduce((sum, d) => sum + d.minutes, 0)
    weeks.push({ weekStart: toDateString(sunday), totalMinutes: total })
  }

  return weeks
}

// 해당 날짜가 속한 주의 일요일 반환
export function getSunday(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay()) // getDay(): 0=일
  return d
}
