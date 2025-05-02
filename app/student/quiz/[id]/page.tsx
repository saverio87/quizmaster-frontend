// "use client"

// import { use, useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { useToast } from "@/hooks/use-toast"
// import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
// import { Skeleton } from "@/components/ui/skeleton"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { getQuizQuestions, submitQuiz } from "@/components/quiz-api"

// interface Question {
//   id: string
//   question_text: string
//   options: string[]
// }

// interface Student {
//   id: string
//   name: string
// }

// interface Quiz {
//   id: string
//   title: string
// }

// interface Answer {
//   questionId: string
//   selectedAnswer: string
// }

// // Sample questions for testing when API fails
// const sampleQuestions: Question[] = [
//   {
//     id: "q1",
//     question_text: "What is the capital of France?",
//     options: ["Paris", "London", "Berlin", "Madrid"],
//   },
//   {
//     id: "q2",
//     question_text: "Which planet is known as the Red Planet?",
//     options: ["Mars", "Venus", "Jupiter", "Saturn"],
//   },
//   {
//     id: "q3",
//     question_text: "What is 2 + 2?",
//     options: ["3", "4", "5", "6"],
//   },
//   {
//     id: "q4",
//     question_text: "Who wrote 'Romeo and Juliet'?",
//     options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
//   },
// ]

// export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
//   const [questions, setQuestions] = useState<Question[]>([])
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
//   const [answers, setAnswers] = useState<Answer[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [student, setStudent] = useState<Student | null>(null)
//   const [quiz, setQuiz] = useState<Quiz | null>(null)
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const [usingSampleData, setUsingSampleData] = useState(false)
//   const [alreadySubmitted, setAlreadySubmitted] = useState(false)
//   const [showAlreadySubmittedDialog, setShowAlreadySubmittedDialog] = useState(false)

//   const { id } = use(params)
//   const router = useRouter()
//   const { toast } = useToast()

//   type RawQuestion = {
//     id: string;
//     question_text: string;
//     options: string; // This comes as a JSON string from the DB
//   };

//   useEffect(() => {
//     // Check if student is selected
//     const storedStudent = localStorage.getItem("selectedStudent")
//     const storedQuiz = localStorage.getItem("selectedQuiz")

//     if (!storedStudent) {
//       router.push("/student")
//       return
//     }

//     setStudent(JSON.parse(storedStudent))

//     if (storedQuiz) {
//       setQuiz(JSON.parse(storedQuiz))
//     }

//     const fetchQuestions = async () => {
//       try {
//         console.log(`Fetching questions from: ${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${id}/questions`)

//         const data = await getQuizQuestions(id)
//         console.log("Received data:", data)

//         // Transform the data to match our Question interface
//         const formattedQuestions = (data as RawQuestion[]).map((q: any) => ({
//           id: q.id,
//           question_text: q.question_text,
//           options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
//         }))

//         setQuestions(formattedQuestions)

//         // Initialize answers array with empty values
//         setAnswers(
//           formattedQuestions.map((q) => ({
//             questionId: q.id,
//             selectedAnswer: "",
//           })),
//         )
//       } catch (err) {
//         console.error("Error fetching questions:", err)

//         // Use sample data for testing
//         setUsingSampleData(true)
//         setQuestions(sampleQuestions)
//         setAnswers(
//           sampleQuestions.map((q) => ({
//             questionId: q.id,
//             selectedAnswer: "",
//           })),
//         )

//         setError("Failed to load quiz questions from the API. Using sample questions for testing.")
//         toast({
//           title: "API Error",
//           description:
//             "Using sample questions for testing. In a production environment, this would connect to your backend API.",
//           variant: "destructive",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchQuestions()
//   }, [id, router, toast])


//   const handleAnswerSelect = (answer: string) => {
//     const updatedAnswers = [...answers]

//     // Make sure we're storing the answer in the correct format
//     updatedAnswers[currentQuestionIndex] = {
//       questionId: questions[currentQuestionIndex].id,
//       selectedAnswer: answer,
//     }

//     console.log(`Selected answer for question ${currentQuestionIndex + 1}:`, {
//       questionId: questions[currentQuestionIndex].id,
//       selectedAnswer: answer,
//     })

//     setAnswers(updatedAnswers)

//     // Auto-navigate to next question after a short delay
//     if (currentQuestionIndex < questions.length - 1) {
//       setTimeout(() => {
//         setCurrentQuestionIndex(currentQuestionIndex + 1)
//       }, 500)
//     }
//   }

//   const handlePrevQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1)
//     }
//   }

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1)
//     }
//   }

