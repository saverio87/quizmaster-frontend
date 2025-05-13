"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, AlertTriangle, Calendar } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface QuizStats {
  quiz: {
    id: string
    title: string
    description: string
  }
  studentStats: {
    id: string
    name: string
    correct: number
    total: number
    percentage: number
    submitted_at?: string
  }[]
  questionStats: {
    id: string
    text: string
    correct: number
    incorrect: number
    total: number
    correctPercentage: number
    incorrectPercentage: number
  }[]
  hardestQuestions: {
    id: string
    text: string
    correct: number
    incorrect: number
    total: number
    correctPercentage: number
    incorrectPercentage: number
  }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]
const PERFORMANCE_COLOR = "#FF6B6B" // New vibrant color for the performance chart
const CORRECT_COLOR = "#22c55e" // Green for correct answers
const INCORRECT_COLOR = "#ef4444" // Red for incorrect answers

export default function QuizStatsPage({ params }: { params: { id: string } }) {
  const [stats, setStats] = useState<QuizStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${params.id}/stats`)
        if (!response.ok) {
          throw new Error("Failed to fetch quiz statistics")
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError("Failed to load quiz statistics. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load quiz statistics. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [params.id, toast])

  // Format date for student submission times
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date"

    try {
      // Handle PostgreSQL timestamp format
      const isoString = dateString.replace(" ", "T")
      const date = new Date(isoString)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString)
        return "Invalid date"
      }

      return date.toLocaleString("en-US", {
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
            <h1 className="text-3xl md:text-4xl font-bold">Quiz Analytics</h1>
            {stats && <p className="text-gray-500 mt-1">{stats.quiz.title}</p>}
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-lg" />
              <Skeleton className="h-80 rounded-lg" />
            </div>
          </div>
        ) : !stats ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No data available</h2>
            <p className="text-gray-500 mb-6">There are no submissions for this quiz yet</p>
            <Link href="/teacher">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* New section: Student Submissions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-indigo-600">
                  <Calendar className="mr-2 h-5 w-5" />
                  Student Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Student</th>
                        <th className="text-left py-3 px-4 font-medium">Score</th>
                        <th className="text-left py-3 px-4 font-medium">Percentage</th>
                        <th className="text-left py-3 px-4 font-medium">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.studentStats.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{student.name}</td>
                          <td className="py-3 px-4">
                            {student.correct} / {student.total}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${student.percentage >= 70
                                  ? "bg-green-100 text-green-800"
                                  : student.percentage >= 50
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                            >
                              {student.percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {student.submitted_at ? formatDate(student.submitted_at) : "Unknown"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {stats.hardestQuestions.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-amber-600">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Challenging Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.hardestQuestions.map((question, index) => (
                      <div key={question.id} className="p-4 rounded-lg border">
                        <div className="flex flex-col space-y-3">
                          <div className="font-medium">{question.text}</div>

                          {/* New stacked bar chart inside each question card */}
                          <div className="h-8 w-full bg-gray-100 rounded-md overflow-hidden">
                            <div className="flex h-full">
                              <div
                                className="h-full bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                                style={{ width: `${question.correctPercentage}%` }}
                              >
                                {question.correctPercentage > 15 ? `${question.correctPercentage}%` : ""}
                              </div>
                              <div
                                className="h-full bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                                style={{ width: `${question.incorrectPercentage}%` }}
                              >
                                {question.incorrectPercentage > 15 ? `${question.incorrectPercentage}%` : ""}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                              <span>
                                Correct: {question.correct}/{question.total}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
                              <span>
                                Incorrect: {question.incorrect}/{question.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="students">
              <TabsList className="mb-4">
                <TabsTrigger value="students">Student Performance</TabsTrigger>
                <TabsTrigger value="questions">Question Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 md:p-4">
                    <div className="h-80">
                      <ChartContainer
                        config={{
                          student: { theme: { light: PERFORMANCE_COLOR, dark: PERFORMANCE_COLOR } },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          {/* Changed back to vertical bars (default layout) */}
                          <BarChart
                            barGap={0}
                            barCategoryGap={2} // Small gap between categories
                            data={stats.studentStats.map((student) => ({
                              name: student.name,
                              score: student.percentage,
                              student: "student",
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={60}
                              interval={0} // Show all labels
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis
                              domain={[0, 100]}
                              label={{
                                value: "Score (%)",
                                angle: -90,
                                position: "insideLeft",
                                style: { textAnchor: "middle" },
                              }}
                            />
                            <ChartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <ChartTooltipContent>
                                      <div className="font-medium">{payload[0].payload.name}</div>
                                      <div>Score: {payload[0].value}%</div>
                                    </ChartTooltipContent>
                                  )
                                }
                                return null
                              }}
                            />
                            <Bar
                              dataKey="score"
                              fill="var(--color-student)"
                              barSize={15} // Thinner bars
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions">
                <Card>
                  <CardHeader>
                    <CardTitle>Correct vs Incorrect by Question</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Grid of individual pie charts for each question */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stats.questionStats.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <h3 className="text-sm font-medium mb-3 text-center">
                            Q{index + 1}:{" "}
                            {question.text.length > 60 ? `${question.text.substring(0, 60)}...` : question.text}
                          </h3>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: "Correct", value: question.correct },
                                    { name: "Incorrect", value: question.incorrect },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={30}
                                  outerRadius={60}
                                  paddingAngle={5}
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  labelLine={false}
                                >
                                  <Cell fill={CORRECT_COLOR} />
                                  <Cell fill={INCORRECT_COLOR} />
                                </Pie>
                                <Tooltip
                                  formatter={(value, name) => [`${value} students`, name]}
                                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex justify-center mt-2 text-xs space-x-4">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                              <span>Correct: {question.correct}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                              <span>Incorrect: {question.incorrect}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
