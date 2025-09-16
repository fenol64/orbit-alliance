"use client";

import InstituteActionsPage from '@/components/institute/pages/actions';
import StudentActionsPage from '@/components/student/pages/actions';
import { DatabaseFetcher } from '@/gateway/database';
import { useConfigStore } from '@/store/configStore'
import { useEffect, useState } from 'react';

const database = new DatabaseFetcher();

export default function ActionsPage() {
    const [role, setRole] = useState(null);
    const [institute, setInstitute] = useState(null);
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const instituteId = localStorage.getItem("instituteId");
        (async () => {
            const role = await database.getRole();
            const instituteData = await database.getInstituteActions();
            const studentData = await database.getStudentActions(instituteId);
            setRole(role);
            setInstitute(instituteData);
            setStudent(studentData);
        })()
    }, [])

    if (role === "institute") {
        const { actions } = institute;
        return <InstituteActionsPage actions={actions} />;
    }
    else if (role === "student") {
        const { avaliableActions, inProgressActions } = student;
        return <StudentActionsPage avaliableActions={avaliableActions} inProgressActions={inProgressActions} />;
    }

    return <div>Ops deu um erro</div>
}
