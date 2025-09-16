import { useConfigStore } from '@/store/configStore'
import InstituteUsersPage from '@/components/institute/pages/students'
import { DatabaseFetcher } from '@/gateway/database';

const database = new DatabaseFetcher();

export default async function UserPage() {
  const role = await database.getRole();
  const {instituteId} = searchParams;

  if (role === "institute") {
    const { students } = await database.getInstituteStudents(instituteId);
    return <InstituteUsersPage students={students} />;
  }

  return <div>Ops deu um erro</div>
}
