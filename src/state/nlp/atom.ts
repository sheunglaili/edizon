import { atom } from "recoil";
import { NLPResponse } from "./selector";

const KEY = {
  USER_SPEECH: "USER_SPEECH",
  USER_MESSAGE: "USER_MESSAGE",
};

export const userSpeechState = atom<Blob | undefined>({
  key: KEY.USER_SPEECH,
  default: undefined,
});

export const nlpState = atom<NLPResponse>({
  key: KEY.USER_MESSAGE,
  default: {
    text: "",
    intents: undefined,
    entities: {},
  },
});
