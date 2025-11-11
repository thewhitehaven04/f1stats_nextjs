import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/uiComponents/card"
import { ChartColumnDecreasing, ChartLine, ChartSpline, TrendingDown, TrendingUp } from "lucide-react"

interface IAggregateAverageDisplayCardProps {
    groupName: string
    averageTime: React.ReactNode
    slope: React.ReactNode
    slowestLap: React.ReactNode
    bestLap: React.ReactNode
    averageS1: React.ReactNode
    averageS2: React.ReactNode
    averageS3: React.ReactNode
}

export const AggregateAverageDisplayCard = ({
    groupName,
    averageTime,
    slope,
    slowestLap,
    bestLap,
    averageS1,
    averageS2,
    averageS3,
}: IAggregateAverageDisplayCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{groupName}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <div className="flex flex-row w-full justify-between">
                    <span className="font-medium flex flex-row gap-2">
                        <ChartLine />
                        Average:
                    </span>
                    {averageTime}
                </div>
                <div className="flex flex-row w-full justify-between">
                    <span className="font-medium flex flex-row gap-2">
                        <ChartColumnDecreasing />
                        Slope:
                    </span>
                    {slope}
                </div>
                <div className="flex flex-row w-full justify-between">
                    <span className="font-medium flex flex-row gap-2">
                        <TrendingDown />
                        Slowest lap:
                    </span>
                    {slowestLap}
                </div>
                <div className="flex flex-row w-full justify-between">
                    <span className="font-medium flex flex-row gap-2">
                        <TrendingUp />
                        Best lap:
                    </span>
                    {bestLap}
                </div>
                <div className="flex flex-row w-full justify-between">
                    <span className="font-medium flex flex-row gap-2">
                        <ChartSpline  />
                        Average S1:
                    </span>
                    {averageS1}
                </div>
                <div className="flex flex-row w-full justify-between">
                    <span className="font-medium flex flex-row gap-2">
                        <ChartSpline  />
                        Average S2:
                    </span>
                    {averageS2}
                </div>
                <div className="flex flex-row w-full justify-between">
                    <span className="font-medium flex flex-row gap-2">
                        <ChartSpline  />
                        Average S3:
                    </span>
                    {averageS3}
                </div>
            </CardContent>
        </Card>
    )
}
