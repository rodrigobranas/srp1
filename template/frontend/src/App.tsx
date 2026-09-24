import { useEffect, useState } from 'react'

type ApiStatus = 'checking' | 'online' | 'offline'

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/health')
        if (response.ok) {
          setApiStatus('online')
        } else {
          setApiStatus('offline')
        }
      } catch {
        setApiStatus('offline')
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-red-500'
      case 'checking':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative">
      <h1 className="text-6xl font-bold text-foreground">
        template
      </h1>

      <div className="absolute bottom-8 flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full backdrop-blur-sm">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
        <span className="text-sm text-muted-foreground font-medium">API Status</span>
      </div>
    </div>
  )
}

export default App
