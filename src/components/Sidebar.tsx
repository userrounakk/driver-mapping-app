"use client";
import { useRecoilState } from "recoil";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import Menu from "./Menu";
import sidebarState from "../../atom/sidebar";

const Sidebar = () => {
  const [show, setShow] = useRecoilState(sidebarState);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setShow(true);
      else setShow(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setShow]);
  return (
    <aside
      className={`md:w-1/5 fixed flex flex-col rounded-xl  top-[1.5%] z-10 w-4/5 p-5 h-[97%] overflow-y-scroll bg-white shadow-xl ${
        show ? "left-[1%]" : "hidden"
      }`}
    >
      <div className="w-full flex">
        <div className="flex">
          <Image
            src={"/logo.svg"}
            alt="motorq logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <button className="md:hidden" onClick={() => setShow(!show)}>
          <IoClose size={30} />
        </button>
      </div>
      <Menu />
    </aside>
  );
};

export default Sidebar;
