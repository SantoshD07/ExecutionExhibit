import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List


class TEST_value(BaseModel):
    name: str


class TEST(BaseModel):
    basket: List[TEST_value]


app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"],
                   allow_headers=["*"])

memory_db = {'basket': []}

@app.get("/test", response_model=TEST)
def get_test():
    print(memory_db["basket"])

@app.post("/test", response_model=TEST_value)
def add_test(var: TEST_value):
    memory_db["basket"].append(var)
    print(memory_db)
    return var

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)

