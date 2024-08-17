"use client";
import Loading from "@/components/Loading";
import { setToast } from "@/helper/toast";
import { assign, getAssignment, reject } from "@/services/assignment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

export default function DriverPage() {
  const [page, setPage] = useState(1);
  const [tasks, setTasks] = useState<any[]>([]);
  const [dataFetched, setDataFetched] = useState("false");
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  async function redirect() {
    const role = localStorage.getItem("role");
    if (role == "manager") {
      window.location.href = "/dashboard/";
    }
  }
  useEffect(() => {
    redirect();
  }, []);
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchAssignment();
    }
    return () => {
      isMounted = false;
    };
  }, []);
  async function fetchAssignment() {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast("error", "Please Sign in to continue");
      window.location.href = "/login";
      return;
    }
    const res = await getAssignment(token, page);
    console.log("res", res);

    if (!res?.error) {
      setTasks(res.response.assignments);
      setTotalPages(res.response.totalPages);
      setDataFetched("true");
    }
    if (res?.error) {
      setError(true);
      toast.error(res.message.message);
      console.log("Error");
    }
  }
  const formatDateTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  async function handleAccept(id: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast("error", "Please Sign in to continue");
      window.location.href = "/login";
      return;
    }
    const res = await assign(token, id);
    if (!res?.error) {
      toast.success("Task Accepted");
      fetchAssignment();
    }
    if (res?.error) {
      toast.error(res.message.message);
    }
  }
  async function handleReject(id: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast("error", "Please Sign in to continue");
      window.location.href = "/login";
      return;
    }
    const res = await reject(token, id);
    if (!res?.error) {
      toast.success("Task Rejected");
      fetchAssignment();
    }
    if (res?.error) {
      toast.error(res.message.message);
    }
  }

  if (dataFetched == "true") {
    return (
      <div>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-xl font-bold">My Tasks</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">
                  Assigned By
                </th>
                <th className="border border-gray-200 px-4 py-2">Vehicle</th>
                <th className="border border-gray-200 px-4 py-2">Start Time</th>
                <th className="border border-gray-200 px-4 py-2">End Time</th>
                <th className="border border-gray-200 px-4 py-2">Status</th>
                <th className="border border-gray-200 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="h-80vh overflow-scroll">
              {tasks.length == 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="border border-gray-200 px-4 py-2 text-center"
                  >
                    No tasks found
                  </td>
                </tr>
              )}
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">
                    {task.managerId.name}
                  </td>
                  {/* <td className="border border-gray-200 px-4 py-2">
                    {task.location}
                  </td> */}
                  <td className="border border-gray-200 px-4 py-2">
                    {task.vehicle.model}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {formatDateTime(new Date(task.startTime))}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {formatDateTime(new Date(task.endTime))}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {task.status}
                  </td>
                  <td className="flex border border-gray-200 px-4 py-2 gap-2">
                    <button
                      className="border-green-600 border-2 rounded-md p-1 hover:bg-green-600 hover:text-white"
                      onClick={() => handleAccept(task._id)}
                    >
                      <IoMdCheckmark />
                    </button>
                    <button
                      className="border-red-600 border-2 rounded-md p-1 hover:bg-red-600 hover:text-white"
                      onClick={() => handleReject(task._id)}
                    >
                      <IoMdClose />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10 w-full overflow-auto">
          <button
            className={`${
              page <= 1 ? "bg-gray-500" : "bg-primary"
            } text-white py-2 px-5 rounded-md me-2`}
            onClick={() => page > 1 && setPage(page - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`${
                i + 1 === page ? "bg-primary" : "bg-gray-500"
              } text-white py-2 px-5 rounded-md`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={`${
              page >= totalPages ? "bg-gray-500" : "bg-primary"
            } text-white py-2 px-5 rounded-md ms-2`}
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
