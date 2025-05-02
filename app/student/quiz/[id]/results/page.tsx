"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Home } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"

export default function QuizResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const total = Number.parseInt(searchParams.get("total") || "1")
  const percentage = Math.round((score / total) * 100)

  useEffect(() => {
    // Trigger confetti if score is good
    if (percentage >= 70) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)
    }
  }, [percentage])

  const getFeedbackMessage = () => {
    if (percentage >= 90) return "Excellent! You're a master of this subject!"
    if (percentage >= 70) return "Great job! You've done very well!"
    if (percentage >= 50) return "Good effort! Keep studying to improve."
    return "Keep practicing! You'll get better with more study."
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full">
        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                {score} / {total}
              </div>
              <div className="text-xl text-gray-500">{percentage}%</div>
            </div>

            <Progress value={percentage} className="h-3" />

            <div className="flex justify-center">
              {percentage >= 70 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span>Passed</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="mr-2 h-5 w-5" />
                  <span>Needs improvement</span>
                </div>
              )}
            </div>

            <div className="text-center text-gray-700">{getFeedbackMessage()}</div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/student/quizzes" className="flex-1">
                <Button className="w-full">Try Another Quiz</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
