import { atom } from "recoil";

const sidebarState = atom({
  key: "sidebar",
  default: true,
});

export default sidebarState;
