import { instituteMockData } from "./mock/institute";
import { studentMockData } from "./mock/student";
import { teacherMockData } from "./mock/teacher";
import { Axios } from "axios";

function getToken() {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
}


export const axios = new Axios({
    baseURL: process.env.API_URL || "http://localhost:3333",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    },
});
export class DatabaseFetcher {
    async getInstituteHome(instituteId) {
        const allUsers = JSON.parse((await axios.get(`/institutions/${instituteId}/users`)).data);
        const allProducts = JSON.parse((await axios.get("/products")).data);
        const allActions = JSON.parse((await axios.get("/actions")).data);

        const instituteProducts = allProducts.filter((product: any) => product.instituteId === instituteId);
        const instituteActions = allActions.filter((action: any) => action.instituteId === instituteId);
        const instituteStudents = allUsers.filter((user: any) => user.role === "student" && user.instituteId === instituteId);
        const instituteTeachers = allUsers.filter((user: any) => user.role === "teacher" && user.instituteId === instituteId);

        return {
            teachers: instituteTeachers.length,
            activeProducts: instituteProducts.length,
            actionsTaken: instituteActions.length,
            students: instituteStudents.length
        }
    }
    async getInstituteTeachers(instituteId) {
        const allUsers = (await axios.get("/users")).data;
        const instituteTeachers = allUsers.data.filter((user: any) => user.role === "teacher");

        return {
            teachers: instituteTeachers
        }
    }
    async getInstituteProducts(instituteId) {
        const allProducts = (await axios.get("/products")).data;
        const instituteProducts = allProducts.data.filter((product: any) => product.instituteId === instituteId);

        return {
            products: instituteProducts
        }
    }
    async getInstituteActions(instituteId) {
        const allActions = (await axios.get("/actions")).data;
        const instituteActions = allActions.data.filter((action: any) => action.instituteId === instituteId);
        return {
            actions: instituteActions
        }
    }
    async getInstituteStudents(instituteId) {
        const allUsers = (await axios.get("/users")).data;
        const instituteStudents = allUsers.data.filter((user: any) => user.role === "student" && user.instituteId === instituteId);

        return {
            students: instituteStudents
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