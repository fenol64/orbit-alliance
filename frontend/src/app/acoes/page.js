"use client"

import InstituteActionsPage from '@/components/institute/pages/actions';
import { useConfigStore } from '@/store/configStore'

export default function ActionsPage() {
    const { role } = useConfigStore();

    if (role === "institute") return <InstituteActionsPage />;

    return <div>Ops deu um erro</div>
}
