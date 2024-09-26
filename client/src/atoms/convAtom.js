import { atom } from "recoil";

export const convAtom = atom({
  key: "convAtom",
  default: [],
});

export const selectedConvAtom = atom({
  key: "selectedConvAtom",
  default: null,
});
