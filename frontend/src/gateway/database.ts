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
let token = null;

export const axios = new Axios({
    baseURL: process.env.API_URL || "http://localhost:3333",
    headers: {
        "Content-Type": "application/json",
    },
});

axios.interceptors.request.use(config => {
    const token = getToken();
    console.log("Adding token to header:", token);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
export class DatabaseFetcher {
    async getInstituteHome(instituteId) {
        const usersResponse = await axios.get(`/institutions/${instituteId}/users`);
        const institutionUsers = JSON.parse(usersResponse.data).data;
        const allProducts = JSON.parse((await axios.get("/products")).data).data;
        const allActions = JSON.parse((await axios.get("/actions")).data).data;
        console.log("Institution Users:", institutionUsers);
        console.log("All Products:", allProducts);
        console.log("All Actions:", allActions);
        const instituteProducts = allProducts.filter((product: any) => product.instituteId === instituteId);
        const instituteActions = allActions.filter((action: any) => action.instituteId === instituteId);
        const instituteStudents = institutionUsers.filter((iu: any) => iu.role === "student");
        const instituteTeachers = institutionUsers.filter((iu: any) => iu.role === "teacher");

        return {
            teachers: instituteTeachers.length,
            activeProducts: instituteProducts.length,
            actionsTaken: instituteActions.length,
            students: instituteStudents.length
        }
    }
    async getInstituteTeachers(instituteId) {
        const response = await axios.get(`/institutions/${instituteId}/users`);
        const institutionUsers = JSON.parse(response.data).data;
        const instituteTeachers = institutionUsers.filter((iu: any) => iu.role === "teacher");

        return {
            teachers: instituteTeachers.map((iu: any) => iu.user)
        }
    }
    async getInstituteProducts(instituteId) {
        const allProducts = JSON.parse((await axios.get("/products")).data).data;
        const instituteProducts = allProducts.filter((product: any) => product.instituteId === instituteId);

        return {
            products: instituteProducts
        }
    }
    async getInstituteActions(instituteId) {
        const allActions = JSON.parse((await axios.get("/actions")).data).data;
        const instituteActions = allActions.filter((action: any) => action.instituteId === instituteId);
        return {
            actions: instituteActions
        }
    }
    async getInstituteStudents(instituteId) {
        const response = await axios.get(`/institutions/${instituteId}/users`);
        const institutionUsers = JSON.parse(response.data).data;
        const instituteStudents = institutionUsers.filter((iu: any) => iu.role === "student");

        return {
            students: instituteStudents.map((iu: any) => iu.user)
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