//   const handleSubmitQuiz = async () => {
//     if (!student) return

//     setSubmitting(true)

//     try {
//       // Log submission attempt
//       console.log("Attempting to submit quiz:", {
//         quizId: id,
//         studentId: student.id,
//         answers: answers,
//       })

//       // If using sample data, simulate a successful submission
//       if (usingSampleData) {
//         console.log("Using sample data - simulating submission")
//         // Calculate a random score
//         const score = Math.floor(Math.random() * (questions.length + 1))

//         // Show success toast
//         toast({
//           title: "Quiz Submitted! (Demo)",
//           description: `You scored ${score} out of ${questions.length}`,
//         })

//         // Broadcast submission to other users
//         if (student) {
//           const event = new CustomEvent("quizSubmitted", {
//             detail: {
//               studentName: student.name,
//               score: score,
//               totalQuestions: questions.length,
//             },
//           })
//           window.dispatchEvent(event)
//         }

//         // Navigate to results page
//         router.push(`/student/quiz/${id}/results?score=${score}&total=${questions.length}`)
//         return
//       }

//       // Real API submission
//       console.log("Submitting to real API")
//       const result = await submitQuiz(id, student.id, answers)
//       console.log("Submission result:", result)

//       // Show success toast
//       toast({
//         title: "Quiz Submitted!",
//         description: `You scored ${result.submission.score} out of ${result.submission.totalQuestions}`,
//       })

//       // Broadcast submission to other users
//       if (student) {
//         // This would typically be done via WebSockets, but for this demo we'll use a custom event
//         const event = new CustomEvent("quizSubmitted", {
//           detail: {
//             studentName: student.name,
//             score: result.submission.score,
//             totalQuestions: result.submission.totalQuestions,
//           },
//         })
//         window.dispatchEvent(event)
//       }

//       // Navigate to results page
//       router.push(
//         `/student/quiz/${id}/results?score=${result.submission.score}&total=${result.submission.totalQuestions}`,
//       )
//     } catch (err) {
//       console.error("Error submitting quiz:", err)

//       // Check if the error is because the quiz was already submitted
//       if (err instanceof Error && err.message.includes("already taken")) {
//         setAlreadySubmitted(true)
//         setShowAlreadySubmittedDialog(true)
//         return
//       }

//       // For demo purposes, simulate a successful submission
//       if (usingSampleData) {
//         const score = Math.floor(Math.random() * (questions.length + 1))
//         router.push(`/student/quiz/${id}/results?score=${score}&total=${questions.length}`)
//         return
//       }

//       toast({
//         title: "Error",
//         description: "Failed to submit quiz. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setSubmitting(false)
//       setShowConfirmDialog(false)
//     }
//   }

//   const allQuestionsAnswered = answers.every((answer) => answer.selectedAnswer !== "")
//   const currentQuestion = questions[currentQuestionIndex]
//   const currentAnswer = answers[currentQuestionIndex]?.selectedAnswer || ""

//   if (alreadySubmitted) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center p-4">
//         <div className="max-w-md w-full text-center">
//           <h2 className="text-2xl font-bold mb-4 text-amber-600">Quiz Already Submitted</h2>
//           <p className="mb-6">You have already taken this quiz. You can only take it once.</p>
//           <Button onClick={() => router.push("/student/quizzes")}>Back to Quizzes</Button>
//         </div>
//       </div>
//     )
//   }

//   if (error && !usingSampleData) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center p-4">
//         <div className="max-w-md w-full text-center">
//           <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
//           <p className="mb-6">{error}</p>
//           <Button onClick={() => router.push("/student/quizzes")}>Back to Quizzes</Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
//       <div className="max-w-4xl w-full">
//         {usingSampleData && (
//           <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
//             <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
//             <p className="text-sm text-yellow-700">
//               Using sample questions for demonstration. In a production environment, this would connect to your backend
//               API.
//             </p>
//           </div>
//         )}

//         {loading ? (
//           <div className="space-y-8">
//             <div className="flex justify-between items-center">
//               <Skeleton className="h-8 w-48" />
//               <Skeleton className="h-8 w-24" />
//             </div>
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-32 w-full rounded-lg" />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {Array.from({ length: 4 }).map((_, index) => (
//                 <Skeleton key={index} className="h-16 rounded-lg" />
//               ))}
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-2xl font-bold">{quiz?.title || "Quiz"}</h1>
//               <div className="text-sm text-gray-500">
//                 Question {currentQuestionIndex + 1} of {questions.length}
//               </div>
//             </div>

//             <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2 mb-8" />

