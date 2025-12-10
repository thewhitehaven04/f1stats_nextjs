from pydantic import BaseModel, ConfigDict


class SubscriptionsDto(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: int
    subscription: str