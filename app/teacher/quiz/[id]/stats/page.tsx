"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, AlertTriangle } from "lucide-react"
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="font-medium mb-2 md:mb-0">{question.text}</div>
                          <div className="flex items-center">
                            <div className="text-green-500 mr-4">Correct: {question.correctPercentage}%</div>
                            <div className="text-red-500">Incorrect: {question.incorrectPercentage}%</div>
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
                  <CardContent>
                    <div className="h-80">
                      <ChartContainer
                        config={{
                          student: { theme: { light: "#3b82f6", dark: "#60a5fa" } },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={stats.studentStats.map((student) => ({
                              name: student.name,
                              score: student.percentage,
                              student: "student",
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                            <YAxis
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
                            <Bar dataKey="score" fill="var(--color-student)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions">
                <div className="flex flex-col gap-6">
                  {/* Question legends - Redesigned */}
                  <div className="bg-white p-5 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Question Legend</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stats.questionStats.map((question, index) => (
                        <div
                          key={question.id}
                          className="flex items-start p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                          style={{
                            backgroundColor: `${COLORS[index % COLORS.length]}15`, // Very light version of the color
                            borderLeft: `4px solid ${COLORS[index % COLORS.length]}`,
                          }}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm mr-3 flex-shrink-0">
                            <span className="font-medium text-sm" style={{ color: COLORS[index % COLORS.length] }}>
                              Q{index + 1}
                            </span>
                          </div>
                          <div className="text-sm">
                            {question.text.length > 100 ? `${question.text.substring(0, 100)}...` : question.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Question Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.questionStats.map((q, index) => ({
                                name: `Q${index + 1}`,
                                value: q.correctPercentage,
                                fullText: q.text,
                              }))}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                            >
                              {stats.questionStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name, props) => [`${value}% Correct`, props.payload.fullText]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Correct vs Incorrect</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ChartContainer
                          config={{
                            correct: { theme: { light: "#22c55e", dark: "#4ade80" } },
                            incorrect: { theme: { light: "#ef4444", dark: "#f87171" } },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={stats.questionStats.map((q, index) => ({
                                name: `Q${index + 1}`,
                                correct: q.correct,
                                incorrect: q.incorrect,
                                fullText: q.text,
                              }))}
                              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                              <YAxis />
                              <ChartTooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <ChartTooltipContent>
                                        <div className="font-medium">{payload[0].payload.fullText}</div>
                                        <div>Correct: {payload[0].value}</div>
                                        <div>Incorrect: {payload[1].value}</div>
                                      </ChartTooltipContent>
                                    )
                                  }
                                  return null
                                }}
                              />
                              <Bar dataKey="correct" fill="var(--color-correct)" stackId="a" />
                              <Bar dataKey="incorrect" fill="var(--color-incorrect)" stackId="a" />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
