"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createQuiz } from "@/components/quiz-api"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function CreateQuizWithJson() {
    const [jsonContent, setJsonContent] = useState<string>(JSON.stringify(defaultQuizJson, null, 2))
    const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
        type: null,
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            setStatus({ type: null, message: "" })

            // Parse the JSON content
            const quizData = JSON.parse(jsonContent)

            console.log("Submitting quiz data:", quizData)

            // Call the API to create the quiz
            const result = await createQuiz(quizData)

            console.log("Quiz created successfully:", result)
            setStatus({
                type: "success",
                message: `Quiz "${quizData.title}" created successfully! Quiz ID: ${result?.id || "N/A"}, Public ID: ${result?.publicId || "N/A"}`,
            })
        } catch (error) {
            console.error("Error creating quiz:", error)
            setStatus({
                type: "error",
                message: `Failed to create quiz: ${error instanceof Error ? error.message : "Unknown error"}`,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetToDefault = () => {
        setJsonContent(JSON.stringify(defaultQuizJson, null, 2))
        setStatus({ type: null, message: "" })
    }

    return (
        <div className="container mx-auto py-8">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Create Quiz with JSON</CardTitle>
                    <CardDescription>
                        Edit the JSON below and click submit to create a quiz without using the form interface.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {status.type && (
                        <Alert variant={status.type === "success" ? "default" : "destructive"} className="mb-4">
                            {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <AlertTitle>{status.type === "success" ? "Success" : "Error"}</AlertTitle>
                            <AlertDescription>{status.message}</AlertDescription>
                        </Alert>
                    )}

                    <Textarea
                        value={jsonContent}
                        onChange={(e) => setJsonContent(e.target.value)}
                        className="font-mono h-[600px] overflow-y-auto"
                        placeholder="Enter quiz JSON here..."
                    />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={resetToDefault}>
                        Reset to Default
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Quiz"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

// Default quiz JSON based on the provided questionnaire
const defaultQuizJson = {
    title: "The Witches - Chapter 3 - Comprehension Check",
    description: "Test your understanding of Chapter 3 from Roald Dahl's 'The Witches'",
    questions: [
        {
            question_text: "Why does a real witch always wear gloves?",
            options: ["To keep warm in winter", "To hide her curvy claws", "To follow a fashion trend"],
            correct_answer: "To hide her curvy claws",
        },
        {
            question_text: "What does the grandmother say about witches' hair?",
            options: ["They have long, curly hair", "They are bald", "They wear colorful wigs"],
            correct_answer: "They are bald",
        },
        {
            question_text: "Why do witches wear wigs?",
            options: ["To look stylish", "To hide their baldness", "To match their gloves"],
            correct_answer: "To hide their baldness",
        },
        {
            question_text: "What is a problem caused by wearing wigs for witches?",
            options: ["Headaches", "Itchy scalp", "Bad hair days"],
            correct_answer: "Itchy scalp",
        },
        {
            question_text: "What is a unique feature of witches' nose-holes?",
            options: ["They have pink and curvy rims", "They are small and circular", "They change color"],
            correct_answer: "They have pink and curvy rims",
        },
        {
            question_text: "According to the grandmother, why do witches prefer children over adults?",
            options: [
                "Because children smell better",
                "Because adults are too big",
                "Because adults don't give out stink-waves",
            ],
            correct_answer: "Because children smell better",
        },
        {
            question_text: "What is interesting about witches' eyes?",
            options: ["They have big pupils", "They keep changing colors", "They look like normal eyes"],
            correct_answer: "They keep changing colors",
        },
        {
            question_text: "How does the grandmother describe witches' feet?",
            options: ["They have no toes", "They wear big shoes", "They are small and pointed"],
            correct_answer: "They have no toes",
        },
        {
            question_text: "What unusual feature does the grandmother say about witches' spit?",
            options: ["It's red", "It's green", "It's blue like a bilberry"],
            correct_answer: "It's blue like a bilberry",
        },
        {
            question_text: "What makes a witch identifiable according to the grandmother?",
            options: ["If she's wearing gloves", "If she has a pet cat", "If she carries a broomstick"],
            correct_answer: "If she's wearing gloves",
        },
    ],
}
