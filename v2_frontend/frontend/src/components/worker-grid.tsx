import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import WorkerConsole from './worker-console'

interface Worker {
  workerId: string
  iterationId: number
  status: string
  vncPort: number
}

interface WorkerGridProps {
  workers: Worker[]
  itemsPerPage?: number
}

export default function WorkerGrid({ workers, itemsPerPage = 9 }: WorkerGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedWorker, setExpandedWorker] = useState<string | null>(null)

  const totalPages = Math.ceil(workers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleWorkers = workers.slice(startIndex, startIndex + itemsPerPage)

  const transformWorkerData = (worker: Worker, index: number) => ({
    execution_id: worker.execution_id,
    iteration_id: worker.iteration_id.toString(),
    script: worker.script,
    vncPort: worker.vncPort,
    status: worker.status
  })

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {visibleWorkers.map((worker, index) => (
          <WorkerConsole
            key={worker.workerId}
            worker={transformWorkerData(worker, index)}
            index={startIndex + index}
            isExpanded={expandedWorker === worker.workerId}
            onExpand={() => setExpandedWorker(
              worker.workerId === expandedWorker ? null : worker.workerId
            )}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-700 pt-4">
          <div className="text-sm text-slate-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, workers.length)} of {workers.length} workers
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-slate-400">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}