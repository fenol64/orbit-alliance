"use client";

import InstituteHome from "@/components/institute/pages/home";
import ProfessorHome from "@/components/teacher/pages/home";
import StudentHome from "@/components/student/pages/home";
import { DatabaseFetcher } from "@/gateway/database";
import { cookies } from "next/headers";

const database = new DatabaseFetcher();

export default async function Home({searchParams}) {
    const role = await database.getRole();
    const {instituteId} = searchParams;
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (instituteId) {
        const {dashboard} = await database.getInstituteHome(instituteId);
        return <InstituteHome data={dashboard} />;
    }
    else if (role === "teacher") {
        const { actions, students } = await database.getTeacherHome();
        return <ProfessorHome actions={actions} students={students} />;
    }
    else if (role === "student") {
        const { recentActions, balance } = await database.getStudentHome();
        return <StudentHome recentActions={recentActions} balance={balance} />;
    }

    return <div>Ops deu um erro</div>
}
