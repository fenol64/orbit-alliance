"use client"

import InstituteHome from "@/components/institute/pages/home";
import ProfessorHome from "@/components/teacher/pages/home";
import StudentHome from "@/components/student/pages/home";
import { DatabaseFetcher } from "@/gateway/database";
import { useEffect, useState } from "react";
import { useConfigStore } from "@/store/configStore";


export default function Home() {
    const database = new DatabaseFetcher();
    const  [role, setRole] = useState(null);
    const [institute, setInstitute] = useState(null);
    const [teacher, setTeacher] = useState(null);
    const [student, setStudent] = useState(null);
    const { instituteId } = useConfigStore();

    useEffect(() => {
        const fetchRole = async () => {
            const role = await database.getRole();

            if (role === "institute") {
                const instituteData = await database.getInstituteHome(instituteId);
                setInstitute({ dashboard: instituteData });
            } else if (role === "teacher") {
                const teacherData = await database.getTeacherHome(instituteId);
                setTeacher(teacherData);
            } else if (role === "student") {
                const studentData = await database.getStudentHome(instituteId);
                setStudent(studentData);
            }
            setToken(token);
            setRole(role);
        };
        fetchRole();
    }, []);

    if (!institute && !teacher && !student) {
        return <div>Loading...</div>;
    }

    if (institute) {
        console.log("Role:", role);
        console.log("Institute Data:", institute);
        console.log("Teacher Data:", teacher);
        console.log("Student Data:", student);
        return <InstituteHome data={institute.dashboard} />;
    }
    else if (teacher) {
        return <ProfessorHome actions={teacher.actions} students={teacher.students} />;
    }
    else if (student) {
        return <StudentHome recentActions={student.recentActions} balance={student.balance} />;
    }

    return <div>Ops deu um erro</div>
}
