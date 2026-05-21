import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { DataStore } from '../store/DataStore'
import { getWeeklyStats, getSunday } from '../stats/StatsEngine'

function getMonthlySummary(sessions) {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `${yyyy}-${mm}`
  const thisMonth = sessions.filter(s => s.date.startsWith(prefix))
  return {
    count: thisMonth.length,
    totalMinutes: thisMonth.reduce((sum, s) => sum + s.durationMinutes, 0),
  }
}

export default function StatsTab() {
  const sessions = useMemo(() => DataStore.getSessions(), [])
  const weekData = useMemo(() => getWeeklyStats(sessions, getSunday(new Date())), [sessions])
  const summary = useMemo(() => getMonthlySummary(sessions), [sessions])

  const maxMinutes = Math.max(...weekData.map(d => d.minutes), 1)

  return (
    <div className="p-4 pb-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-5">통계</h1>

      {/* 월간 요약 카드 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-blue-50 rounded-2xl p-4">
          <p className="text-sm text-blue-600 font-medium">이번 달 세션</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{summary.count}</p>
          <p className="text-xs text-blue-500 mt-0.5">회</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4">
          <p className="text-sm text-green-600 font-medium">이번 달 운동</p>
          <p className="text-3xl font-bold text-green-700 mt-1">{summary.totalMinutes}</p>
          <p className="text-xs text-green-500 mt-0.5">분</p>
        </div>
      </div>

      {/* 주간 막대 차트 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-4">이번 주 (일~토)</p>
        {weekData.every(d => d.minutes === 0) ? (
          <p className="text-center text-gray-400 text-sm py-8">이번 주 운동 기록이 없어요</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [`${v}분`, '소요 시간']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                {weekData.map((entry, i) => (
                  <Cell key={i} fill={entry.minutes > 0 ? '#3b82f6' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
