import { useRouter } from 'next/router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Terminal } from 'lucide-react'

interface Worker {
  iteration_id: string
  run_id: string
  execution_id: string
  script: string
}

interface Execution {
  id: string
  activeWorkers: number
  status: string
  lastUpdated: string
  workerDetails: Worker[]
}

interface ExecutionCardProps {
  execution: {
    id: string
    activeWorkers: number
    workerDetails: Worker[]
    status: string
    lastUpdated: string
  }
  onViewDetails: () => void
}

export default function ExecutionCard({ execution }: ExecutionCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push({
      pathname: `/execution/${execution.id}`,
      query: {
        execution: JSON.stringify(execution)
      }
    })
  }

  const uniqueIterations = new Set(execution.workerDetails.map(w => w.iteration_id)).size

  return (
    <Card
      className="border-slate-700 bg-slate-800 hover:bg-slate-800/70 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-slate-400" />
            {execution.id}
          </div>
          <span
            className="flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-glow"
            title="Running"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>Active Workers</span>
            <span className="font-medium">{execution.activeWorkers}</span>
          </div>

          <div className="flex justify-between">
            <span>Last Updated</span>
            <span className="text-slate-400">{execution.last_updated}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Activity className="h-3 w-3" />
              Active
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}