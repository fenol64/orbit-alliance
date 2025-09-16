import { instituteMockData } from "./mock/institute";
import { studentMockData } from "./mock/student";
import { teacherMockData } from "./mock/teacher";

export class DatabaseFetcher {
    async getInstituteDashboard() {
        return {
            dashboard: instituteMockData.dashboard
        }
    }
    async getInstituteTeachers() {
        return {
            teachers: instituteMockData.teachers
        }
    }
    async getInstituteProducts() {
        return {
            products: instituteMockData.products
        }
    }
    async getInstituteActions() {
        return {
            actions: instituteMockData.actions
        }
    }
    async getInstituteStudents() {
        return {
            students: instituteMockData.students
        }
    }

    async getTeacherHome() {
        return {
            actions: teacherMockData.actions,
            students: teacherMockData.students,
        }
    }

    async getStudentHome() {
        return {
            recentActions: studentMockData.recentActions,
            balance: studentMockData.balance,
        }
    }
    async getStudentProducts() {
        return {
            products: studentMockData.products,
            balance: studentMockData.balance.totalPoints,
        }
    }
    async getStudentActions() {
        return {
            avaliableActions: studentMockData.avaliableActions,
            inProgressActions: studentMockData.inProgressActions,
        }
    }


    async getRole() {
        return "institute"; // Possible values: "institute", "teacher", "student"
    }
}