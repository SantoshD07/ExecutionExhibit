// File: pages/index.tsx (Main Dashboard Page)
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import ExecutionCard from "@/components/execution-card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Types matching backend response
interface Worker {
  iteration_id: string
  execution_id: string
  script: string
}

interface Execution {
  id: string
  activeWorkers: number
  workerDetails: Worker[]
  status: string
  lastUpdated: string
}

interface ApiResponse {
  executions: Execution[]
  totalActiveExecutions: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [searchId, setSearchId] = useState('')
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://127.0.0.1:8000/get_active_workers', {
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'include',
        })
        if (!response.ok) {
          throw new Error('Failed to fetch workers')
        }
        const responseData: ApiResponse = await response.json()
        setData(responseData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
    const interval = setInterval(fetchWorkers, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (searchId.trim() && data) {
      const execution = data.executions.find(e => e.id === searchId.trim())
      if (execution) {
        router.push({
          pathname: `/execution/${searchId.trim()}`,
          query: { execution: JSON.stringify(execution) }
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight text-white">Execution Exhibit</h1>
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Search executions..."
                className="pl-8 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </form>
          </div>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Active Executions</h2>
              <div className="text-sm text-slate-400">
                {data?.totalActiveExecutions || 0} executions running
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data?.executions.map((execution) => (
                <ExecutionCard
                  key={execution.id}
                  execution={execution}
                  onViewDetails={() => {
                    router.push({
                      pathname: `/execution/${execution.id}`,
                      query: { execution: JSON.stringify(execution) }
                    })
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}