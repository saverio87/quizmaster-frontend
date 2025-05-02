"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ClassroomStudentsList from "@/components/classroom-students-list"
import EnrollStudentForm from "@/components/enroll-student-form"

export default function ClassroomDetailsPage({ params }: { params: { id: string } }) {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const classroomId = params.id

    const handleStudentEnrolled = () => {
        // Trigger a refresh of the students list
        setRefreshTrigger((prev) => prev + 1)
    }

    return (
        <div className="flex min-h-screen flex-col p-4 md:p-8">
            <div className="max-w-7xl w-full mx-auto">
                <div className="flex items-center mb-8">
                    <Link href="/teacher/classrooms">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Classrooms
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold ml-4">Classroom Details</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <ClassroomStudentsList classroomId={classroomId} refreshTrigger={refreshTrigger} />
                    </div>
                    <div>
                        <EnrollStudentForm classroomId={classroomId} onSuccess={handleStudentEnrolled} />
                    </div>
                </div>
            </div>
        </div>
    )
}
