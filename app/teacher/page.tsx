"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Users, FileText, ArrowRight, Plus, School } from "lucide-react"
import Link from "next/link"

interface Quiz {
  id: string
  title: string
  description: string
  createdAt: string
  publicId: string
}

export default function TeacherDashboardPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`)
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes")
        }
        const data = await response.json()
        setQuizzes(data)
      } catch (err) {
        setError("Failed to load quizzes. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load quizzes. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()

    // Set up listener for quiz submissions
    const handleQuizSubmission = (event: any) => {
      const { studentName } = event.detail

      toast({
        title: "Quiz Submitted",
        description: `${studentName} just submitted their quiz!`,
      })
    }

    window.addEventListener("quizSubmitted", handleQuizSubmission)

    return () => {
      window.removeEventListener("quizSubmitted", handleQuizSubmission)
    }
  }, [toast])

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date"

    try {
      // Handle PostgreSQL timestamp format
      // Convert "2025-04-30 10:03:32.465697+00" to ISO format
      // First, replace space with 'T' to make it ISO-like
      const isoString = dateString.replace(" ", "T")
      const date = new Date(isoString)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString)
        return "Invalid date"
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Date error"
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Teacher Dashboard</h1>
            <p className="text-gray-500 mt-1">Monitor student progress and quiz performance</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Link href="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : quizzes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
            </CardContent>
          </Card>
        </div>

        {/* New section: Big action cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/teacher/create-quiz" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
              <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Create Quiz</h3>
                <p className="text-center text-muted-foreground">
                  Create a new quiz for your students with multiple-choice questions
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/teacher/classrooms" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
              <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <School className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Manage Classrooms</h3>
                <p className="text-center text-muted-foreground">Create and manage classrooms, and enroll students</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Quiz Analytics</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No quizzes available</h2>
            <p className="text-gray-500">Create a quiz to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>Created on {formatDate(quiz.createdAt)}</CardDescription>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs font-medium text-muted-foreground">Public ID:</span>
                    <code className="ml-2 rounded bg-muted px-2 py-1 text-xs font-mono">{quiz.publicId || "N/A"}</code>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 mb-4">{quiz.description || "No description available"}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/teacher/quiz/${quiz.id}/results`}>
                    <Button variant="outline">View Results</Button>
                  </Link>
                  <Link href={`/teacher/quiz/${quiz.id}/stats`}>
                    <Button>
                      View Analytics
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
