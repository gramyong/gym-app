import { useState } from 'react'
import { DataStore } from '../store/DataStore'
import EditSessionModal from '../components/EditSessionModal'

function sortedSessions(sessions) {
  return [...sessions].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date)
    return b.createdAt.localeCompare(a.createdAt)
  })
}

function SessionItem({ session, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 truncate">{session.exerciseName}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {session.durationMinutes}분 · {session.date}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(session)}
            className="text-sm text-blue-600 font-medium px-2 py-1"
          >
            편집
          </button>
          <button
            onClick={() => onDelete(session.id)}
            className="text-sm text-red-500 font-medium px-2 py-1"
          >
            삭제
          </button>
        </div>
      </div>

      {session.note && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-gray-400 font-medium"
          >
            메모 {expanded ? '접기 ▲' : '펼치기 ▼'}
          </button>
          {expanded && (
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{session.note}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function HistoryTab() {
  const [sessions, setSessions] = useState(() => sortedSessions(DataStore.getSessions()))
  const [editTarget, setEditTarget] = useState(null)

  function refresh() {
    setSessions(sortedSessions(DataStore.getSessions()))
  }

  function handleDelete(id) {
    DataStore.deleteSession(id)
    refresh()
  }

  function handleSave(updates) {
    DataStore.updateSession(editTarget.id, updates)
    refresh()
    setEditTarget(null)
  }

  return (
    <div className="p-4 pb-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-5">히스토리</h1>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🏃</p>
          <p className="text-sm">아직 기록된 운동이 없어요</p>
          <p className="text-sm">기록 탭에서 첫 운동을 추가해보세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map(s => (
            <SessionItem
              key={s.id}
              session={s}
              onEdit={setEditTarget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editTarget && (
        <EditSessionModal
          session={editTarget}
          onSave={handleSave}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  )
}
