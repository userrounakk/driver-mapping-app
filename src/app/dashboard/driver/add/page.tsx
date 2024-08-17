"use client";
import { setToast } from "@/helper/toast";
import { addDriver } from "@/services/driver";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function AddDriver() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [showMap, setShowMap] = useState(false);
  const [locationName, setLocationName] = useState("");

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setShowMap(false);
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);
    if (
      !nameRef.current ||
      !emailRef.current ||
      !phoneRef.current ||
      !passwordRef.current ||
      !confirmPasswordRef.current
    ) {
      setSubmitting(false);
      return toast.error("Something went wrong");
    }
    if (
      !nameRef.current.value ||
      !emailRef.current.value ||
      !phoneRef.current.value ||
      !passwordRef.current.value ||
      !confirmPasswordRef.current.value
    ) {
      setSubmitting(false);
      return toast.error("All fields are required");
    }
    if (phoneRef.current.value.length !== 10) {
      setSubmitting(false);
      return toast.error("Phone number must be 10 digits");
    }

    const passPattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
    );
    if (!passPattern.test(passwordRef.current.value)) {
      setSubmitting(false);
      return toast.error(
        "Password must contain at least 8 characters, including UPPER/lowercase and numbers"
      );
    }

    const emailPattern = new RegExp(
      "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
    );
    if (!emailPattern.test(emailRef.current.value)) {
      setSubmitting(false);
      return toast.error("Invalid Email");
    }

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setSubmitting(false);
      return toast.error("Password and Confirm Password must be same");
    }
    if (location.lat === 0 || location.lng === 0) {
      setSubmitting(false);
      return toast.error("Please select location");
    }
    try {
      const driver = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        password: passwordRef.current.value,
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
      };
      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("Please Sign in to continue");
      }
      const res = await addDriver(token, driver);
      if (!res?.error) {
        setToast("success", "Driver added successfully");
        window.location.href = "/dashboard/driver";
        return;
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong");
      setSubmitting(false);
    }
  }
  return (
    <div className="h-full overflow-y-scroll">
      <h1 className="text-xl font-bold">Add Driver</h1>
      <form className="max-w-full mx-auto bg-white p-8 rounded-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            ref={nameRef}
            type="text"
            id="name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
            Phone
          </label>
          <input
            ref={phoneRef}
            type="text"
            id="phone"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            ref={passwordRef}
            type="password"
            id="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-bold mb-2"
          >
            Confirm Password
          </label>
          <input
            ref={confirmPasswordRef}
            type="password"
            id="confirmPassword"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-gray-700 font-bold mb-2"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            value={locationName}
            onClick={() => setShowMap(true)}
            contentEditable={false}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showMap && (
            <div className="mt-4">
              <MapWithNoSSR
                center={[12.9055, 79.1318]}
                onClick={handleMapClick}
                setLocationName={setLocationName}
              />
            </div>
          )}
        </div>
        <div>
          <button
            onClick={
              submitting
                ? () => {
                    return;
                  }
                : handleSubmit
            }
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
