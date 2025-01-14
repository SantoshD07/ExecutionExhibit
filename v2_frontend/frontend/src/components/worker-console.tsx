import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Terminal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WorkerConsoleProps {
  worker: {
    iteration_id: string
    execution_id: string
    script: string
    vncPort?: number
  }
  index: number
}

export default function WorkerConsole({ worker, index }: WorkerConsoleProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [hasError, setHasError] = useState(false)

  const vncPort = worker.vncPort
  const hasVnc = Boolean(worker.vncPort)
  const vncUrl = `http://localhost:${vncPort}/vnc.html?autoconnect=true`
  const wsUrl = `ws://localhost:${vncPort}`

  useEffect(() => {
    if (!hasVnc) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    if (iframeRef.current) {
      observer.observe(iframeRef.current)
    }

    return () => observer.disconnect()
  }, [hasVnc])

  const openInNewTab = () => {
    window.open(vncUrl, '_blank')
  }

  const checkVncConnection = () => {
    if (!wsUrl) return

    let timeoutId: NodeJS.Timeout
    const ws = new WebSocket(wsUrl)

    const cleanup = () => {
      clearTimeout(timeoutId)
      ws.close()
    }

    timeoutId = setTimeout(() => {
      setHasError(true)
      cleanup()
    }, 2000)

    ws.onopen = () => {
      cleanup()
    }

    ws.onerror = () => {
      setHasError(true)
      cleanup()
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'vnc_failed' || event.data === 'vnc_disconnected') {
        setHasError(true)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    if (shouldLoad && hasVnc) {
      checkVncConnection()
    }
  }, [shouldLoad, hasVnc, wsUrl])

  return (
    <Card className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-3">
        <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
          <Terminal className="h-4 w-4 text-slate-300" />
          {worker.execution_id}-{index + 1}
          {hasVnc && <span className="text-xs text-slate-400">Port: {vncPort}</span>}
        </CardTitle>
        {hasVnc && !hasError && (
          <Button
            variant="secondary"
            size="sm"
            className="h-7 px-2 text-xs text-slate-200 hover:text-white bg-slate-700/50 hover:bg-slate-700 font-medium"
            onClick={openInNewTab}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in New Tab
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs p-2 bg-slate-900/50 rounded-lg">
          <div className="text-slate-400 font-medium">Iteration ID</div>
          <div className="text-slate-100 font-mono font-medium">{worker.iteration_id}</div>
          <div className="text-slate-400 font-medium">Script</div>
          <div className="text-slate-100">{worker.script}</div>
          <div className="text-slate-400 font-medium">Status</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-glow" />
            <span className="text-slate-100">Running</span>
          </div>
        </div>

        {!hasError ? (
            <div className="relative bg-slate-950 rounded-lg overflow-hidden h-[180px] border border-slate-700/50">
              <iframe
                ref={iframeRef}
                src={shouldLoad ? vncUrl : ''}
                className="absolute inset-0 w-full h-full"
                title={`VNC for ${worker.execution_id}-${index + 1}`}
                loading="lazy"
                allowFullScreen
                onError={() => setHasError(true)}
              />
              {!shouldLoad && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs">
                  Loading VNC viewer...
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[180px] bg-slate-900/50 rounded-lg border border-slate-700/50 text-slate-500 text-xs">
              No VNC connection
            </div>
          )}
      </CardContent>
    </Card>
  )
}