"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, XCircle, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface QuizResult {
  submissionId: string
  student: {
    id: string
    name: string
  }
  score: number
  totalQuestions: number
  percentage: number
  submittedAt: string
  answers: {
    questionId: string
    questionText: string
    selectedAnswer: string
    isCorrect: boolean
  }[]
}

export default function QuizResultsPage({ params }: { params: { id: string } }) {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${params.id}/results`)
        if (!response.ok) {
          throw new Error("Failed to fetch quiz results")
        }
        const data = await response.json()
        setResults(data)
      } catch (err) {
        setError("Failed to load quiz results. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load quiz results. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [params.id, toast])

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Unknown date"

      // Convert PostgreSQL timestamp format to ISO format
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
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Date error"
    }
  }

  const toggleCard = (submissionId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [submissionId]: !prev[submissionId],
    }))
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
        <div className="flex items-center mb-8">
          <Link href="/teacher">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Quiz Results</h1>
            <p className="text-gray-500 mt-1">Detailed student submissions</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No submissions yet</h2>
            <p className="text-gray-500 mb-6">Students haven't taken this quiz yet</p>
            <Link href="/teacher">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result) => (
              <Collapsible
                key={result.submissionId}
                open={expandedCards[result.submissionId]}
                onOpenChange={() => toggleCard(result.submissionId)}
                className="border rounded-lg shadow-sm bg-white transition-all duration-200 hover:shadow-md"
              >
                <CollapsibleTrigger className="w-full text-left">
                  <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${result.percentage >= 70 ? "bg-green-100" : "bg-red-100"
                            }`}
                        >
                          {result.percentage >= 70 ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{result.student.name}</h3>
                        <p className="text-sm text-gray-500">{formatDate(result.submittedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-4 md:mt-0">
                      <Badge className={`mr-4 ${result.percentage >= 70 ? "bg-green-500" : "bg-red-500"}`}>
                        {result.score} / {result.totalQuestions} ({result.percentage}%)
                      </Badge>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${expandedCards[result.submissionId] ? "transform rotate-180" : ""
                          }`}
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-6 pt-2 border-t">
                    <Tabs defaultValue="answers">
                      <TabsList className="mb-4">
                        <TabsTrigger value="answers">Answers</TabsTrigger>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                      </TabsList>

                      <TabsContent value="answers" className="space-y-4">
                        {result.answers.map((answer, index) => (
                          <div key={answer.questionId} className="p-4 rounded-lg border bg-gray-50">
                            <div className="flex items-start">
                              <div className="mr-3 mt-1">
                                {answer.isCorrect ? (
                                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium mb-1">
                                  Q{index + 1}: {answer.questionText}
                                </div>
                                <div className="text-sm flex items-center">
                                  <span className="font-medium mr-2">Answer:</span>
                                  <span className={answer.isCorrect ? "text-green-600" : "text-red-600"}>
                                    {answer.selectedAnswer}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="summary">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg border bg-green-50">
                              <div className="text-sm text-gray-600">Correct Answers</div>
                              <div className="text-2xl font-bold text-green-600 mt-1">
                                {result.answers.filter((a) => a.isCorrect).length}
                              </div>
                            </div>
                            <div className="p-4 rounded-lg border bg-red-50">
                              <div className="text-sm text-gray-600">Incorrect Answers</div>
                              <div className="text-2xl font-bold text-red-600 mt-1">
                                {result.answers.filter((a) => !a.isCorrect).length}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg border bg-gray-50">
                            <div className="text-sm text-gray-600 mb-2">Performance</div>
                            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${result.percentage >= 70 ? "bg-green-500" : "bg-red-500"} transition-all duration-500 ease-in-out`}
                                style={{ width: `${result.percentage}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm font-medium">Score</span>
                              <span className="text-sm font-bold">{result.percentage}%</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
