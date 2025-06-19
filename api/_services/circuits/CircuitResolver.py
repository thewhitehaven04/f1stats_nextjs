from functools import cache
from itertools import pairwise
from sqlalchemy import Connection, select
from sqlalchemy.orm import sessionmaker

from api._repository.repository import Circuits, Events
from geopy.distance import geodesic, Point


class CircuitResolver:

    def __init__(self, db_connection: Connection, event: str, season: str):
        self.session = sessionmaker(db_connection)
        self.event = event
        self.season = season

    @staticmethod
    def _distance_to_finish(coordinates) -> float:
        total_distance = 0
        for p1, p2 in pairwise(map(lambda x: (x[1], x[0]), coordinates)):
            total_distance += geodesic(p1, p2).meters
        return total_distance

    @cache
    def get_circuit_record(self):
        with self.session() as session:
            circuit = session.execute(
                select(Circuits)
                .join(Events, Events.circuit_id == Circuits.id)
                .where(
                    Events.event_name == self.event,
                    Events.season_year == self.season,
                )
            ).fetchone()
            if circuit:
                return circuit
            raise ValueError("No circuit found")

    def get_circuit_geometry(self):
        return self.get_circuit_record()[0].geojson["features"][0]

    def _get_circuit_geometry_points(self) -> list[Point]:
        return list(
            map(
                Point,
                self.get_circuit_record()[0].geojson["features"][0]["geometry"][
                    "coordinates"
                ],
            )
        )

    def resample_circuit_geometry(
        self, lattice: list[float]
    ) -> tuple[list[Point], list[float]]:
        """
        Resamples the circuit geometry with the given lattice and the joint points.

        Args:
            lattice: A sequence of floats representing the relative distance along the circuit.

        Returns:
            A sequence of Points, each representing a point on the circuit.
        """
        points = self._get_circuit_geometry_points()
        max_distance = self.calculate_geodesic_distance()

        lattice_copy = lattice.copy()

        def unshift():
            return lattice_copy.pop(0)

        def peek():
            return lattice_copy[0]

        resampled_points: list[Point] = []

        next_split_abs_dist = 0
        for start, end in pairwise(points):
            next_split_abs_dist += geodesic(
                (start.longitude, start.latitude), (end.longitude, end.latitude)
            ).meters

            while peek() * max_distance < next_split_abs_dist:
                abs_dist = unshift() * max_distance
                coef = abs_dist / next_split_abs_dist
                resampled_points.append(
                    Point(
                        start[0] + (end[0] - start[0]) * coef,
                        start[1] + (end[1] - start[1]) * coef,
                    )
                )

            resampled_points.append(end)
            lattice.append(next_split_abs_dist / max_distance)

        resampled_points.append(points[-1])
        lattice.sort()
        return resampled_points, lattice

    def calculate_geodesic_distance(self):
        circuit_tuple = self.get_circuit_record()
        coordinates = circuit_tuple[0].geojson["features"][0]["geometry"]["coordinates"]
        return self._distance_to_finish(coordinates)
