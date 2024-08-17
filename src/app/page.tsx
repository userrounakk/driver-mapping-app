"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, []);
  return (
    <div className="flex items-center justify-center h-full">
      Welcome to Motorq
    </div>
  );
}
