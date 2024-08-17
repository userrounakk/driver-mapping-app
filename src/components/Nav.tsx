"use client";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Image from "next/image";
import { IoMenu } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { setToast } from "@/helper/toast";
import getBreadCrumbs from "@/helper/breadcrumbs";
import sidebarState from "../../atom/sidebar";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Nav = () => {
  //   return <nav className="bg-gray-500 p-3 fixed w-full -mt-12">Navbar</nav>;
  const [width, setWidth] = useState(1000);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    setWidth(window.innerWidth);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width > 768) {
    return <FixedNav />;
  } else {
    return <CollapseAbleNav />;
  }
};
const CollapseAbleNav = () => {
  const [show, setShow] = useRecoilState(sidebarState);
  return (
    <nav className="bg-white shadow-lg p-3 fixed w-full left-0 top-0 2 flex h-1w justify-between items-center">
      <h1 className="font-medium">Motorq</h1>
      <button
        onClick={() => {
          setShow(!show);
        }}
      >
        <IoMenu size={20} />
      </button>
    </nav>
  );
};
const FixedNav = () => {
  const pathName = usePathname();
  const [name, setName] = useState("");
  // const [image, setImage] = useState("");
  const [breadcrumb, setBreadcrumb] = useState("Dashboard");

  useEffect(() => {
    const name = localStorage.getItem("name") || "";
    setName(name);
  }, []);
  useEffect(() => {
    setBreadcrumb(getBreadCrumbs(pathName));
  }, [pathName]);
  return (
    <nav className="rounded-xl bg-white shadow-lg p-3 px-5 fixed w-[77%] left-0 md:left-[22%] top-4 flex justify-between items-center">
      <h1 className="font-medium">{breadcrumb}</h1>
      <div className="flex items-center gap-2">
        <span className="font-medium">{name}</span>
        {/* <Image
          src={`${baseUrl}${image}`}
          alt="Motorq logo"
          width={50}
          height={50}
          className="rounded-full h-12 w-12"
        /> */}
      </div>
    </nav>
  );
};

export default Nav;