//             <Card className="mb-8">
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-medium mb-2">{currentQuestion?.question_text || "Loading question..."}</h2>
//               </CardContent>
//             </Card>

//             <div className="grid grid-cols-1 gap-4 mb-8">
//               {currentQuestion?.options.map((option, index) => (
//                 <Card
//                   key={index}
//                   className={`cursor-pointer transition-all ${currentAnswer === option ? "border-primary bg-primary/10" : "hover:border-gray-400"
//                     }`}
//                   onClick={() => handleAnswerSelect(option)}
//                 >
//                   <CardContent className="p-4 flex items-center">
//                     <div className="mr-3 flex-shrink-0">
//                       {currentAnswer === option ? (
//                         <CheckCircle className="h-5 w-5 text-primary" />
//                       ) : (
//                         <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
//                       )}
//                     </div>
//                     <div>{option}</div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             <div className="flex justify-between">
//               <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
//                 <ArrowLeft className="mr-2 h-4 w-4" /> Previous
//               </Button>

//               {currentQuestionIndex < questions.length - 1 ? (
//                 <Button onClick={handleNextQuestion} disabled={!currentAnswer}>
//                   Next <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//               ) : (
//                 <Button onClick={() => setShowConfirmDialog(true)} disabled={!allQuestionsAnswered}>
//                   Submit Quiz
//                 </Button>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleSubmitQuiz} disabled={submitting}>
//               {submitting ? "Submitting..." : "Submit Quiz"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <AlertDialog open={showAlreadySubmittedDialog} onOpenChange={setShowAlreadySubmittedDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Quiz Already Submitted</AlertDialogTitle>
//             <AlertDialogDescription>
//               You have already taken this quiz. You can only take it once.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={() => router.push("/student/quizzes")}>Back to Quizzes</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }


"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getQuizQuestions, submitQuiz } from "@/components/quiz-api"

interface Question {
  id: string
  question_text: string
  options: string[]
}

interface Student {
  id: string
  name: string
}

interface Quiz {
  id: string
  title: string
}

interface Answer {
  questionId: string
  selectedAnswer: string
}

