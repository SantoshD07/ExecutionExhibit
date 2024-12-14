from __future__ import annotations

import uvicorn
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Annotated, Union

from sqlalchemy import create_engine, text, select
from sqlalchemy.orm import sessionmaker, declarative_base

from data_models.agent_heartbeat_view import AgentHeartbeatView, AgentHeartbeatViewResponse

app = FastAPI()
origins = [
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
Base = declarative_base()


@app.get("/get_active_workers", response_model=List[AgentHeartbeatViewResponse])
async def get_active_workers():
    db = SessionLocal()
    query = select(AgentHeartbeatView)
    result = db.execute(query).scalars().all()
    print(result)
    return result



if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1", port=8000)
