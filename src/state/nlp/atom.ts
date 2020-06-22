import { atom } from "recoil";
import { NLPResponse, errorState } from "./selector";

const KEY = {
  USER_SPEECH: "USER_SPEECH",
  USER_MESSAGE: "USER_MESSAGE",
  USER_ERROR: "USER_ERROR",
  USER_ANALYSED: "USER_ANALYSED",
  USER_COMMAND: "USER_COMMAND",
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

export const errorAtom = atom<Error | undefined>({
  key: KEY.USER_ERROR,
  default: errorState,
});

