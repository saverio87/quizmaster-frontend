"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Save } from "lucide-react"
import { createQuiz } from "@/components/quiz-api"

interface Question {
    id: string
    question_text: string
    options: string[]
    correct_answer: string
}

export default function CreateQuizForm() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: "q1",
            question_text: "",
            options: ["", "", "", ""],
            correct_answer: "",
        },
    ])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: `q${questions.length + 1}`,
                question_text: "",
                options: ["", "", "", ""],
                correct_answer: "",
            },
        ])
    }

    const handleRemoveQuestion = (index: number) => {
        if (questions.length > 1) {
            const newQuestions = [...questions]
            newQuestions.splice(index, 1)
            setQuestions(newQuestions)
        } else {
            toast({
                title: "Cannot Remove",
                description: "A quiz must have at least one question.",
                variant: "destructive",
            })
        }
    }

    const handleQuestionChange = (index: number, field: string, value: string) => {
        const newQuestions = [...questions]
        newQuestions[index] = { ...newQuestions[index], [field]: value }
        setQuestions(newQuestions)
    }

    const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].options[optionIndex] = value
        setQuestions(newQuestions)
    }

    const handleCorrectAnswerChange = (questionIndex: number, value: string) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].correct_answer = value
        setQuestions(newQuestions)
    }

    const validateForm = () => {
        if (!title.trim()) {
            toast({
                title: "Missing Title",
                description: "Please enter a quiz title.",
                variant: "destructive",
            })
            return false
        }

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i]
            if (!question.question_text.trim()) {
                toast({
                    title: "Missing Question Text",
                    description: `Please enter text for question ${i + 1}.`,
                    variant: "destructive",
                })
                return false
            }

            for (let j = 0; j < question.options.length; j++) {
                if (!question.options[j].trim()) {
                    toast({
                        title: "Missing Option",
                        description: `Please enter all options for question ${i + 1}.`,
                        variant: "destructive",
                    })
                    return false
                }
            }

            if (!question.correct_answer.trim()) {
                toast({
                    title: "Missing Correct Answer",
                    description: `Please select a correct answer for question ${i + 1}.`,
                    variant: "destructive",
                })
                return false
            }

            if (!question.options.includes(question.correct_answer)) {
                toast({
                    title: "Invalid Correct Answer",
                    description: `The correct answer for question ${i + 1} must be one of the options.`,
                    variant: "destructive",
                })
                return false
            }
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            const quizData = {
                title,
                description,
                questions: questions.map(({ question_text, options, correct_answer }) => ({
                    question_text,
                    options,
                    correct_answer,
                })),
            }

            const result = await createQuiz(quizData)

            toast({
                title: "Quiz Created",
                description: `Quiz "${title}" has been created successfully.`,
            })

            // Redirect to the teacher dashboard
            router.push("/teacher")
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create quiz. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Details</CardTitle>
                        <CardDescription>Enter the basic information about your quiz.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Quiz Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter quiz title"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter quiz description"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {questions.map((question, questionIndex) => (
                    <Card key={question.id}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div>
                                <CardTitle>Question {questionIndex + 1}</CardTitle>
                                <CardDescription>Enter the question and answer options.</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveQuestion(questionIndex)}
                                disabled={questions.length === 1}
                            >
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Remove question</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor={`question-${questionIndex}`}>Question Text</Label>
                                <Textarea
                                    id={`question-${questionIndex}`}
                                    value={question.question_text}
                                    onChange={(e) => handleQuestionChange(questionIndex, "question_text", e.target.value)}
                                    placeholder="Enter question text"
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <Label>Answer Options</Label>
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center space-x-2">
                                        <Input
                                            value={option}
                                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                            placeholder={`Option ${optionIndex + 1}`}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCorrectAnswerChange(questionIndex, option)}
                                            className={
                                                question.correct_answer === option ? "bg-green-100 border-green-500 hover:bg-green-200" : ""
                                            }
                                        >
                                            {question.correct_answer === option ? "Correct ✓" : "Mark Correct"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handleAddQuestion}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Question
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Quiz"}
                        <Save className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </form>
    )
}
