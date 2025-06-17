from sqlalchemy import Connection, select
from sqlalchemy.orm import sessionmaker

from api._repository.repository import Circuits, Events


class CircuitResolver:

    def __init__(self, db_connection: Connection, event: str, number: str):
        self.session = sessionmaker(db_connection)
        self.event = event
        self.season = number

    def get_circuit_geometry(self):
        with self.session() as session:
            circuit_tuple = session.execute(
                select(Circuits)
                .join(Events, Events.circuit_id == Circuits.id)
                .where(
                    Events.event_name == self.event,
                    Events.season_year == self.season,
                )
            ).fetchone()
            if circuit_tuple:
                return circuit_tuple[0].geojson['features'][0]
            raise ValueError(
                f"No circuit geometry data found for the event: {self.event}, {self.season}"
            )
