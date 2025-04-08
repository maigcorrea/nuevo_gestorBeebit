'use client';
import TasksTab from "@/components/TasksTab";
import ProjectTab from "@/components/ProjectTab"
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useContext } from 'react';
import OptionButtons from "@/components/OptionButtons";
import { UserContext } from '@/app/context/UserContext';
import ProtectRoutes from "@/components/ProtectRoutes";
import PomodoroTimer from "@/components/PomodoroTimer";
import WelcomeMessage from "@/components/WelcomeMessage";

export default function Home() {
  const { userType } = useContext(UserContext);
  const { setUserType } = useContext(UserContext);

  // Obtener tareas del usuario
  

  return (
    <>
    <ProtectRoutes>
      <div className="flex mb-[80px]">
        <WelcomeMessage></WelcomeMessage>
        <PomodoroTimer></PomodoroTimer>
      </div>
      <TasksTab></TasksTab>
      <ProjectTab></ProjectTab>
      {userType==="admin" ? <OptionButtons></OptionButtons> :null}
    </ProtectRoutes>
    </>
  );
}
