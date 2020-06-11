import { atom } from "recoil";

const key = {
  PROCESSING: "PROCESSING",
};

export const processing = atom({
  key: key.PROCESSING,
  default: false,
});
