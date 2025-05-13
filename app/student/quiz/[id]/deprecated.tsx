"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { sampleQuiz } from "./sample"
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
import { AlertCircle } from "lucide-react"
import { submitQuiz, getQuizByPublicId } from "@/components/quiz-api"




export default function QuizPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [quiz, setQuiz] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [showAlreadySubmittedDialog, setShowAlreadySubmittedDialog] = useState(false)
    const [usingSampleData, setUsingSampleData] = useState(false)
    const [validationError, setValidationError] = useState<string | null>(null)

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
                setError(`Error fetching quiz: ${err.message || "Unknown error"}`);
            } finally {
                setLoading(false);

            }
        }

        fetchQuiz()

    }, [params.id])

    const handleAnswerChange = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }))
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
            console.log(quiz, quiz.id)
            const submissionData = {
                quizId: quiz.quiz.id,
                studentId: studentData.id,
                answers: formattedAnswers,
            }
            console.log("Submitting quiz with data:", submissionData)

            // Call submitQuiz with the correct arguments
            const result = await submitQuiz(
                submissionData.quizId,
                submissionData.studentId,
                submissionData.answers
            )
            console.log("Quiz submission result:", result)

            // Calculate score for the event
            const score = quiz.questions.filter((q: any) => answers[q.id] === q.correctOptionId).length

            // Dispatch custom event for backward compatibility
            if (typeof window !== "undefined") {
                const event = new CustomEvent("quizSubmitted", {
                    detail: {
                        quizId: quiz.id,
                        quizTitle: quiz.title,
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

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            {usingSampleData && (
                <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Using Sample Data</AlertTitle>
                    <AlertDescription>
                        The API is not available, so sample quiz data is being used for demonstration purposes.
                    </AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {validationError && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Validation Error</AlertTitle>
                    <AlertDescription>{validationError}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {quiz.questions.map((question: any, index: number) => {
                        console.log(question.options)
                        return (
                            <div key={question.id} className="space-y-3">
                                <h3 className="font-medium">
                                    Question {index + 1}: {question.text}
                                </h3>
                                <RadioGroup
                                    value={answers[question.id] || ""}
                                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                                >
                                    {
                                        question.options.map((option: string, optionIndex: string) => {
                                            return (
                                                <div key={optionIndex} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                                                    <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>

                                                </div>
                                            )

                                        }
                                        )}
                                </RadioGroup>
                            </div>
                        )
                    }

                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                        {submitting ? "Submitting..." : "Submit Quiz"}
                    </Button>
                </CardFooter>
            </Card>

            <AlertDialog open={showAlreadySubmittedDialog} onOpenChange={setShowAlreadySubmittedDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Quiz Already Submitted</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have already submitted this quiz. You cannot submit it again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => router.push("/student/quizzes")}>Return to Quizzes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}


