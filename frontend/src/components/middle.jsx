"use client";

import { useEffect } from "react";
import { useConfigStore } from "@/store/configStore";

export function Middle() {
    const { setInstituteId } = useConfigStore();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const instituteId = localStorage.getItem("instituteId");

        if (instituteId && token) {
            setInstituteId(instituteId);
        }
    }, [])

    return null;
}