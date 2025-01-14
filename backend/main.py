from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from typing import List, Dict


import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, declarative_base

from data_models.data_views import AgentHeartbeatView, ExecutionResponse, DashboardResponse

app = FastAPI()
origins = [
    "http://localhost:3001",
    "http://localhost:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "postgresql://postgres:storage@localhost:5432/postgres"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@app.get("/get_active_workers", response_model=DashboardResponse)
async def get_active_workers():
    db = SessionLocal()
    query = select(AgentHeartbeatView)
    output = db.execute(query).scalars().all()

    execution_groups: Dict[str, List[dict]] = defaultdict(list)
    worker_counts: Dict[str, int] = defaultdict(int)
    executions = []

    for worker in output:
        worker_dict = {
            "agent_id": worker.agent_id,
            "iteration_id": worker.data_id,
            "execution_id": worker.execution_id,
            "script": worker.script_id,
            "last_updated": worker.date_timestamp,
            "vncPort": int(worker.agent_id.split('_')[1]) + 20
        }
        execution_groups[worker.execution_id].append(worker_dict)
        worker_counts[worker.execution_id] += 1

    for exec_id, worker_details in execution_groups.items():
        last_updated = None
        for worker in worker_details:
            last_updated = \
            [worker['last_updated'] if not last_updated or worker['last_updated'] > last_updated else last_updated][0]

        executions.append(ExecutionResponse(
            id=exec_id,
            activeWorkers=worker_counts[exec_id],
            workerDetails=worker_details,
            last_updated=f"{int((last_updated - datetime.now()).total_seconds() // 60)} minutes ago"
        ))

    return DashboardResponse(
        executions=executions,
        totalActiveExecutions=len(executions)
    )


if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1", port=8000)
