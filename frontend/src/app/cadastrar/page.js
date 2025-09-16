"use client"

import { useConfigStore } from '@/store/configStore'
import InstituteRegister from '@/components/institute/pages/register'

export default function Cadastrar() {
    const { role } = useConfigStore();

    if (role === "institute") return <InstituteRegister />;
    else if (role === "professor") return <div>Ops deu um erro</div>;
    else if (role === "student") return <div>Ops deu um erro</div>;
}
