import { useState } from 'react'

export default function EditSessionModal({ session, onSave, onClose }) {
  const [form, setForm] = useState({
    date: session.date,
    exerciseName: session.exerciseName,
    durationMinutes: String(session.durationMinutes),
    note: session.note || '',
  })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const next = {}
    if (!form.exerciseName.trim()) next.exerciseName = '운동 이름을 입력하세요'
    if (!form.durationMinutes || Number(form.durationMinutes) <= 0) next.durationMinutes = '소요 시간을 입력하세요'
    if (Object.keys(next).length) { setErrors(next); return }

    onSave({
      date: form.date,
      exerciseName: form.exerciseName.trim(),
      durationMinutes: Number(form.durationMinutes),
      note: form.note.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-2xl p-5 pb-8 max-h-[90dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">세션 편집</h2>
          <button type="button" onClick={onClose} className="text-gray-400 text-2xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
            <input
              type="date" name="date" value={form.date} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">운동 이름 *</label>
            <input
              type="text" name="exerciseName" value={form.exerciseName} onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.exerciseName ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.exerciseName && <p className="text-red-500 text-sm mt-1">{errors.exerciseName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">소요 시간 (분) *</label>
            <input
              type="number" name="durationMinutes" value={form.durationMinutes} onChange={handleChange}
              min="1" inputMode="numeric"
              className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.durationMinutes ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.durationMinutes && <p className="text-red-500 text-sm mt-1">{errors.durationMinutes}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">메모 (선택)</label>
            <textarea
              name="note" value={form.note} onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl text-base active:bg-blue-700">
            저장
          </button>
        </form>
      </div>
    </div>
  )
}
