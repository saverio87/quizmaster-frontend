"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trash2, RefreshCw, School } from "lucide-react"
import Link from "next/link"
import { Dialog } from "@radix-ui/react-dialog"

interface Classroom {
    id: string
    name: string
    description: string
    teacherName: string
    createdAt: string
    joinedAt: string
}

interface Student {
    id: string
    name: string
    createdAt: string
    classrooms: Classroom[]
}

interface PaginationInfo {
    page: number
    limit: number
    totalItems: number
    totalPages: number
}

interface StudentsResponse {
    students: Student[]
    pagination: PaginationInfo
}

export default function StudentsPageClient() {
    const router = useRouter()
    const { toast } = useToast()
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newStudentName, setNewStudentName] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [bulkStudentNames, setBulkStudentNames] = useState("")
    const [isBulkCreating, setIsBulkCreating] = useState(false)

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/with-classrooms`)
            if (!response.ok) {
                throw new Error(`Failed to fetch students: ${response.status}`)
            }
            const data: StudentsResponse = await response.json()
            setStudents(data.students)
        } catch (err) {
            console.error("Error fetching students:", err)
            setError("Failed to load students. Please try again.")
            toast({
                title: "Error",
                description: "Failed to load students. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateStudent = async () => {
        if (!newStudentName.trim()) {
            toast({
                title: "Error",
                description: "Student name cannot be empty.",
                variant: "destructive",
            })
            return
        }

        setIsCreating(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newStudentName }),
            })

            if (!response.ok) {
                throw new Error(`Failed to create student: ${response.status}`)
            }

            const newStudent = await response.json()
            setStudents((prev) => [...prev, { ...newStudent, classrooms: [] }])
            setNewStudentName("")
            toast({
                title: "Success",
                description: "Student created successfully.",
            })
        } catch (err) {
            console.error("Error creating student:", err)
            toast({
                title: "Error",
                description: "Failed to create student. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsCreating(false)
        }
    }

    const handleBulkCreateStudents = async () => {
        const names = bulkStudentNames
            .split("\n")
            .map((name) => name.trim())
            .filter((name) => name.length > 0)

        if (names.length === 0) {
            toast({
                title: "Error",
                description: "Please enter at least one student name.",
                variant: "destructive",
            })
            return
        }

        setIsBulkCreating(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ names }),
            })

            if (!response.ok) {
                throw new Error(`Failed to create students: ${response.status}`)
            }

            const result = await response.json()
            fetchStudents() // Refresh the list
            setBulkStudentNames("")
            toast({
                title: "Success",
                description: `${result.created} students created successfully.`,
            })
        } catch (err) {
            console.error("Error creating students:", err)
            toast({
                title: "Error",
                description: "Failed to create students. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsBulkCreating(false)
        }
    }

    const handleDeleteStudent = async () => {
        if (!studentToDelete) return

        setIsDeleting(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${studentToDelete.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error(`Failed to delete student: ${response.status}`)
            }

            setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id))
            setShowDeleteDialog(false)
            setStudentToDelete(null)
            toast({
                title: "Success",
                description: "Student deleted successfully.",
            })
        } catch (err) {
            console.error("Error deleting student:", err)
            toast({
                title: "Error",
                description: "Failed to delete student. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const confirmDelete = (student: Student) => {
        setStudentToDelete(student)
        setShowDeleteDialog(true)
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "Unknown date"
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        } catch (error) {
            console.error("Error formatting date:", error)
            return "Invalid date"
        }
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
                    <p className="mb-6">{error}</p>
                    <Button onClick={() => fetchStudents()}>Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2">
                        <Link href="/teacher">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">Manage Students</h1>
                    </div>
                    <p className="text-muted-foreground mt-1">Create, view, and manage students</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                    <Button onClick={fetchStudents} variant="outline" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list">Student List</TabsTrigger>
                    <TabsTrigger value="create">Create Student</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Create</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Students</CardTitle>
                            <CardDescription>View and manage all students in the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : students.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No students found. Create some students to get started.</p>
                                </div>
                            ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead>Enrolled In</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="font-medium">{student.name}</TableCell>
                                                    <TableCell>{formatDate(student.createdAt)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {student.classrooms.length === 0 ? (
                                                                <span className="text-muted-foreground text-sm">Not enrolled</span>
                                                            ) : (
                                                                student.classrooms.map((classroom) => (
                                                                    <Badge key={classroom.id} variant="outline" className="flex items-center gap-1">
                                                                        <School className="h-3 w-3" />
                                                                        {classroom.name}
                                                                    </Badge>
                                                                ))
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                                    onClick={() => confirmDelete(student)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                        </AlertDialog>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Student</CardTitle>
                            <CardDescription>Add a new student to the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Student Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter student name"
                                        value={newStudentName}
                                        onChange={(e) => setNewStudentName(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleCreateStudent} disabled={isCreating || !newStudentName.trim()}>
                                    {isCreating ? "Creating..." : "Create Student"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bulk">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bulk Create Students</CardTitle>
                            <CardDescription>Add multiple students at once</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="bulk-names">Student Names (one per line)</Label>
                                    <textarea
                                        id="bulk-names"
                                        className="min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="John Doe&#10;Jane Smith&#10;Alex Johnson"
                                        value={bulkStudentNames}
                                        onChange={(e) => setBulkStudentNames(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleBulkCreateStudents} disabled={isBulkCreating || !bulkStudentNames.trim()}>
                                    {isBulkCreating ? "Creating..." : "Create Students"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the student <span className="font-semibold">{studentToDelete?.name}</span>{" "}
                            and remove them from all classrooms. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteStudent}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
