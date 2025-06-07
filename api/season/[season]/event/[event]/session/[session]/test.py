from fastapi import FastAPI


app = FastAPI()


@app.get("/season/{year}/event/{event}/session/{session}/test")
async def get_test(
    year: str,
    event: str,
    session: str,
):
    return {
        "year": year,
        "event": event,
        "session": session,
    }
