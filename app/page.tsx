import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">QuizMaster</h1>
        <p className="text-xl mb-12 text-gray-600">
          Test your knowledge and challenge yourself with interactive quizzes
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link href="/student">
            <Button size="lg" className="w-full md:w-auto px-8 py-6 text-lg">
              Student Mode
            </Button>
          </Link>
          <Link href="/teacher">
            <Button size="lg" variant="outline" className="w-full md:w-auto px-8 py-6 text-lg">
              Teacher Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
