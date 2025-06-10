from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_methods=["GET", "POST"],
    allow_origins=["*"],
    allow_credentials=True,
)

@app.get("/api/season/{year}/event/{event}/session/{session}/healthcheck")
def get(): 
    return 'Success!'