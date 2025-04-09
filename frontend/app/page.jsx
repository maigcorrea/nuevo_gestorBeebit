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
import ButtonEmail from "@/components/ButtonEmail";
import ProjectCalendar from "@/components/ProjectCalendar";
import { TaskSummaryProvider } from "./context/TaskSummaryContext";

export default function Home() {
  const { userType } = useContext(UserContext);
  const { setUserType } = useContext(UserContext);

  // Obtener tareas del usuario
  

  return (
    <>
    <ProtectRoutes>
        <div className="flex mb-[80px] flex-wrap gap-2">
          <WelcomeMessage></WelcomeMessage>
          <ProjectCalendar></ProjectCalendar>
        </div>
        <div className="mb-[100px]">
          <PomodoroTimer></PomodoroTimer>
        </div>
        <div>
          <TasksTab></TasksTab>
          <ProjectTab></ProjectTab>
        </div>
        {userType==="admin" ? <OptionButtons></OptionButtons> :null}
        <ButtonEmail></ButtonEmail>
    </ProtectRoutes>
    </>
  );
}
