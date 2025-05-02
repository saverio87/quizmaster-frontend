"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { getClassroomStudents } from "@/components/quiz-api"

interface Student {
    id: string
    name: string
    joined_at: string
}

interface Classroom {
    id: string
    name: string
    description: string
    teacher_name: string
}

export default function ClassroomStudentsPage({ params }: { params: { id: string } }) {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [usingSampleData, setUsingSampleData] = useState(false)
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        // Get the selected classroom from localStorage
        const classroomData = localStorage.getItem("selectedClassroom")
        if (classroomData) {
            setSelectedClassroom(JSON.parse(classroomData))
        }

        const fetchStudents = async () => {
            try {
                const data = await getClassroomStudents(params.id)
                console.log("Classroom students data:", data)
                setStudents(data)

                // Check if we're using sample data
                if (data.length > 0 && data[0].student_id === "s1") {
                    setUsingSampleData(true)
                    setError("Using sample data for demonstration purposes.")
                }
            } catch (err) {
                setError("Failed to load students. Using sample data for demonstration.")
                setUsingSampleData(true)
                toast({
                    title: "API Notice",
                    description:
                        "Using sample data for demonstration. In a production environment, this would connect to your backend API.",
                    variant: "default",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchStudents()
    }, [params.id, toast])

    const handleStudentSelect = (student: Student) => {
        // Store selected student in localStorage with the correct ID field
        const studentData = {
            id: student.id, // Make sure we're using student_id here
            name: student.name,
        }

        console.log("Storing student data:", studentData)
        localStorage.setItem("selectedStudent", JSON.stringify(studentData))

        // Navigate to quiz selection page
        router.push("/student/quizzes")
    }

    const handleBackClick = () => {
        router.push("/student")
    }

    return (
        <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
            <div className="max-w-5xl w-full">
                <Button variant="ghost" className="mb-4" onClick={handleBackClick}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classrooms
                </Button>

                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
                    {selectedClassroom ? selectedClassroom.name : "Classroom"}
                </h1>

                <h2 className="text-xl text-muted-foreground mb-8 text-center">Select Your Name</h2>

                {usingSampleData && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                        <p className="text-sm text-yellow-700">
                            Using sample data for demonstration. In a production environment, this would connect to your backend API.
                        </p>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-24 rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {students.map((student) => (
                            <Card
                                key={student.id}
                                className="hover:shadow-md transition-shadow cursor-pointer hover:border-gray-400"
                                onClick={() => handleStudentSelect(student)}
                            >
                                <CardContent className="flex items-center justify-center p-6 h-24">
                                    <h2 className="text-xl font-medium text-center">{student.name}</h2>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
