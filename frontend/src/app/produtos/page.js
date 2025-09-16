"use client"

import { useConfigStore } from '@/store/configStore'
import InstituteProductsPage from '@/components/institute/pages/products';
import StudentProductsPage from '@/components/student/pages/products';

export default function ProductsPage() {
    const { role } = useConfigStore();

    if (role === "institute") return <InstituteProductsPage />;
    else if (role === "student") return <StudentProductsPage />;

    return <div>Ops deu um erro</div>
}
