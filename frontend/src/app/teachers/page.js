"use client";

import InstituteProfessorsPage from "@/components/institute/pages/teachers";
import { DatabaseFetcher } from "@/gateway/database";
import { useEffect, useState } from "react";

const database = new DatabaseFetcher();

export default function ProfessorsPage() {
  const [role, setRole] = useState(null);
  const [institute, setInstitute] = useState(null);

  useEffect(() => {
    const instituteId = localStorage.getItem("instituteId");
    (async () => {
      const data = await database.getInstituteTeachers(instituteId);
      const role = await database.getRole();
      setInstitute(data);
      setRole(role);
    })();
  }, []);

  if (role === "institute") {
    const { teachers } = institute;
    return <InstituteProfessorsPage teachers={teachers} />;
  }

  return <div>Ops deu um erro</div>;
}
