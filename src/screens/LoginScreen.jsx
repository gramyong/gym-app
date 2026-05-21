import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !password) { setError('아이디와 비밀번호를 입력하세요'); return }
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        login(username, password)
      } else {
        if (password.length < 4) { setError('비밀번호는 4자 이상이어야 합니다'); return }
        register(username, password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-gray-50 p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-4xl mb-2">🏋️</p>
          <h1 className="text-2xl font-bold text-gray-800">GymLog</h1>
          <p className="text-sm text-gray-500 mt-1">운동 기록 앱</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'login' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
            >로그인</button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'register' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
            >회원가입</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text" placeholder="아이디" value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              autoCapitalize="none"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password" placeholder="비밀번호" value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl text-base active:bg-blue-700 mt-1 disabled:opacity-60"
            >
              {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