// Sample questions for testing when API fails
const sampleQuestions: Question[] = [
  {
    id: "q1",
    question_text: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
  },
  {
    id: "q2",
    question_text: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
  },
  {
    id: "q3",
    question_text: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
  },
  {
    id: "q4",
    question_text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
  },
]

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [usingSampleData, setUsingSampleData] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [showAlreadySubmittedDialog, setShowAlreadySubmittedDialog] = useState(false)

  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()

  type RawQuestion = {
    id: string;
    question_text: string;
    options: string; // This comes as a JSON string from the DB
  };

  useEffect(() => {
    // Check if student is selected
    const storedStudent = localStorage.getItem("selectedStudent")
    const storedQuiz = localStorage.getItem("selectedQuiz")

    if (!storedStudent) {
      router.push("/student")
      return
    }

    setStudent(JSON.parse(storedStudent))

    if (storedQuiz) {
      setQuiz(JSON.parse(storedQuiz))
    }

    const fetchQuestions = async () => {
      try {
        console.log(`Fetching questions from: ${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${id}/questions`)

        const data = await getQuizQuestions(id)
        console.log("Received data:", data)

        // Transform the data to match our Question interface
        const formattedQuestions = (data as RawQuestion[]).map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
        }))

        setQuestions(formattedQuestions)

        // Initialize answers array with empty values
        setAnswers(
          formattedQuestions.map((q) => ({
            questionId: q.id,
            selectedAnswer: "",
          })),
        )
      } catch (err) {
        console.error("Error fetching questions:", err)

        // Use sample data for testing
        setUsingSampleData(true)
        setQuestions(sampleQuestions)
        setAnswers(
          sampleQuestions.map((q) => ({
            questionId: q.id,
            selectedAnswer: "",
          })),
        )

        setError("Failed to load quiz questions from the API. Using sample questions for testing.")
        toast({
          title: "API Error",
          description:
            "Using sample questions for testing. In a production environment, this would connect to your backend API.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [id, router, toast])

  const handleAnswerSelect = (answer: string) => {
    const updatedAnswers = [...answers]

    // Make sure we're storing the answer in the correct format
    updatedAnswers[currentQuestionIndex] = {
      questionId: questions[currentQuestionIndex].id,
      selectedAnswer: answer,
    }

    console.log(`Selected answer for question ${currentQuestionIndex + 1}:`, {
      questionId: questions[currentQuestionIndex].id,
      selectedAnswer: answer,
    })

    setAnswers(updatedAnswers)

    // Auto-navigate to next question after a short delay
    if (currentQuestionIndex < questions.length - 1) {
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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmitQuiz = async () => {
    // CHANGE: Added validation to check if student exists
    if (!student) {
      // CHANGE: Added specific error message for missing student
      toast({
        title: "Error",
        description: "No student selected. Please go back and select a student.",
        variant: "destructive",
      })
      return
    }

    // CHANGE: Added validation to check if student ID exists
    if (!student.id) {
      // CHANGE: Added specific error message for missing student ID
      toast({
        title: "Error",
        description: "Student ID is missing. Please go back and select a student again.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // CHANGE: Added more detailed logging including student object
      console.log("Attempting to submit quiz:", {
        quizId: id,
        studentId: student.id,
        studentObject: student, // CHANGE: Added full student object for debugging
        answers: answers,
      })

      // If using sample data, simulate a successful submission
      if (usingSampleData) {
        console.log("Using sample data - simulating submission")
        // Calculate a random score
        const score = Math.floor(Math.random() * (questions.length + 1))

        // Show success toast
        toast({
          title: "Quiz Submitted! (Demo)",
          description: `You scored ${score} out of ${questions.length}`,
        })

        // Broadcast submission to other users
        if (student) {
          const event = new CustomEvent("quizSubmitted", {
            detail: {
              studentName: student.name,
              score: score,
              totalQuestions: questions.length,
            },
          })
          window.dispatchEvent(event)
        }

        // Navigate to results page
        router.push(`/student/quiz/${id}/results?score=${score}&total=${questions.length}`)
        return
      }

      // CHANGE: Added explicit logging of student ID before submission
      console.log("Submitting to real API with student ID:", student.id)
      const result = await submitQuiz(id, student.id, answers)
      console.log("Submission result:", result)

      // Show success toast
      toast({
        title: "Quiz Submitted!",
        description: `You scored ${result.submission.score} out of ${result.submission.totalQuestions}`,
      })

      // Broadcast submission to other users
      if (student) {
        // This would typically be done via WebSockets, but for this demo we'll use a custom event
        const event = new CustomEvent("quizSubmitted", {
          detail: {
            studentName: student.name,
            score: result.submission.score,
            totalQuestions: result.submission.totalQuestions,
          },
        })
        window.dispatchEvent(event)
      }

      // Navigate to results page
      router.push(
        `/student/quiz/${id}/results?score=${result.submission.score}&total=${result.submission.totalQuestions}`,
      )
    } catch (err) {
      console.error("Error submitting quiz:", err)

      // Check if the error is because the quiz was already submitted
      if (err instanceof Error && err.message.includes("already taken")) {
        setAlreadySubmitted(true)
        setShowAlreadySubmittedDialog(true)
        return
      }

      // For demo purposes, simulate a successful submission
      if (usingSampleData) {
        const score = Math.floor(Math.random() * (questions.length + 1))
        router.push(`/student/quiz/${id}/results?score=${score}&total=${questions.length}`)
        return
      }

      // CHANGE: Improved error message to show actual error message when available
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit quiz. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
      setShowConfirmDialog(false)
    }
  }

  const allQuestionsAnswered = answers.every((answer) => answer.selectedAnswer !== "")
  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestionIndex]?.selectedAnswer || ""

  if (alreadySubmitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-amber-600">Quiz Already Submitted</h2>
          <p className="mb-6">You have already taken this quiz. You can only take it once.</p>
          <Button onClick={() => router.push("/student/quizzes")}>Back to Quizzes</Button>
        </div>
      </div>
    )
  }

  if (error && !usingSampleData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={() => router.push("/student/quizzes")}>Back to Quizzes</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="max-w-4xl w-full">
        {usingSampleData && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">
              Using sample questions for demonstration. In a production environment, this would connect to your backend
              API.
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{quiz?.title || "Quiz"}</h1>
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2 mb-8" />

            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-2">{currentQuestion?.question_text || "Loading question..."}</h2>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {currentQuestion?.options.map((option, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${currentAnswer === option ? "border-primary bg-primary/10" : "hover:border-gray-400"
                    }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <CardContent className="p-4 flex items-center">
                    <div className="mr-3 flex-shrink-0">
                      {currentAnswer === option ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div>{option}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNextQuestion} disabled={!currentAnswer}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => setShowConfirmDialog(true)} disabled={!allQuestionsAnswered}>
                  Submit Quiz
                </Button>
              )}
            </div>
          </>
        )}
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitQuiz} disabled={submitting}>
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
              You have already taken this quiz. You can only take it once.
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
