"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle } from "lucide-react"
import { submitQuiz, getQuizByPublicId } from "@/components/quiz-api"

import { sampleQuiz } from "./sample"



export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showAlreadySubmittedDialog, setShowAlreadySubmittedDialog] = useState(false)
  const [usingSampleData, setUsingSampleData] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Get student data from localStorage
  const getStudentData = () => {
    if (typeof window !== "undefined") {
      const studentData = localStorage.getItem("selectedStudent")
      console.log("Retrieved student data:", studentData)
      return studentData ? JSON.parse(studentData) : null
    }
    return null
  }

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log(params.id)
        console.log(`Fetching quiz with public ID: ${params.id}`)
        const data = await getQuizByPublicId(params.id)
        console.log("Quiz data received:", data)

        // parsing data
        const formattedQuestions = data.questions.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
        }))

        data.questions = formattedQuestions

        setQuiz(data)
        setUsingSampleData(false)
      } catch (err: any) {
        console.error("Error fetching quiz:", err)

        // Use sample data if API is not available
        console.log("Using sample quiz data for testing")
        setQuiz(sampleQuiz)
        setUsingSampleData(true)

        // Still set error for debugging purposes
        setError(`Error fetching quiz: ${err.message || "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [params.id])

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))

    // Auto-navigate to next question after a short delay
    if (currentQuestionIndex < quiz?.questions?.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 500)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz?.questions?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmit = async () => {
    // Validate that all questions have been answered
    const unansweredQuestions = quiz.questions.filter((q: any) => !answers[q.id])
    if (unansweredQuestions.length > 0) {
      setValidationError(
        `Please answer all questions before submitting. You have ${unansweredQuestions.length} unanswered questions.`,
      )
      return
    }

    setValidationError(null)
    setSubmitting(true)

    // Get student data
    const studentData = getStudentData()
    console.log("Student data for submission:", studentData)

    // Validate student data
    if (!studentData || !studentData.id) {
      setError("Student information is missing. Please select a classroom and student before taking a quiz.")
      setSubmitting(false)
      return
    }

    try {
      // Format the answers array as expected by the submitQuiz function
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }))
      console.log(quiz, quiz.quiz.id)
      const submissionData = {
        quizId: quiz.quiz.id,
        studentId: studentData.id,
        answers: formattedAnswers,
      }
      console.log("Submitting quiz with data:", submissionData)

      // Call submitQuiz with the correct arguments
      const result = await submitQuiz(submissionData.quizId, submissionData.studentId, submissionData.answers)
      console.log("Quiz submission result:", result)

      // Calculate score for the event
      const score = quiz.questions.filter((q: any) => answers[q.id] === q.correctOptionId).length

      // Dispatch custom event for backward compatibility
      if (typeof window !== "undefined") {
        const event = new CustomEvent("quizSubmitted", {
          detail: {
            quizId: quiz.quiz.id,
            quizTitle: quiz.quiz.title,
            studentId: studentData.id,
            studentName: studentData.name,
            score,
            totalQuestions: quiz.questions.length,
            percentage: Math.round((score / quiz.questions.length) * 100),
          },
        })
        window.dispatchEvent(event)
        console.log("Dispatched quizSubmitted event:", event)
      }

      // Navigate to results page
      router.push(
        `/student/quiz/${params.id}/results?score=${result.submission.score}&total=${result.submission.totalQuestions}`,
      )
    } catch (err: any) {
      console.error("Error submitting quiz:", err)

      // Check if this is an "already submitted" error
      if (err.message && err.message.includes("already submitted")) {
        setShowAlreadySubmittedDialog(true)
      } else {
        setError(`Failed to submit quiz: ${err.message || "Unknown error"}`)
      }
    } finally {
      setSubmitting(false)
      setShowConfirmDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Failed to load quiz. Please try again later."}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const allQuestionsAnswered = quiz.questions.length > 0 && quiz.questions.every((q: any) => answers[q.id])
  const currentQuestion = quiz.questions[currentQuestionIndex]
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : ""

  return (
    <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        {usingSampleData && (
          <Alert className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Using Sample Data</AlertTitle>
            <AlertDescription>
              The API is not available, so sample quiz data is being used for demonstration purposes.
            </AlertDescription>
          </Alert>
        )}

        {validationError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Validation Error</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6 flex flex-col items-center space-y-2">
          <h1 className="text-center text-3xl font-bold">{quiz.quiz.title}</h1>
          <p className="text-center text-muted-foreground">{quiz.quiz.description}</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
          <div className="text-sm font-medium">
            {Object.values(answers).filter(Boolean).length} of {quiz.questions.length} answered
          </div>
        </div>

        <Progress
          value={((currentQuestionIndex + 1) / quiz.questions.length) * 100}
          className="mb-8 h-2"
          aria-label="Quiz progress"
        />

        {currentQuestion && (
          <div className="mb-8 space-y-8">
            <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold md:text-2xl">{currentQuestion.question_text}</h2>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all hover:border-primary/70 hover:bg-primary/5 ${currentAnswer === option ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card"
                    }`}
                  onClick={() => handleAnswerChange(currentQuestion.id, option)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${currentAnswer === option
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 bg-background"
                        }`}
                    >
                      {currentAnswer === option ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span>{String.fromCharCode(65 + index)}</span>
                      )}
                    </div>
                    <span className="text-base md:text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button onClick={handleNextQuestion} disabled={!currentAnswer} className="flex items-center gap-1">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowConfirmDialog(true)}
              disabled={!allQuestionsAnswered}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Quiz
            </Button>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            {quiz.questions.map((_: any, index: number) => (
              <button
                key={index}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${index === currentQuestionIndex
                  ? "bg-primary text-primary-foreground"
                  : answers[quiz.questions[index].id]
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                  }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Quiz"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showAlreadySubmittedDialog} onOpenChange={setShowAlreadySubmittedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quiz Already Submitted</AlertDialogTitle>
            <AlertDialogDescription>
              You have already submitted this quiz. You cannot submit it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/student/quizzes")}>Back to Quizzes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
