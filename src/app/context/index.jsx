"use client"

import { createContext, useEffect, useState } from "react";
import { initialSignInFormData, initialSignUpFormData, initialUpdateFormData } from "@/app/config";
import { uploadFile } from "../api/uploadImg";
import { toast, Toaster } from "sonner";
import { AuthProvider } from "./AuthContext";
import { LocationProvider } from "./LocationContext";
import { SocketProvider } from "./SocketContext";
import SocketConnectionIndicator from "@/components/SocketConnectionIndicator";

export const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <LocationProvider>
        <SocketProvider>
          <Context.Provider value={{}}>
            <Toaster position="top-right" richColors />
            <SocketConnectionIndicator />
            {children}
          </Context.Provider>
        </SocketProvider>
      </LocationProvider>
    </AuthProvider>
  );
};