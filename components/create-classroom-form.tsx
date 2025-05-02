"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { createClassroom } from "@/components/quiz-api"

export default function CreateClassroomForm() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [teacherName, setTeacherName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            toast({
                title: "Missing Name",
                description: "Please enter a classroom name.",
                variant: "destructive",
            })
            return
        }

        if (!teacherName.trim()) {
            toast({
                title: "Missing Teacher Name",
                description: "Please enter a teacher name.",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const classroomData = {
                name,
                description,
                teacher_name: teacherName,
            }

            const result = await createClassroom(classroomData)

            toast({
                title: "Classroom Created",
                description: `Classroom "${name}" has been created successfully.`,
            })

            // Redirect to the teacher dashboard
            router.push("/teacher")
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create classroom. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Create Classroom</CardTitle>
                    <CardDescription>Enter the details for your new classroom.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Classroom Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter classroom name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter classroom description"
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="teacherName">Teacher Name</Label>
                        <Input
                            id="teacherName"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                            placeholder="Enter teacher name"
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting} className="ml-auto">
                        {isSubmitting ? "Creating..." : "Create Classroom"}
                        <Save className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
