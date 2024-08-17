"use client";
import { Driver } from "@/app/model/driver";
import Loading from "@/components/Loading";
import { setToast } from "@/helper/toast";
import { getDrivers } from "@/services/driver";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DriverPage() {
  const [page, setPage] = useState(1);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [dataFetched, setDataFetched] = useState("false");
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchDriver();
    }
    return () => {
      isMounted = false;
    };
  }, []);
  async function fetchDriver() {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast("error", "Please Sign in to continue");
      window.location.href = "/login";
      return;
    }
    const res = await getDrivers(token, page);
    console.log("res", res);

    if (!res?.error) {
      setDrivers(res.response.drivers);
      setTotalPages(res.response.totalPages);
      setDataFetched("true");
    }
    if (res?.error) {
      setError(true);
      toast.error(res.message.message);
      console.log("Error");
    }
  }
  if (dataFetched == "true") {
    return (
      <div className="">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-xl font-bold">Driver</h1>
          <a
            className="bg-primary text-white py-2 px-5 rounded-md"
            href="driver/add"
          >
            Add Driver
          </a>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Driver Id</th>
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
              <th className="border border-gray-200 px-4 py-2">Phone</th>
            </tr>
          </thead>
          <tbody className="h-80vh overflow-scroll">
            {drivers.map((driver) => (
              <tr key={driver._id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">
                  {driver.driverId}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {driver.name}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {driver.email}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {driver.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-5 w-full overflow-auto">
          <button
            className={`${
              page == 1 ? "bg-gray-500" : "bg-primary"
            } text-white py-2 px-5 rounded-md`}
            onClick={() => () => page > 1 && setPage(page - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`${
                i + 1 == page ? "bg-primary" : "bg-gray-500"
              }  text-white py-2 px-5 rounded-md mx-2`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={`${
              page == totalPages ? "bg-gray-500" : "bg-primary"
            } text-white py-2 px-5 rounded-md`}
            onClick={() => page < totalPages && setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    );
  } else if (error) {
    return <h1>Something went wrong</h1>;
  } else return <Loading />;
}
