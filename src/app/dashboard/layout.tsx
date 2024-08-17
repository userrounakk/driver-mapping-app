"use client";
import Sidebar from "@/components/Sidebar";
import Nav from "@/components/Nav";
import { useEffect, useState } from "react";
import { ShowToast } from "@/helper/toast";
import { ToastContainer } from "react-toastify";
import Loading from "@/components/Loading";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [hasToast, setHasToast] = useState(false);
  const [message, setMessage] = useState({});

  useEffect(() => {
    if (hasToast) {
      sessionStorage.setItem("toast", "true");
      sessionStorage.setItem("message", JSON.stringify(message));
      window.location.href = "/login";
    }
  }, [hasToast, message]);

  return (
    <>
      <ToastContainer />
      <ShowToast />
      <Sidebar />
      <Nav />
      <main className="md:w-[77%] w-full fixed left-0 md:top-28 top-[3.1rem] md:left-[22%] -z-1 md:rounded-xl md:shadow-xl  md:h-[87.5vh] h-[92%] bg-white md:p-10 p-2">
        {children}
      </main>
    </>
  );
}
