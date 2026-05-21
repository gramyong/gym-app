export function toDateString(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function todayString() {
  return toDateString(new Date())
}

export function formatPhotoTime(isoString) {
  const d = new Date(isoString)
  const mo = d.getMonth() + 1
  const dd = d.getDate()
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `📷 ${mo}월 ${dd}일 ${hh}:${mi}`
}
