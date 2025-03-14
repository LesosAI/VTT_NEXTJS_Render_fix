"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import Cookies from 'js-cookie';  // You'll need to install this package

interface LoginContextProps {
  isLoggedIn: boolean;
  username: string;
  isSubaccount: boolean;
  login: (user: string, isSubaccount: boolean) => void;
  logout: () => void;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export const useLogin = (): LoginContextProps => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Check if we're in a browser environment first
    if (typeof window !== 'undefined') {
      // Remove the token check since we're not using it yet
      return Cookies.get("isLoggedIn") === "true";
    }
    return false;
  });

  const [username, setUsername] = useState<string>(() => {
    // Check if we're in a browser environment first
    if (typeof window !== 'undefined') {
      return Cookies.get("username") || "";
    }
    return "";
  });

  const [isSubaccount, setIsSubaccount] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Cookies.get("isSubaccount") === "true";
    }
    return false;
  });

  const login = (user: string, isSubaccount: boolean) => {
    setIsLoggedIn(true);
    setUsername(user);
    setIsSubaccount(isSubaccount);
    
    Cookies.set("isLoggedIn", "true", { 
      secure: true,
      sameSite: 'strict',
      expires: 7
    });
    Cookies.set("username", user, {
      secure: true,
      sameSite: 'strict',
      expires: 7
    });
    Cookies.set("isSubaccount", isSubaccount.toString(), {
      secure: true,
      sameSite: 'strict',
      expires: 7
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setIsSubaccount(false);
    Cookies.remove("isLoggedIn");
    Cookies.remove("username");
    Cookies.remove("isSubaccount");
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, username, isSubaccount, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
