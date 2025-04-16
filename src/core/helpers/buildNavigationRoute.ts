import type { SessionIdentifier } from "@/client/generated"

export const buildNavigationRoute = (
    identifier: SessionIdentifier | number,
    year: number | string,
    round: number,
    isTesting: boolean,
) =>
    isTesting
        ? `/year/${year}/testingRound/${round}/day/${identifier}`
        : `/year/${year}/round/${round}/session/${identifier}`
