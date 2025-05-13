// Sample data for testing when API fails

export const sampleStudents = [
    { id: "s1", name: "Alice Johnson" },
    { id: "s2", name: "Bob Smith" },
    { id: "s3", name: "Charlie Brown" },
    { id: "s4", name: "Diana Miller" },
    { id: "s5", name: "Edward Davis" },
]

export const sampleQuizzes = [
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

export const sampleQuestions = [
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

export const sampleClassrooms = [
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

export const sampleClassroomStudents = [
    {
        id: "c1",
        name: "MYP1",
        description: "Best class ever",
        teacherName: "Mr Jesse",
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },

]

export const sampleStudentsWithClassrooms = [
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