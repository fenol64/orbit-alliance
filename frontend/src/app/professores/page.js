"use client"

import { useConfigStore } from '@/store/configStore'
import InstituteProfessorsPage from '@/components/institute/pages/professors'

export default function ProfessorsPage() {
  const { role } = useConfigStore();

  if (role === "institute") return <InstituteProfessorsPage />;

  return <div>Ops deu um erro</div>
}
