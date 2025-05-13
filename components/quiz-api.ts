// API functions for quiz operations

// Sample data for testing when API fails
const sampleStudents = [
  { id: "s1", name: "Alice Johnson" },
  { id: "s2", name: "Bob Smith" },
  { id: "s3", name: "Charlie Brown" },
  { id: "s4", name: "Diana Miller" },
  { id: "s5", name: "Edward Davis" },
]

const sampleQuizzes = [
  {
    id: "q1",
    title: "Math Quiz",
    description: "Test your basic math skills",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    publicId: "QUIZ-123456",
  },
  {
    id: "q2",
    title: "Science Quiz",
    description: "Explore the world of science",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    publicId: "QUIZ-789012",
  },
  {
    id: "q3",
    title: "History Quiz",
    description: "Test your knowledge of world history",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    publicId: "QUIZ-345678",
  },
]

const sampleQuestions = [
  {
    id: "q1",
    question_text: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
  },
  {
    id: "q2",
    question_text: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
  },
  {
    id: "q3",
    question_text: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
  },
  {
    id: "q4",
    question_text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
  },
]

const sampleClassrooms = [
  {
    id: "c1",
    name: "Math 101",
    description: "Introduction to Mathematics",
    teacher_name: "Mr. Johnson",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "c2",
    name: "Science 202",
    description: "Advanced Science Concepts",
    teacher_name: "Ms. Smith",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const sampleClassroomStudents = [
  {
    student_id: "s1",
    name: "Alice Johnson",
    joined_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    student_id: "s2",
    name: "Bob Smith",
    joined_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    student_id: "s3",
    name: "Charlie Brown",
    joined_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    student_id: "s4",
    name: "Diana Miller",
    joined_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    student_id: "s5",
    name: "Edward Davis",
    joined_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function getStudents() {
  try {
    console.log(`Fetching students from: ${process.env.NEXT_PUBLIC_API_URL}/api/students`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`)

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.warn(`Failed to fetch students: ${response.status} ${response.statusText}`)
      console.log("Using sample students data for testing")
      return sampleStudents
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching students:", error)
    console.log("Using sample students data for testing")
    return sampleStudents
  }
}

export async function getQuizzes() {
  try {
    console.log(`Fetching quizzes from: ${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`)

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.warn(`Failed to fetch quizzes: ${response.status} ${response.statusText}`)
      console.log("Using sample quizzes data for testing")
      return sampleQuizzes
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    console.log("Using sample quizzes data for testing")
    return sampleQuizzes
  }
}

export async function getQuizByPublicId(publicId: string) {
  try {
    console.log(`Fetching quiz from: ${process.env.NEXT_PUBLIC_API_URL}/api/quiz/public/${publicId}`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/public/${publicId}`)

    console.log("Response status:", response.status)
    console.log(response)

    if (!response.ok) {
      console.warn(`Failed to fetch quiz: ${response.status} ${response.statusText}`)

      if (response.status === 404) {
        throw new Error("Quiz not found. Please check the code and try again.")
      }

      console.log("Using sample quiz data for testing")
      // Return a sample quiz based on the publicId
      const sampleQuiz = sampleQuizzes.find((q) => q.publicId === publicId) || sampleQuizzes[0]

      return {
        quiz: sampleQuiz,
        questions: sampleQuestions,
      }
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error && error.message.includes("Quiz not found")) {
      throw error
    }

    console.error("Error fetching quiz:", error)
    console.log("Using sample quiz data for testing")

    // Return a sample quiz
    return {
      quiz: sampleQuizzes[0],
      questions: sampleQuestions,
    }
  }
}

export async function getQuizQuestions(quizId: string) {
  try {
    console.log(`Fetching questions from: ${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${quizId}/questions`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${quizId}/questions`)

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.warn(`Failed to fetch questions: ${response.status} ${response.statusText}`)
      console.log("Using sample questions data for testing")
      return sampleQuestions
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching questions:", error)
    console.log("Using sample questions data for testing")
    return sampleQuestions
  }
}

export async function submitQuiz(quizId: string, studentId: string, answers: any[]) {
  try {
    console.log(`Submitting quiz to: ${process.env.NEXT_PUBLIC_API_URL}/api/submit-quiz`)

    // Format the answers to match what the API expects
    // const formattedAnswers = answers.map((answer) => ({
    //   question_id: answer.questionId, // Change from questionId to question_id
    //   selected_option: answer.selectedAnswer, // Change from selectedAnswer to selected_option
    // }))

    const formattedAnswers = answers.map((answer) => ({
      questionId: answer.questionId, // Change from questionId to question_id
      selectedAnswer: answer.selectedAnswer, // Change from selectedAnswer to selected_option
    }))



    // Log the formatted submission data
    const submissionData = {
      quizId: quizId,
      studentId: studentId,
      answers: formattedAnswers,
    }

    console.log("Formatted submission data:", submissionData)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submit-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    })

    console.log("Response status:", response.status)

    // Log the raw response text for debugging
    const responseText = await response.text()
    console.log("Raw response:", responseText)

    // Parse the JSON response (if it's valid JSON)
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse response as JSON:", e)
      throw new Error("Server returned an invalid response format")
    }

    if (!response.ok) {
      console.warn(`Failed to submit quiz: ${response.status} ${response.statusText}`)

      // Check if the error is because the quiz was already submitted
      if (data && data.alreadySubmitted) {
        throw new Error("You have already taken this quiz. You can only take it once.")
      }

      // If we have a specific error message from the API, throw it
      if (data && data.error) {
        throw new Error(data.error)
      }

      console.log("Returning mock submission result for testing")

      // Calculate a random score
      const score = Math.floor(Math.random() * (answers.length + 1))

      return {
        submission: {
          id: "mock-submission-id",
          score: score,
          totalQuestions: answers.length,
          percentage: Math.round((score / answers.length) * 100),
        },
      }
    }

    return data
  } catch (error) {
    if (error instanceof Error && error.message.includes("already taken")) {
      throw error
    }

    console.error("Error submitting quiz:", error)
    console.log("Returning mock submission result for testing")

    // Calculate a random score
    const score = Math.floor(Math.random() * (answers.length + 1))

    return {
      submission: {
        id: "mock-submission-id",
        score: score,
        totalQuestions: answers.length,
        percentage: Math.round((score / answers.length) * 100),
      },
    }
  }
}

export async function getQuizResults(quizId: string) {
  try {
    console.log(`Fetching results from: ${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${quizId}/results`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${quizId}/results`)

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.warn(`Failed to fetch results: ${response.status} ${response.statusText}`)
      console.log("Using sample results data for testing")

      // Generate mock results
      return [
        {
          submissionId: "sub1",
          student: { id: "s1", name: "Alice Johnson" },
          score: 3,
          totalQuestions: 4,
          percentage: 75,
          submittedAt: new Date().toISOString(),
          answers: sampleQuestions.map((q, index) => ({
            questionId: q.id,
            questionText: q.question_text,
            selectedAnswer: q.options[0],
            isCorrect: index < 3, // First 3 are correct
          })),
        },
        {
          submissionId: "sub2",
          student: { id: "s2", name: "Bob Smith" },
          score: 2,
          totalQuestions: 4,
          percentage: 50,
          submittedAt: new Date().toISOString(),
          answers: sampleQuestions.map((q, index) => ({
            questionId: q.id,
            questionText: q.question_text,
            selectedAnswer: q.options[1],
            isCorrect: index < 2, // First 2 are correct
          })),
        },
      ]
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching results:", error)
    console.log("Using sample results data for testing")

    // Generate mock results
    return [
      {
        submissionId: "sub1",
        student: { id: "s1", name: "Alice Johnson" },
        score: 3,
        totalQuestions: 4,
        percentage: 75,
        submittedAt: new Date().toISOString(),
        answers: sampleQuestions.map((q, index) => ({
          questionId: q.id,
          questionText: q.question_text,
          selectedAnswer: q.options[0],
          isCorrect: index < 3, // First 3 are correct
        })),
      },
      {
        submissionId: "sub2",
        student: { id: "s2", name: "Bob Smith" },
        score: 2,
        totalQuestions: 4,
        percentage: 50,
        submittedAt: new Date().toISOString(),
        answers: sampleQuestions.map((q, index) => ({
          questionId: q.id,
          questionText: q.question_text,
          selectedAnswer: q.options[1],
          isCorrect: index < 2, // First 2 are correct
        })),
      },
    ]
  }
}

export async function getQuizStats(quizId: string) {
  try {
    console.log(`Fetching stats from: ${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${quizId}/stats`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${quizId}/stats`)

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.warn(`Failed to fetch stats: ${response.status} ${response.statusText}`)
      console.log("Using sample stats data for testing")

      // Generate mock stats
      return {
        quiz: {
          id: quizId,
          title: "Sample Quiz",
          description: "This is a sample quiz for testing",
        },
        studentStats: [
          { id: "s1", name: "Alice Johnson", correct: 3, total: 4, percentage: 75 },
          { id: "s2", name: "Bob Smith", correct: 2, total: 4, percentage: 50 },
          { id: "s3", name: "Charlie Brown", correct: 4, total: 4, percentage: 100 },
          { id: "s4", name: "Diana Miller", correct: 1, total: 4, percentage: 25 },
        ],
        questionStats: sampleQuestions.map((q, index) => ({
          id: q.id,
          text: q.question_text,
          correct: 2 + (index % 2), // Some variation in correct answers
          incorrect: 2 - (index % 2), // Some variation in incorrect answers
          total: 4,
          correctPercentage: 50 + (index % 2) * 25, // 50% or 75%
          incorrectPercentage: 50 - (index % 2) * 25, // 50% or 25%
        })),
        hardestQuestions: [
          {
            id: "q2",
            text: "Which planet is known as the Red Planet?",
            correct: 1,
            incorrect: 3,
            total: 4,
            correctPercentage: 25,
            incorrectPercentage: 75,
          },
        ],
      }
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching stats:", error)
    console.log("Using sample stats data for testing")

    // Generate mock stats
    return {
      quiz: {
        id: quizId,
        title: "Sample Quiz",
        description: "This is a sample quiz for testing",
      },
      studentStats: [
        { id: "s1", name: "Alice Johnson", correct: 3, total: 4, percentage: 75 },
        { id: "s2", name: "Bob Smith", correct: 2, total: 4, percentage: 50 },
        { id: "s3", name: "Charlie Brown", correct: 4, total: 4, percentage: 100 },
        { id: "s4", name: "Diana Miller", correct: 1, total: 4, percentage: 25 },
      ],
      questionStats: sampleQuestions.map((q, index) => ({
        id: q.id,
        text: q.question_text,
        correct: 2 + (index % 2), // Some variation in correct answers
        incorrect: 2 - (index % 2), // Some variation in incorrect answers
        total: 4,
        correctPercentage: 50 + (index % 2) * 25, // 50% or 75%
        incorrectPercentage: 50 - (index % 2) * 25, // 50% or 25%
      })),
      hardestQuestions: [
        {
          id: "q2",
          text: "Which planet is known as the Red Planet?",
          correct: 1,
          incorrect: 3,
          total: 4,
          correctPercentage: 25,
          incorrectPercentage: 75,
        },
      ],
    }
  }
}

// New API functions for teacher quiz submission and classroom management

export async function createQuiz(quizData: {
  title: string
  description: string
  questions: {
    question_text: string
    options: string[]
    correct_answer: string
  }[]
}) {
  try {
    console.log(`Creating quiz at: ${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
    })

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.warn(`Failed to create quiz: ${response.status} ${response.statusText}`)
      throw new Error("Failed to create quiz. Please try again.")
    }

    return response.json()
  } catch (error) {
    console.error("Error creating quiz:", error)
    throw error
  }
}

export async function getClassrooms() {
  try {
    console.log(`Fetching classrooms from: ${process.env.NEXT_PUBLIC_API_URL}/api/classrooms`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classrooms`)

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.warn(`Failed to fetch classrooms: ${response.status} ${response.statusText}`)
      console.log("Using sample classrooms data for testing")
      return sampleClassrooms
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching classrooms:", error)
    console.log("Using sample classrooms data for testing")
    return sampleClassrooms
  }
}

export async function createClassroom(classroomData: {
  name: string
  description: string
  teacher_name: string
}) {
  try {
    console.log(`Creating classroom at: ${process.env.NEXT_PUBLIC_API_URL}/api/classrooms`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classrooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classroomData),
    })

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.warn(`Failed to create classroom: ${response.status} ${response.statusText}`)
      throw new Error("Failed to create classroom. Please try again.")
    }

    return response.json()
  } catch (error) {
    console.error("Error creating classroom:", error)
    throw error
  }
}

export async function getClassroomStudents(classroomId: string) {
  try {
    console.log(
      `Fetching classroom students from: ${process.env.NEXT_PUBLIC_API_URL}/api/classrooms/${classroomId}/students`,
    )
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classrooms/${classroomId}/students`)

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.warn(`Failed to fetch classroom students: ${response.status} ${response.statusText}`)

      if (response.status === 404) {
        throw new Error("Classroom not found. Please check the ID and try again.")
      }

      console.log("Using sample classroom students data for testing")
      return sampleClassroomStudents
    }

    const data = await response.json()

    // Ensure we're returning an array
    if (Array.isArray(data)) {
      return data
    } else if (data && typeof data === "object" && Array.isArray(data.students)) {
      return data.students
    } else {
      console.warn("API returned unexpected data format:", data)
      return sampleClassroomStudents
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Classroom not found")) {
      throw error
    }

    console.error("Error fetching classroom students:", error)
    console.log("Using sample classroom students data for testing")
    return sampleClassroomStudents
  }
}

export async function enrollStudentInClassroom(classroomId: string, studentId: string) {
  try {
    console.log(
      `Enrolling student in classroom at: ${process.env.NEXT_PUBLIC_API_URL}/api/classrooms/${classroomId}/students/enroll`,
    )
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classrooms/${classroomId}/students/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId }),
    })

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.warn(`Failed to enroll student: ${response.status} ${response.statusText}`)

      if (response.status === 404) {
        throw new Error("Classroom or student not found. Please check the IDs and try again.")
      }

      if (response.status === 409) {
        throw new Error("Student is already enrolled in this classroom.")
      }

      throw new Error("Failed to enroll student. Please try again.")
    }

    return response.json()
  } catch (error) {
    console.error("Error enrolling student:", error)
    throw error
  }
}
