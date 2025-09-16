"use client";

import { useConfigStore } from '@/store/configStore'
import InstituteUsersPage from '@/components/institute/pages/students'
import { DatabaseFetcher } from '@/gateway/database';
import { useEffect, useState } from 'react';

const database = new DatabaseFetcher();

export default function UserPage() {
    const [role, setRole] = useState(null);
    const [institute, setInstitute] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const instituteId = localStorage.getItem("instituteId");
        (async () => {
            try {
                const role = await database.getRole();
                const instituteData = await database.getInstituteStudents(instituteId);
                console.log(instituteData);
                setRole(role);
                setInstitute(instituteData);
            } catch (error) {
                console.error('Error loading student data:', error);
            } finally {
                setLoading(false);
            }
        })()
    }, [])

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (role === "institute" && institute) {
    const { students } = institute;
    return <InstituteUsersPage students={students} />;
  }

  return <div>Ops deu um erro</div>
}
