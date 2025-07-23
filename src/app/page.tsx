"use client";

import { Button } from "@/components/ui/button";
import { useLogin } from "@/context/LoginContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isLoggedIn, username } = useLogin();
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return null;
}
