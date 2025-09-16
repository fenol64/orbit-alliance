"use client"

import { useConfigStore } from '@/store/configStore'
import InstituteProductsPage from '@/components/institute/pages/products'

export default function ProductsPage() {
    const { role } = useConfigStore();

    if (role === "institute") return <InstituteProductsPage />;

    return <div>Ops deu um erro</div>
}
