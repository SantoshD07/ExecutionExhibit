'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import WorkerConsole from './worker-console'

interface WorkerGridProps {
  workers: Array<{
    workerId: string
    iterationId: number
    status: string
    startedAt: string
    vncPort: number
  }>
  itemsPerPage?: number
}

export default function WorkerGrid({ workers, itemsPerPage = 9 }: WorkerGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedWorker, setExpandedWorker] = useState<string | null>(null)

  const totalPages = Math.ceil(workers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleWorkers = workers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {visibleWorkers.map((worker) => (
          <WorkerConsole
            key={worker.workerId}
            worker={worker}
            isExpanded={expandedWorker === worker.workerId}
            onExpand={() => setExpandedWorker(
              worker.workerId === expandedWorker ? null : worker.workerId
            )}
          />
        ))}
      </div>

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
            className="border-slate-700 text-slate-400"
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
            className="border-slate-700 text-slate-400"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}