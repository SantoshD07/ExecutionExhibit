from pydantic import BaseModel
from typing_extensions import Union
from sqlmodel import create_engine, select, SQLModel, Field


class AgentHeartbeatView(SQLModel, table= True):
    __tablename__ = "agent_heartbeat_view"
    run_id: str = Field(primary_key=True)
    execution_id: Union[str, None] = None
    script: str
    iteration_id: str

class AgentHeartbeatViewResponse(BaseModel):
    execution_id: str
    iteration_id: str

    class Config:
        orm_mode = True  # indicates to SQL ALchemy that response to be converted to dict