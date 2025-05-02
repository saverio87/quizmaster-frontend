"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import CreateClassroomForm from "@/components/create-classroom-form"

export default function CreateClassroomPage() {
    return (
        <div className="flex min-h-screen flex-col p-4 md:p-8">
            <div className="max-w-2xl w-full mx-auto">
                <div className="flex items-center mb-8">
                    <Link href="/teacher/classrooms">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Classrooms
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold ml-4">Create Classroom</h1>
                </div>

                <CreateClassroomForm />
            </div>
        </div>
    )
}
