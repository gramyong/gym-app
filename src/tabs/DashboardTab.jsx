import { useMemo } from 'react'
import { AuthStore } from '../store/AuthStore'
import { DataStore } from '../store/DataStore'
import { useAuth } from '../context/AuthContext'

function medal(rank) {
  if (rank === 0) return '🥇'
  if (rank === 1) return '🥈'
  if (rank === 2) return '🥉'
  return `${rank + 1}위`
}

export default function DashboardTab() {
  const { user } = useAuth()

  const ranking = useMemo(() => {
    const users = AuthStore.getAllUsers()
    return users
      .map(u => {
        const sessions = DataStore.getSessions(u.id)
        const activeDays = new Set(sessions.map(s => s.date)).size
        const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
        return { ...u, activeDays, totalMinutes }
      })
      .sort((a, b) => b.activeDays - a.activeDays || b.totalMinutes - a.totalMinutes)
  }, [])

  return (
    <div className="p-4 pb-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">전체 랭킹</h1>
      <p className="text-sm text-gray-400 mb-5">하루 여러 번 운동해도 1일 1카운트</p>

      {ranking.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-sm">아직 등록된 유저가 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ranking.map((u, i) => (
            <div
              key={u.id}
              className={`flex items-center gap-3 rounded-2xl p-4 border ${
                u.id === user.id
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <span className="text-2xl w-8 text-center flex-shrink-0">{medal(i)}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${u.id === user.id ? 'text-blue-700' : 'text-gray-800'}`}>
                  {u.username} {u.id === user.id && <span className="text-xs font-normal">(나)</span>}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">총 {Math.round(u.totalMinutes / 60 * 10) / 10}시간</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-gray-800">{u.activeDays}</p>
                <p className="text-xs text-gray-400">운동일</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
