"use client"

import { useConfigStore } from '@/store/configStore'
import InstituteUsersPage from '@/components/institute/pages/students'

export default function UserPage() {
  const { role } = useConfigStore();

  if (role === "institute") return <InstituteUsersPage />;

  return <div>Ops deu um erro</div>
}
