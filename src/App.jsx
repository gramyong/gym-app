import { useState } from 'react'
import RecordTab from './tabs/RecordTab'
import StatsTab from './tabs/StatsTab'
import HistoryTab from './tabs/HistoryTab'

const TABS = [
  { id: 'record', label: '기록', icon: '✏️' },
  { id: 'stats', label: '통계', icon: '📊' },
  { id: 'history', label: '히스토리', icon: '📋' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('record')

  return (
    <div className="flex flex-col h-dvh max-w-md mx-auto bg-white">
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'record' && <RecordTab />}
        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'history' && <HistoryTab />}
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
