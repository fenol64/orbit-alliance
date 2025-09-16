"use client";

import { useConfigStore } from "@/store/configStore";
import InstituteLogin from "@/components/institute/pages/login";

export default function Login() {
    const { role } = useConfigStore();

    if (role === "institute") return <InstituteLogin />;
    else if (role === "professor") return <div>Ops deu um erro</div>;
    else if (role === "student") return <div>Ops deu um erro</div>;

    return <div>Ops deu um erro</div>;
}
