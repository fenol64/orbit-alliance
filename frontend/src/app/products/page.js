import InstituteProductsPage from '@/components/institute/pages/products';
import StudentProductsPage from '@/components/student/pages/products';
import { DatabaseFetcher } from '@/gateway/database';

const database = new DatabaseFetcher();

export default async function ProductsPage({searchParams}) {
    const role = await database.getRole();
    const {instituteId} = searchParams;

    if (role === "institute") {
        const { products } = await database.getInstituteProducts(instituteId);
        return <InstituteProductsPage products={products} />;
    }
    else if (role === "student") {
        const { products, balance } = await database.getStudentProducts();
        return <StudentProductsPage products={products} balance={balance} />;
    }

    return <div>Ops deu um erro</div>
}
