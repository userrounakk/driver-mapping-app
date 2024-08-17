import path from "path";
import {
  MdDashboard,
  MdOutlineAttachMoney,
  MdLocationOn,
  MdStore,
  MdOutlinePersonOutline,
} from "react-icons/md";
import { PiPottedPlantFill } from "react-icons/pi";
const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboard />,
    role: "manager",
  },
  {
    title: "Driver",
    path: "/dashboard/driver",
    icon: <MdDashboard />,
    role: "manager",
  },
  {
    title: "Assign Vehicle",
    path: "/dashboard/vehicle",
    icon: <MdDashboard />,
    role: "manager",
  },
  {
    title: "Assigned Tasks",
    path: "/dashboard/tasks",
    icon: <MdDashboard />,
    role: "driver",
  },
  // {
  //   title: "Plants",
  //   path: "/dashboard/plants",
  //   icon: <PiPottedPlantFill />,
  //   hidden: false,
  // },
  // {
  //   title: "Sellers",
  //   path: "/dashboard/sellers",
  //   icon: <MdOutlineAttachMoney />,
  //   hidden: false,
  // },
  // {
  //   title: "Locations",
  //   path: "/dashboard/locations",
  //   icon: <MdLocationOn />,
  //   hidden: false,
  // },
  // {
  //   title: "Store",
  //   path: "/dashboard/stores",
  //   icon: <MdStore />,
  //   hidden: false,
  // },
  // {
  //   title: "Users",
  //   path: "/dashboard/users",
  //   icon: <MdOutlinePersonOutline />,
  //   hidden: true,
  // },
];

export default menuItems;
