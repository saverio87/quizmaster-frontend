"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { getClassrooms } from "@/components/quiz-api"

interface Classroom {
    id: string
    name: string
    description: string
    teacher_name: string
}

export default function ClassroomSelection() {
    const [classrooms, setClassrooms] = useState<Classroom[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [usingSampleData, setUsingSampleData] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const data = await getClassrooms()
                setClassrooms(data)

                // Check if we're using sample data
                if (data.length > 0 && data[0].id === "c1") {
                    setUsingSampleData(true)
                    setError("Using sample data for demonstration purposes.")
                }
            } catch (err) {
                setError("Failed to load classrooms. Using sample data for demonstration.")
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

        fetchClassrooms()
    }, [toast])

    const handleClassroomSelect = (classroom: Classroom) => {
        // Store selected classroom in localStorage
        localStorage.setItem("selectedClassroom", JSON.stringify(classroom))
        // Navigate to student selection page for this classroom
        router.push(`/student/classrooms/${classroom.id}`)
    }

    return (
        <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
            <div className="max-w-5xl w-full">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Select Your Classroom</h1>

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
                        {classrooms.map((classroom) => (
                            <Card
                                key={classroom.id}
                                className="hover:shadow-md transition-shadow cursor-pointer hover:border-gray-400"
                                onClick={() => handleClassroomSelect(classroom)}
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6 h-32">
                                    <h2 className="text-xl font-medium text-center mb-2">{classroom.name}</h2>
                                    <p className="text-sm text-muted-foreground text-center">{classroom.teacher_name}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
