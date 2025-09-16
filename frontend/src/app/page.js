"use client"

import InstituteHome from "@/components/institute/pages/home";
import ProfessorHome from "@/components/teacher/pages/home";
import StudentHome from "@/components/student/pages/home";
import { DatabaseFetcher } from "@/gateway/database";
import { useEffect, useState } from "react";

const database = new DatabaseFetcher();

export default function Home() {
    const  [role, setRole] = useState(null);
    const [institute, setInstitute] = useState({});
    const [teacher, setTeacher] = useState({});
    const [student, setStudent] = useState({});
    const [token, setToken] = useState(null);

    const searchParams = new URLSearchParams(window.location.search);
    const {instituteId} = searchParams;

    useEffect(() => {
        const fetchRole = async () => {
            const role = await database.getRole();
            setRole(role);
            const token = localStorage.getItem("token");
            setToken(token);
            if (role === "institute") {
                const instituteData = await database.getInstituteDetails();
                setInstitute(instituteData);
            } else if (role === "teacher") {
                const teacherData = await database.getTeacherDetails();
                setTeacher(teacherData);
            } else if (role === "student") {
                const studentData = await database.getStudentDetails();
                setStudent(studentData);
            }
        };
        fetchRole();
    }, []);

    if (instituteId) {
        return <InstituteHome data={institute.dashboard} />;
    }
    else if (role === "teacher") {
        return <ProfessorHome actions={teacher.actions} students={teacher.students} />;
    }
    else if (role === "student") {
        return <StudentHome recentActions={student.recentActions} balance={student.balance} />;
    }

    return <div>Ops deu um erro</div>
}
