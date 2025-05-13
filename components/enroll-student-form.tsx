"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import { getStudents, getClassroomStudents, enrollStudentInClassroom } from "@/components/quiz-api"

interface Student {
    id: string
    name: string
    isEnrolled: boolean
}

interface EnrollStudentFormProps {
    classroomId: string
    onSuccess?: () => void
}

interface ClassroomStudent {
    student_id: string
    name: string
    joinedAt: string
}

export default function EnrollStudentForm({ classroomId, onSuccess }: EnrollStudentFormProps) {
    const [students, setStudents] = useState<Student[]>([])
    const [selectedStudentId, setSelectedStudentId] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                // Fetch both data sets concurrently
                const [allStudents, enrolledStudents] = await Promise.all([
                    getStudents(),
                    getClassroomStudents(classroomId)
                ]);

                // Create a map of enrolled student IDs for quick lookup
                const enrolledStudentIds = new Set(
                    enrolledStudents.map((student: any) => student.id)
                );

                // Enhance the students array with enrollment status
                const processedStudents = allStudents.map((student: any) => ({
                    ...student,
                    isEnrolled: enrolledStudentIds.has(student.id)
                }));

                setStudents(processedStudents);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load students. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchStudents()
    }, [toast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedStudentId) {
            toast({
                title: "No Student Selected",
                description: "Please select a student to enroll.",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            await enrollStudentInClassroom(classroomId, selectedStudentId)

            toast({
                title: "Student Enrolled",
                description: "Student has been successfully enrolled in the classroom.",
            })

            setSelectedStudentId("")

            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to enroll student. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Enroll Student</CardTitle>
                <CardDescription>Add a student to this classroom.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="student">Select Student</Label>
                        <Select
                            value={selectedStudentId}
                            onValueChange={setSelectedStudentId}
                            disabled={isLoading || students.length === 0}
                        >
                            <SelectTrigger id="student">
                                <SelectValue placeholder="Select a student" />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((student) => (
                                    <SelectItem
                                        key={student.id}
                                        value={student.id}
                                        disabled={student.isEnrolled}
                                        className={student.isEnrolled ? "text-muted-foreground" : ""}
                                    >
                                        {student.name}
                                        {student.isEnrolled && " (already enrolled)"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isLoading && <p className="text-sm text-muted-foreground">Loading students...</p>}
                        {!isLoading && students.length === 0 && (
                            <p className="text-sm text-muted-foreground">No students available.</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting || !selectedStudentId} className="ml-auto">
                        {isSubmitting ? "Enrolling..." : "Enroll Student"}
                        <UserPlus className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
