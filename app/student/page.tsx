// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useToast } from "@/hooks/use-toast"

// interface Student {
//   id: string
//   name: string
// }

// export default function StudentSelectionPage() {
//   const [students, setStudents] = useState<Student[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`)
//         if (!response.ok) {
//           throw new Error("Failed to fetch students")
//         }
//         const data = await response.json()
//         setStudents(data)
//       } catch (err) {
//         setError("Failed to load students. Please try again later.")
//         toast({
//           title: "Error",
//           description: "Failed to load students. Please try again later.",
//           variant: "destructive",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStudents()
//   }, [toast])

//   const handleStudentSelect = (student: Student) => {
//     // Store selected student in localStorage
//     localStorage.setItem("selectedStudent", JSON.stringify(student))
//     // Navigate to quiz selection page
//     router.push("/student/quizzes")
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
//         <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Select Your Name</h1>

//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {Array.from({ length: 6 }).map((_, index) => (
//               <Skeleton key={index} className="h-24 rounded-lg" />
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {students.map((student) => (
//               <Card
//                 key={student.id}
//                 className="hover:shadow-md transition-shadow cursor-pointer hover:border-gray-400"
//                 onClick={() => handleStudentSelect(student)}
//               >
//                 <CardContent className="flex items-center justify-center p-6 h-24">
//                   <h2 className="text-xl font-medium text-center">{student.name}</h2>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import ClassroomSelection from "@/components/classroom-selection"

export default function StudentPage() {
  return <ClassroomSelection />
}