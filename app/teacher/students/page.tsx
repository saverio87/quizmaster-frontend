import type { Metadata } from "next"
import StudentsPageClient from "./students-client"

export const metadata: Metadata = {
    title: "Manage Students",
    description: "Create, view, and manage students",
}

export default function StudentsPage() {
    return <StudentsPageClient />
}
