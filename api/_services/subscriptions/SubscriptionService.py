from sqlalchemy import Engine
from sqlalchemy.orm import Session
from api._repository.engine import postgres
from api._repository.repository import Subscriptions
from api._services.subscriptions.models.subscriptions import SubscriptionsDto


class SubscriptionService:
    def __init__(self, engine: Engine):
        self.engine = engine

    def get_subscription_by_id(self, subscription_id: str):
        with Session(self.engine) as s:
            sub = (
                s.query(Subscriptions).filter(Subscriptions.id == subscription_id).one()
            )
            return SubscriptionsDto(id=sub.id, subscription=sub.subscription)
