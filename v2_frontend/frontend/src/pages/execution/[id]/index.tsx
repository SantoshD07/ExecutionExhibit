// File: pages/execution/[id].tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ArrowLeft, Terminal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import WorkerGrid from '@/components/worker-grid'

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

export default function ExecutionDetailPage() {
  const router = useRouter()
  const { execution: executionJson } = router.query
  const [execution, setExecution] = useState<Execution | null>(null)

  useEffect(() => {
    if (executionJson) {
      setExecution(JSON.parse(executionJson as string))
    }
  }, [executionJson])

  const handleBackToDashboard = () => {
    router.push('/')
  }

  // Wait for router to be ready and execution data to be available
  if (router.isReady && !execution) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="border-slate-700 bg-slate-800 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-center">Invalid URL</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-300 mb-6">
              No execution data provided.
            </p>
            <Button onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!execution) return null

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400"
              onClick={handleBackToDashboard}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-white">
              Execution {execution.id}
            </h1>
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-glow mt-1" />
          </div>
        </div>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Execution Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-700">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400">Agent ID</TableHead>
                    <TableHead className="text-slate-400">Execution ID</TableHead>
                    <TableHead className="text-slate-400">Script</TableHead>
                    <TableHead className="text-slate-400">Iteration ID</TableHead>
                    <TableHead className="text-slate-400">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {execution.workerDetails.map((worker, index) => (
                    <TableRow key={`${worker.execution_id}-${worker.iteration_id}-${index}`} className="border-slate-700">
                      <TableCell className="text-slate-300 font-mono">{worker.agent_id}</TableCell>
                      <TableCell className="text-slate-300">{worker.execution_id}</TableCell>
                      <TableCell className="text-slate-300">{worker.script}</TableCell>
                      <TableCell className="text-slate-300">{worker.iteration_id}</TableCell>
                      <TableCell className="text-slate-300">{worker.last_updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-sm text-slate-400">Total Workers</div>
                <div className="text-2xl font-semibold text-white mt-1">
                  {execution.activeWorkers}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-sm text-slate-400">Status</div>
                <div className="text-2xl font-semibold text-white mt-1">
                  {execution.status}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-sm text-slate-400">Last Updated</div>
                <div className="text-2xl font-semibold text-white mt-1">
                  {execution.last_updated}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Worker Consoles
            </h2>
            <div className="text-sm text-slate-400">
              {execution.activeWorkers} workers active
            </div>
          </div>

          <WorkerGrid workers={execution.workerDetails} />
        </div>
      </div>
    </div>
  )
}