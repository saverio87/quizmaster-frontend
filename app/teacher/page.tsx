import type { Metadata } from "next"
import TeacherDashboardClient from "./teacher-dashboard-client"

export const metadata: Metadata = {
  title: "Teacher Dashboard",
  description: "Teacher dashboard for Quiz Master",
}

export default function TeacherDashboardPage() {
  return <TeacherDashboardClient />
}