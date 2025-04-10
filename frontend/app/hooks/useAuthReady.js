// /app/hooks/useAuthReady.js
import { useContext } from "react";
import { UserContext } from "@/app/context/UserContext";

export const useAuthReady = () => {
  const { token, isLoading } = useContext(UserContext);
  const ready = !!token && !isLoading;
  return { token, ready };
};