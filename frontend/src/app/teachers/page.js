import InstituteProfessorsPage from '@/components/institute/pages/teachers'
import { DatabaseFetcher } from '@/gateway/database';

const database = new DatabaseFetcher();

export default async function ProfessorsPage() {
 const role = await database.getRole();

  if (role === "institute") {
    const data = await database.getInstituteTeachers();
    return <InstituteProfessorsPage professors={data.teachers} />;
  }

  return <div>Ops deu um erro</div>
}
