import InstituteProductsPage from '@/components/institute/pages/products';
import StudentProductsPage from '@/components/student/pages/products';
import { DatabaseFetcher } from '@/gateway/database';

const database = new DatabaseFetcher();

export default async function ProductsPage() {
    const role = await database.getRole();

    if (role === "institute") {
        const products = await database.getInstituteProducts();
        return <InstituteProductsPage products={products} />;
    }
    else if (role === "student") {
        const {products, balance, cart} = await database.getStudentProducts();
        return <StudentProductsPage products={products} balance={balance} cart={cart} />;
    }

    return <div>Ops deu um erro</div>
}
