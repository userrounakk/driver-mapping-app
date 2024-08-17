import { usePathname } from "next/navigation";
import Link from "next/link";
import menuItems from "@/helper/menu";
import { useEffect, useState } from "react";
import { TbLogout2 } from "react-icons/tb";
import { setToast } from "@/helper/toast";

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

const Menu = () => {
  const path = usePathname();
  console.log("path", path);

  const [role, setRole] = useState("driver");

  useEffect(() => {
    const role = localStorage.getItem("type") ?? "driver";
    if (!role) {
      setToast("error", "Please Sign in to continue");
      window.location.href = "/login";
    }
    setRole(role);
  }, []);
  return (
    <div className="flex flex-col mt-10">
      {menuItems.map(
        (item, index) =>
          item.role == role && (
            <Link href={item.path} key={`menu-item-${index}`}>
              <div
                className={`flex ps-4 py-3 h-max w-full items-center gap-2 rounded-lg my-3 ${
                  (path == "/dashboard" && item.path == "/dashboard") ||
                  (item.path != "/dashboard" && path.startsWith(item.path))
                    ? "bg-primary text-white"
                    : "bg-gray-50"
                } `}
              >
                {item.icon}
                <span>{item.title}</span>
              </div>
            </Link>
          )
      )}
      <div
        className="flex ps-4 py-3 h-max w-full items-center gap-2 rounded-lg my-3 bg-gray-50 cursor-pointer"
        onClick={logout}
      >
        <TbLogout2 />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Menu;
