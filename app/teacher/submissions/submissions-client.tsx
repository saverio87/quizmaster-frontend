"use client"

import { useState, useEffect, useRef } from "react"
import { usePusher } from "@/hooks/use-pusher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Wifi, WifiOff } from "lucide-react"
import Link from "next/link"
import { SubmissionCard } from "@/components/submission-card"
import { generateColorFromString } from "@/lib/color-utils"


// Add animate.css
import "animate.css"

interface SubmissionEvent {
    type: string
    data: {
        id: string
        quizId: string
        quizTitle: string
        studentId: string
        studentName: string
        timestamp: string
    }
    timestamp: string
}

export default function SubmissionsClient() {
    const { isConnected, events, error } = usePusher("quiz-events", "student-submitted")
    const [visibleSubmissions, setVisibleSubmissions] = useState<SubmissionEvent[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    // Process incoming events and manage visible submissions
    useEffect(() => {
        if (events.length > 0) {
            // Add new events to visible submissions
            setVisibleSubmissions((prev) => [...events, ...prev])
        }
    }, [events])

    // Remove submissions after 2 minutes
    useEffect(() => {
        const timeouts: NodeJS.Timeout[] = []

        visibleSubmissions.forEach((submission, index) => {
            const timeout = setTimeout(() => {
                setVisibleSubmissions((prev) => prev.filter((_, i) => i !== index))
            }, 120000) // 2 minutes

            timeouts.push(timeout)
        })

        return () => {
            timeouts.forEach((timeout) => clearTimeout(timeout))
        }
    }, [visibleSubmissions])

    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <Link href="/teacher">
                        <Button variant="ghost" size="sm" className="mr-2 gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-xl font-semibold">Real-time Quiz Submissions</h1>
                    </div>
                    <Badge variant={isConnected ? "default" : "destructive"} className="ml-2 flex items-center gap-1">
                        {isConnected ? (
                            <>
                                <Wifi className="h-3 w-3" /> Connected
                            </>
                        ) : (
                            <>
                                <WifiOff className="h-3 w-3" /> Disconnected
                            </>
                        )}
                    </Badge>
                </div>
            </header>

            <main className="flex-1 container py-6">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Connection Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!isConnected && !error && (
                    <Alert className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Connecting...</AlertTitle>
                        <AlertDescription>Establishing connection to receive real-time submissions.</AlertDescription>
                    </Alert>
                )}

                <div
                    ref={containerRef}
                    className="relative w-full min-h-[calc(100vh-200px)] border rounded-lg p-4 bg-slate-50 dark:bg-slate-900"
                >
                    {visibleSubmissions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
                            <div className="mb-4 rounded-full bg-primary/10 p-3">
                                <Wifi className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">Waiting for submissions</h3>
                            <p>Student quiz submissions will appear here in real-time</p>
                        </div>
                    ) : (
                        visibleSubmissions.map((submission, index) => {
                            const { quizId, quizTitle, studentName, timestamp } = submission.data
                            const color = generateColorFromString(quizId)

                            // Calculate position - grid-like but with some randomness
                            const containerWidth = containerRef.current?.clientWidth || 1000
                            const containerHeight = containerRef.current?.clientHeight || 800

                            // Ensure cards don't go too close to edges
                            const maxLeft = containerWidth - 320 // card width + margin
                            const maxTop = containerHeight - 200 // card height + margin

                            // Create a grid-like layout with some randomness
                            const columns = Math.floor(containerWidth / 350)
                            const rows = Math.floor(containerHeight / 220)

                            const column = index % columns
                            const row = Math.floor(index / columns) % rows

                            // Add some randomness to the position
                            const randomX = Math.floor(Math.random() * 40) - 20
                            const randomY = Math.floor(Math.random() * 40) - 20

                            const left = Math.min(Math.max(20, column * (containerWidth / columns) + randomX), maxLeft)
                            const top = Math.min(Math.max(20, row * (containerHeight / rows) + randomY), maxTop)

                            return (
                                <SubmissionCard
                                    key={`${submission.data.id}-${index}`}
                                    studentName={studentName}
                                    quizTitle={quizTitle}
                                    timestamp={timestamp}
                                    color={color}
                                    style={{
                                        position: "absolute",
                                        left: `${left}px`,
                                        top: `${top}px`,
                                        zIndex: visibleSubmissions.length - index,
                                    }}
                                />
                            )
                        })
                    )}
                </div>
            </main>
        </div>
    )
}
