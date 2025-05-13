"use client"

import { usePusher } from "@/hooks/use-pusher"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function QuizActivityFeed() {
    const { isConnected, events, error } = usePusher("quiz-events", "student-submitted")

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
                <span className="text-sm text-muted-foreground">
                    {isConnected ? "Receiving real-time updates" : "Not receiving updates"}
                </span>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <h2 className="text-xl font-semibold">Recent Quiz Submissions</h2>

            {events.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No submissions yet</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {events.map((event, index) => {
                        const { studentName, quizTitle, score, totalQuestions, percentage, timestamp } = event.data
                        return (
                            <Card key={index}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-base">{studentName}</CardTitle>
                                        <Badge variant="outline">{new Date(timestamp).toLocaleTimeString()}</Badge>
                                    </div>
                                    <CardDescription>{quizTitle}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>
                                            Score: {score}/{totalQuestions} ({percentage}%)
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
