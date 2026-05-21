import { useState, useCallback } from 'react'
import { DataStore } from '../store/DataStore'
import Toast from '../components/Toast'

function todayString() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const EMPTY_FORM = { date: todayString(), exerciseName: '', durationMinutes: '', note: '' }

export default function RecordTab() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [favorites, setFavorites] = useState(() => DataStore.getFavorites())

  const closeToast = useCallback(() => setToast(null), [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function selectFavorite(name) {
    setForm(prev => ({ ...prev, exerciseName: name }))
    setErrors(prev => ({ ...prev, exerciseName: '' }))
  }

  function addFavorite() {
    const name = form.exerciseName.trim()
    if (!name) return
    DataStore.addFavorite(name)
    setFavorites(DataStore.getFavorites())
  }

  function removeFavorite(name) {
    DataStore.removeFavorite(name)
    setFavorites(DataStore.getFavorites())
  }

  function validate() {
    const next = {}
    if (!form.exerciseName.trim()) next.exerciseName = '운동 이름을 입력하세요'
    if (!form.durationMinutes || Number(form.durationMinutes) <= 0) next.durationMinutes = '소요 시간을 입력하세요'
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }

    try {
      DataStore.addSession({
        date: form.date,
        exerciseName: form.exerciseName.trim(),
        durationMinutes: Number(form.durationMinutes),
        note: form.note.trim(),
      })
      setForm({ ...EMPTY_FORM, date: form.date })
      setErrors({})
      setToast({ message: '운동이 기록되었습니다 💪', type: 'success' })
    } catch {
      setToast({ message: '저장 실패: 저장 공간이 부족합니다', type: 'error' })
    }
  }

  const currentName = form.exerciseName.trim()
  const canAddFavorite = currentName && !favorites.includes(currentName)

  return (
    <div className="p-4 pb-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <h1 className="text-xl font-semibold text-gray-800 mb-5">운동 기록</h1>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* 날짜 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 운동 이름 + 즐겨찾기 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">운동 이름 *</label>
            {canAddFavorite && (
              <button
                type="button"
                onClick={addFavorite}
                className="text-xs text-blue-600 font-medium"
              >
                + 즐겨찾기 추가
              </button>
            )}
          </div>

          {/* 즐겨찾기 칩 */}
          {favorites.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
              {favorites.map(fav => (
                <div
                  key={fav}
                  className="flex items-center gap-1 flex-shrink-0 bg-blue-50 border border-blue-200 rounded-full pl-3 pr-2 py-1"
                >
                  <button
                    type="button"
                    onClick={() => selectFavorite(fav)}
                    className="text-sm text-blue-700 font-medium whitespace-nowrap"
                  >
                    {fav}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFavorite(fav)}
                    className="text-blue-400 hover:text-red-500 text-xs leading-none ml-0.5"
                    aria-label={`${fav} 즐겨찾기 제거`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            name="exerciseName"
            value={form.exerciseName}
            onChange={handleChange}
            placeholder="예) 달리기"
            className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.exerciseName ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.exerciseName && <p className="text-red-500 text-sm mt-1">{errors.exerciseName}</p>}
        </div>

        {/* 소요 시간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">소요 시간 (분) *</label>
          <input
            type="number"
            name="durationMinutes"
            value={form.durationMinutes}
            onChange={handleChange}
            placeholder="예) 30"
            min="1"
            inputMode="numeric"
            className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.durationMinutes ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.durationMinutes && <p className="text-red-500 text-sm mt-1">{errors.durationMinutes}</p>}
        </div>

        {/* 메모 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">메모 (선택)</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="오늘의 느낌, 특이사항 등"
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl text-base active:bg-blue-700 mt-1"
        >
          기록 저장
        </button>
      </form>
    </div>
  )
}
