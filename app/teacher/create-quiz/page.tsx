"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import CreateQuizForm from "@/components/create-quiz-form"

export default function CreateQuizPage() {
    return (
        <div className="flex min-h-screen flex-col p-4 md:p-8">
            <div className="max-w-4xl w-full mx-auto">
                <div className="flex items-center mb-8">
                    <Link href="/teacher">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold ml-4">Create New Quiz</h1>
                </div>

                <CreateQuizForm />
            </div>
        </div>
    )
}
