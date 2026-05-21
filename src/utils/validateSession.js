export function validateSession(form) {
  const errors = {}
  if (!form.exerciseName || !String(form.exerciseName).trim()) {
    errors.exerciseName = '운동 이름을 입력하세요'
  }
  if (!form.durationMinutes || Number(form.durationMinutes) <= 0) {
    errors.durationMinutes = '소요 시간을 입력하세요'
  }
  return errors
}
