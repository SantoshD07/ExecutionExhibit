from typing_extensions import Union
from sqlmodel import SQLModel, Field

class AgentHeartbeatView(SQLModel, table= True):
    __tablename__ = "agent_heartbeat_view"
    agent_id: str = Field(primary_key=True)
    execution_id: Union[str, None] = None
    script_id: str
    data_id: str
    date_timestamp: str
