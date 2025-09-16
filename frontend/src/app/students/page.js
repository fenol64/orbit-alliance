"use client";

import { useConfigStore } from '@/store/configStore'
import InstituteUsersPage from '@/components/institute/pages/students'
import { DatabaseFetcher } from '@/gateway/database';
import { useEffect, useState } from 'react';

const database = new DatabaseFetcher();

export default function UserPage() {
    const [role, setRole] = useState(null);
    const [institute, setInstitute] = useState(null);
    const {instituteId} = useConfigStore();

    useEffect(() => {
        (async () => {
            const role = await database.getRole();
            const instituteData = await database.getInstituteStudents(instituteId);
            setRole(role);
            setInstitute(instituteData);
        })()
    }, [])

  if (role === "institute") {
    const { students } = institute;
    return <InstituteUsersPage students={students} />;
  }

  return <div>Ops deu um erro</div>
}
