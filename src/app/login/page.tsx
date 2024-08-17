"use client";
import { BASE_URL } from "@/const/const";
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [type, setType] = useState("driver");
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const email = emailRef.current?.value;
    const password = passRef.current?.value;
    if (!email || !password) {
      toast.error("Email and Password are required");
      setSubmitting(false);
      return;
    }
    const raw = JSON.stringify({
      email: email,
      password: password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(`${BASE_URL}/${type}/login`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const data = JSON.parse(result);
        if (data.status == "success") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("type", type);
          localStorage.setItem("name", data.details.name);
          localStorage.setItem("email", data.details.email);
          localStorage.setItem("phone", data.details.phone);
          toast.success("Login Success");
          window.location.href = "/dashboard";
        } else {
          console.log(data);
          toast.error(data.message);
          setSubmitting(false);
        }
      })
      .catch((error) => {
        toast.error("Something went wrong.");
        console.log("error", error);
        setSubmitting(false);
      });
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto h-80 w-auto"
          src="/logo.svg"
          alt="Your Company"
          width={200}
          height={200}
        />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            className={`px-4 py-2 ${
              type == "driver"
                ? "bg-primary text-white"
                : "bg-gray-300 text-gray-900"
            } rounded-md`}
            onClick={() => setType("driver")}
          >
            Login as Driver
          </button>
          <button
            className={`px-4 py-2 ${
              type == "manager"
                ? "bg-primary text-white"
                : "bg-gray-300 text-gray-900"
            } rounded-md`}
            onClick={() => setType("manager")}
          >
            Login as Manager
          </button>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                ref={emailRef}
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                ref={passRef}
                required
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              onClick={submitting ? () => {} : handleSubmit}
              className={`flex w-full justify-center rounded-md ${
                submitting ? "bg-gray-800" : "bg-primary"
              } px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">Not a member?</p>
      </div>
    </div>
  );
}
