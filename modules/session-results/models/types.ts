import type { fetchSessionResults } from './session-results'

export type TFetchSessionResultsReturn = ReturnType<typeof fetchSessionResults>
export type TFetchSessionResults = Awaited<TFetchSessionResultsReturn>["data"]