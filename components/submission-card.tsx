import type { CSSProperties } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface SubmissionCardProps {
    studentName: string
    quizTitle: string
    timestamp: string
    color: string
    style?: CSSProperties
}

export function SubmissionCard({ studentName, quizTitle, timestamp, color, style }: SubmissionCardProps) {
    // Format the timestamp
    const formattedTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true })

    return (
        <Card
            className="w-72 shadow-lg animate__animated animate__bounceIn"
            style={{
                ...style,
                borderTop: `4px solid ${color}`,
                backgroundColor: `${color}10`, // Very light version of the color
            }}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{studentName}</h3>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-2">{quizTitle}</p>
                <p className="text-xs text-muted-foreground">{formattedTime}</p>
            </CardContent>
        </Card>
    )
}
