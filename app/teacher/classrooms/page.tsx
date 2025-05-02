"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Users, Calendar } from "lucide-react"
import { getClassrooms } from "@/components/quiz-api"

interface Classroom {
    id: string
    name: string
    description: string
    teacher_name: string
    created_at: string
}

export default function ClassroomsPage() {
    const [classrooms, setClassrooms] = useState<Classroom[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const data = await getClassrooms()
                setClassrooms(data)
            } catch (err) {
                setError("Failed to load classrooms. Please try again later.")
                toast({
                    title: "Error",
                    description: "Failed to load classrooms. Please try again later.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchClassrooms()
    }, [toast])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <div className="flex min-h-screen flex-col p-4 md:p-8">
            <div className="max-w-7xl w-full mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex items-center">
                        <Link href="/teacher">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold ml-4">Classrooms</h1>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Link href="/teacher/classrooms/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Classroom
                            </Button>
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-48 rounded-lg" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-medium mb-2 text-red-600">Error</h2>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                ) : classrooms.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-medium mb-2">No classrooms available</h2>
                        <p className="text-gray-500 mb-6">Create a classroom to get started</p>
                        <Link href="/teacher/classrooms/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Classroom
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classrooms.map((classroom) => (
                            <Card key={classroom.id}>
                                <CardHeader>
                                    <CardTitle>{classroom.name}</CardTitle>
                                    <CardDescription>{classroom.teacher_name}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="line-clamp-2 mb-4">{classroom.description || "No description available"}</p>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Created on {formatDate(classroom.created_at)}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Link href={`/teacher/classrooms/${classroom.id}`}>
                                        <Button variant="outline">
                                            <Users className="mr-2 h-4 w-4" />
                                            View Students
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
