"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function QuizSubmissionToast() {
  const { toast } = useToast()

  useEffect(() => {
    const handleQuizSubmission = (event: any) => {
      const { studentName } = event.detail

      toast({
        title: "Quiz Submitted",
        description: `${studentName} just submitted their quiz!`,
      })
    }

    window.addEventListener("quizSubmitted", handleQuizSubmission)

    return () => {
      window.removeEventListener("quizSubmitted", handleQuizSubmission)
    }
  }, [toast])

  return null
}
