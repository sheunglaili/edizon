import { atom } from "recoil";

const key = {
  PROCESSING: "PROCESSING",
  COLOR: "COLOR",
  PALETTE: "PALETTE",
};

export const processing = atom({
  key: key.PROCESSING,
  default: false,
});

export const color = atom<[number, number, number] | undefined>({
  key: key.COLOR,
  default: undefined,
});

export const palette = atom<[number, number, number][] | undefined>({
  key: key.PALETTE,
  default: undefined,
});
