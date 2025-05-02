"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { getClassroomStudents } from "@/components/quiz-api"

interface ClassroomStudent {
    student_id: string
    name: string
    joined_at: string
}

interface ClassroomStudentsListProps {
    classroomId: string
    refreshTrigger?: number
}

export default function ClassroomStudentsList({ classroomId, refreshTrigger = 0 }: ClassroomStudentsListProps) {
    const [students, setStudents] = useState<ClassroomStudent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true)
            setError(null)

            try {
                const data = await getClassroomStudents(classroomId)
                console.log("API response data:", data)

                // Ensure we're setting an array to the students state
                if (Array.isArray(data)) {
                    setStudents(data)
                } else if (data && typeof data === "object") {
                    // If the API returns an object with a students property
                    if (Array.isArray(data.students)) {
                        setStudents(data.students)
                    } else {
                        // If we can't find an array, set an empty array and log an error
                        console.error("Unexpected data format:", data)
                        setStudents([])
                        setError("Received invalid data format from server")
                    }
                } else {
                    // If data is null, undefined, or not an object
                    setStudents([])
                    setError("No student data available")
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to load classroom students"
                setError(errorMessage)
                setStudents([]) // Ensure students is always an array
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchStudents()
    }, [classroomId, refreshTrigger, toast])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>Students currently enrolled in this classroom.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : error ? (
                    <div className="text-center py-6 text-red-500">{error}</div>
                ) : students.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">No students enrolled yet.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.student_id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{formatDate(student.joined_at)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
