import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginScreen from './screens/LoginScreen'
import RecordTab from './tabs/RecordTab'
import StatsTab from './tabs/StatsTab'
import HistoryTab from './tabs/HistoryTab'
import DashboardTab from './tabs/DashboardTab'

const TABS = [
  { id: 'record', label: '기록', icon: '✏️' },
  { id: 'stats', label: '통계', icon: '📊' },
  { id: 'history', label: '히스토리', icon: '📋' },
  { id: 'dashboard', label: '랭킹', icon: '🏆' },
]

function AppContent() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('record')

  if (!user) return <LoginScreen />

  return (
    <div className="flex flex-col h-dvh max-w-md mx-auto bg-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p className="text-base font-semibold text-gray-700">👋 {user.username}</p>
        <button
          onClick={logout}
          className="text-sm text-gray-400 active:text-gray-600"
        >로그아웃</button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'record' && <RecordTab />}
        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'dashboard' && <DashboardTab />}
      </main>

      <nav className="flex border-t border-gray-200 bg-white safe-area-pb">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 font-medium'
                : 'text-gray-500'
            }`}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
