import InstituteProfessorsPage from '@/components/institute/pages/teachers'
import { DatabaseFetcher } from '@/gateway/database';

const database = new DatabaseFetcher();

export default async function ProfessorsPage(searchParams) {
 const role = await database.getRole();
 const {instituteId} = searchParams;

  if (role === "institute") {
    const { teachers } = await database.getInstituteTeachers(instituteId);
    return <InstituteProfessorsPage teachers={teachers} />;
  }

  return <div>Ops deu um erro</div>
}
