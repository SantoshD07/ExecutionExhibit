from typing_extensions import Union
from sqlmodel import SQLModel, Field
from pydantic import BaseModel
from typing import List, Dict

class AgentHeartbeatView(SQLModel, table= True):
    __tablename__ = "agent_heartbeat_view"
    agent_id: str = Field(primary_key=True)
    execution_id: Union[str, None] = None
    script_id: str
    data_id: str
    date_timestamp: str


class ExecutionResponse(BaseModel):
    id: str
    activeWorkers: int
    workerDetails: List[dict]
    status: str = "running"
    last_updated: str


class DashboardResponse(BaseModel):
    executions: List[ExecutionResponse]
    totalActiveExecutions: int