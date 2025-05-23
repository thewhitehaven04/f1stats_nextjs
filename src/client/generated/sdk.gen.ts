// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from "@hey-api/client-fetch"
import type {
    GetSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPostData,
    GetSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPostResponse,
    GetSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPostError,
    GetAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePostData,
    GetAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePostResponse,
    GetAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePostError,
    GetLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPostData,
    GetLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPostResponse,
    GetLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPostError,
} from "./types.gen"
import { client as _heyApiClient } from "./client.gen"

export type Options<
    TData extends TDataShape = TDataShape,
    ThrowOnError extends boolean = boolean,
> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>
}

/**
 * Get Session Laptimes Filtered
 * Retrieve filtered lap times for a specific Formula 1 session.
 *
 * Args:
 * year (str): The year of the Formula 1 season.
 * event (str): The specific event or round number.
 * session (SessionIdentifier): The type of session (e.g., Practice 1, Sprint Qualifying, Race).
 * body (SessionQueryFilter): Filtering criteria for lap time selection.
 *
 * Returns:
 * Filtered lap times for the specified session.
 */
export const getSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPost = <
    ThrowOnError extends boolean = false,
>(
    options: Options<
        GetSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPostData,
        ThrowOnError
    >,
) => {
    return (options.client ?? _heyApiClient).post<
        GetSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPostResponse,
        GetSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPostError,
        ThrowOnError
    >({
        url: "/api/py/season/{year}/event/{event}/session/{session}/laps",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    })
}

/**
 * Get Averaged Telemetry
 * Retrieve averaged telemetry data for a specific Formula 1 session.
 *
 * Args:
 * year (str): The year of the Formula 1 season.
 * event (str): The specific event or round number.
 * session (SessionIdentifier): The type of session (e.g., Practice 1, Sprint Qualifying, Race).
 * body (SessionQueryFilter): Filtering criteria for averaged telemetry data selection.
 * connection (Connection): Database connection for querying telemetry data.
 *
 * Returns:
 * Averaged telemetry measurements for the specified session based on the provided filter.
 */
export const getAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePost = <
    ThrowOnError extends boolean = false,
>(
    options: Options<
        GetAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePostData,
        ThrowOnError
    >,
) => {
    return (options.client ?? _heyApiClient).post<
        GetAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePostResponse,
        GetAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePostError,
        ThrowOnError
    >({
        url: "/api/py/season/{year}/event/{event}/session/{session}/telemetry/average",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    })
}

/**
 * Get Lap Telemetries
 * Retrieve telemetry data for a specific Formula 1 session.
 *
 * Args:
 * year (str): The year of the Formula 1 season.
 * event (str): The specific event or round number.
 * session (SessionIdentifier): The type of session (e.g., Practice 1, Sprint Qualifying, Race).
 * body (SessionQueryFilter): Filtering criteria for telemetry data selection.
 * connection (Connection): Database connection for querying telemetry data.
 *
 * Returns:
 * Telemetry measurements for the specified session based on the provided filter.
 */
export const getLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPost = <
    ThrowOnError extends boolean = false,
>(
    options: Options<
        GetLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPostData,
        ThrowOnError
    >,
) => {
    return (options.client ?? _heyApiClient).post<
        GetLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPostResponse,
        GetLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPostError,
        ThrowOnError
    >({
        url: "/api/py/season/{year}/event/{event}/session/{session}/telemetries",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    })
}
