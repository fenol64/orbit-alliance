"use client";

import InstituteHome from "@/components/institute/pages/home";
import ProfessorHome from "@/components/professor/pages/home";
import ProfessorDashboardLayout from "@/components/professor/layouts/dashboard-layout";
import StudentHome from "@/components/student/pages/home";
import StudentDashboardLayout from "@/components/student/layouts/dashboard-layout";
import { useConfigStore } from "@/store/configStore";

export default function Home() {
    const { role } = useConfigStore();

    return (
        <>
            {role === "institute" && (
                <InstituteHome />
            )}
            {role === "professor" && (
                <ProfessorDashboardLayout>
                    <ProfessorHome />
                </ProfessorDashboardLayout>
            )}
            {role === "student" && (
                <StudentDashboardLayout>
                    <StudentHome />
                </StudentDashboardLayout>
            )}
        </>
    );
}
