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

  const closeToast = useCallback(() => setToast(null), [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
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

        {/* 운동 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">운동 이름 *</label>
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
