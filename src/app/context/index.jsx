"use client"

import { createContext, useEffect, useState } from "react";
import { initialSignInFormData, initialSignUpFormData, initialUpdateFormData } from "@/app/config";
import { uploadFile } from "../api/uploadImg";
import { toast, Toaster } from "sonner";
import { AuthProvider } from "./AuthContext";

export const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <Context.Provider value={{}}>
        <Toaster position="top-right" richColors />
        {children}
      </Context.Provider>
    </AuthProvider>
  );
};