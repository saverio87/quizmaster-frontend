import type { Metadata } from "next"
import SubmissionsClient from "./submissions-client"


export const metadata: Metadata = {
    title: "Real-time Quiz Submissions",
    description: "View student quiz submissions in real-time",
}

export default function SubmissionsPage() {
    return <SubmissionsClient />
}
