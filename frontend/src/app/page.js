import InstituteHome from "@/components/institute/pages/home";
import ProfessorHome from "@/components/teacher/pages/home";
import StudentHome from "@/components/student/pages/home";
import { getInstituteData } from "@/gateway/mock/institute";
import { DatabaseFetcher } from "@/gateway/database";

const database = new DatabaseFetcher();

export default async function Home() {
    const role = await database.getRole();


    if (role === "institute") {
        const dashboard = await database.getInstituteHome();
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
