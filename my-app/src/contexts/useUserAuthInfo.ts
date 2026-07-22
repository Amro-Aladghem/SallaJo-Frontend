import {useContext} from "react";
import {UserAuthContext} from "./UserAuthContext";

export function useUserAuthInfo()  {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuthInfo must be used within a UserAuthProvider");
  }
  return context;
};