from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from api._repository.engine import get_connection
from api._services.subscriptions.SubscriptionService import SubscriptionService
from api._repository.engine import postgres


@asynccontextmanager
async def lifespan(app):
    yield
    get_connection().close()
    print("DB connection closed")


app = FastAPI(lifespan=lifespan)


@app.get("/api/subscriptions/{id}")
async def get_subscription(id: str):
    subscription = SubscriptionService(engine=postgres).get_subscription_by_id(id)
    if subscription:
        return subscription
    else:
        raise HTTPException(status_code=404, detail="Subscription not found")
