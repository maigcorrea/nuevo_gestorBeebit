'use client';
import TasksTab from "@/components/TasksTab";
import ProjectTab from "@/components/ProjectTab"
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useContext } from 'react';
import OptionButtons from "@/components/OptionButtons";
import { UserContext } from '@/app/context/UserContext';
import ProtectRoutes from "@/components/ProtectRoutes";

export default function Home() {
  const { userType } = useContext(UserContext);
  const { setUserType } = useContext(UserContext);

  return (
    <>
    <ProtectRoutes>
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
      <TasksTab></TasksTab>
      <ProjectTab></ProjectTab>
      {userType==="admin" ? <OptionButtons></OptionButtons> :null}
    </ProtectRoutes>
    </>
  );
}
