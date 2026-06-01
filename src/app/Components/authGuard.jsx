"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [iseAuthenticated, setisAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicRoutes = ["/login", "/register"];
    if (!token) {
      if (!publicRoutes.includes(pathname)) {
        router.replace("/login");
      } else {
        setisAuthenticated(true);
      }
    } else {
      if (publicRoutes.includes(pathname)) {
        router.replace("/");
      } else {
        setisAuthenticated(true);
      }
    }
}, [pathname,router]);
if (!iseAuthenticated) {
  return <h1>Loading...</h1>;
}
  return <>{children}</>;
};

export default AuthGuard;
