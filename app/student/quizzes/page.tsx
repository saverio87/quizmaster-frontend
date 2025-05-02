// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useToast } from "@/hooks/use-toast"
// import { ArrowLeft } from "lucide-react"
// import Link from "next/link"

// interface Quiz {
//   id: string
//   title: string
//   description: string
//   created_at: string
// }

// interface Student {
//   id: string
//   name: string
// }

// export default function QuizSelectionPage() {
//   const [quizzes, setQuizzes] = useState<Quiz[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [student, setStudent] = useState<Student | null>(null)
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     // Check if student is selected
//     const storedStudent = localStorage.getItem("selectedStudent")
//     if (!storedStudent) {
//       router.push("/student")
//       return
//     }

//     setStudent(JSON.parse(storedStudent))

//     const fetchQuizzes = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`)
//         if (!response.ok) {
//           throw new Error("Failed to fetch quizzes")
//         }
//         const data = await response.json()
//         setQuizzes(data)
//       } catch (err) {
//         setError("Failed to load quizzes. Please try again later.")
//         toast({
//           title: "Error",
//           description: "Failed to load quizzes. Please try again later.",
//           variant: "destructive",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchQuizzes()
//   }, [router, toast])

//   const handleQuizSelect = (quiz: Quiz) => {
//     // Store selected quiz in localStorage
//     localStorage.setItem("selectedQuiz", JSON.stringify(quiz))
//     // Navigate to quiz page
//     router.push(`/student/quiz/${quiz.id}`)
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center p-4">
//         <div className="max-w-md w-full text-center">
//           <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
//           <p className="mb-6">{error}</p>
//           <Button onClick={() => window.location.reload()}>Try Again</Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
//       <div className="max-w-5xl w-full">
//         <div className="flex items-center mb-8">
//           <Link href="/student">
//             <Button variant="ghost" size="icon" className="mr-4">
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//           </Link>
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold">Available Quizzes</h1>
//             {student && <p className="text-gray-500 mt-1">Logged in as {student.name}</p>}
//           </div>
//         </div>

//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {Array.from({ length: 4 }).map((_, index) => (
//               <Skeleton key={index} className="h-48 rounded-lg" />
//             ))}
//           </div>
//         ) : quizzes.length === 0 ? (
//           <div className="text-center py-12">
//             <h2 className="text-xl font-medium mb-2">No quizzes available</h2>
//             <p className="text-gray-500">Check back later for new quizzes</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {quizzes.map((quiz) => (
//               <Card
//                 key={quiz.id}
//                 className="hover:shadow-md transition-shadow cursor-pointer hover:border-gray-400"
//                 onClick={() => handleQuizSelect(quiz)}
//               >
//                 <CardHeader>
//                   <CardTitle>{quiz.title}</CardTitle>
//                   <CardDescription>Created on {formatDate(quiz.created_at)}</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="line-clamp-2">{quiz.description || "No description available"}</p>
//                 </CardContent>
//                 <CardFooter>
//                   <Button variant="outline" className="w-full">
//                     Start Quiz
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getQuizByPublicId } from "@/components/quiz-api"

interface Student {
  id: string
  name: string
}

interface Quiz {
  id: string
  title: string
  description: string
  publicId: string
}

interface QuizResponse {
  quiz: Quiz
  questions: any[]
}

export default function QuizEntryPage() {
  const [publicId, setPublicId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quizData, setQuizData] = useState<QuizResponse | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [usingSampleData, setUsingSampleData] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if student is selected
    const storedStudent = localStorage.getItem("selectedStudent")
    if (!storedStudent) {
      router.push("/student")
      return
    }

    setStudent(JSON.parse(storedStudent))
  }, [router])

  const handleQuizCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!publicId.trim()) {
      setError("Please enter a quiz code")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getQuizByPublicId(publicId)

      // Parse the options JSON for each question if needed
      const formattedData = {
        ...data,
        questions: data.questions.map((q: any) => ({
          ...q,
          options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
        })),
      }

      setQuizData(formattedData)

      // Check if we're using sample data
      if (formattedData.quiz.id === "q1" && !publicId.includes(formattedData.quiz.publicId)) {
        setUsingSampleData(true)
        setError("Using sample data for demonstration purposes.")
      }

      toast({
        title: "Quiz loaded!",
        description: `${formattedData.questions.length} questions found for "${formattedData.quiz.title}"`,
      })
    } catch (err: any) {
      setError(err.message || "An error occurred")
      toast({
        title: "Error",
        description: err.message || "Failed to load quiz",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuiz = () => {
    if (!quizData) return

    // Store selected quiz in localStorage
    localStorage.setItem("selectedQuiz", JSON.stringify(quizData.quiz))

    // Navigate to quiz page
    router.push(`/student/quiz/${quizData.quiz.id}`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="max-w-md w-full">
        <div className="flex items-center mb-8">
          <Link href="/student">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Enter Quiz Code</h1>
            {student && <p className="text-gray-500 mt-1">Logged in as {student.name}</p>}
          </div>
        </div>

        {usingSampleData && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">
              Using sample data for demonstration. In a production environment, this would connect to your backend API.
            </p>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Enter Quiz Code</CardTitle>
            <CardDescription>Enter the quiz code provided by your teacher (e.g., QUIZ-123456)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuizCodeSubmit}>
              <div className="flex flex-col space-y-4">
                <Input
                  placeholder="e.g. QUIZ-123456"
                  value={publicId}
                  onChange={(e) => setPublicId(e.target.value)}
                  disabled={loading}
                />
                {error && !usingSampleData && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Find Quiz"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {quizData && (
          <Card>
            <CardHeader>
              <CardTitle>{quizData.quiz.title}</CardTitle>
              <CardDescription>{quizData.quiz.description || "No description available"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This quiz has {quizData.questions.length} questions.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartQuiz} className="w-full">
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
