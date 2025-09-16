import InstituteProfessorsPage from '@/components/institute/pages/teachers'
import { DatabaseFetcher } from '@/gateway/database';

const database = new DatabaseFetcher();

export default async function ProfessorsPage() {
 const role = await database.getRole();

  if (role === "institute") {
    const { teachers } = await database.getInstituteTeachers();
    return <InstituteProfessorsPage teachers={teachers} />;
  }

  return <div>Ops deu um erro</div>
}
