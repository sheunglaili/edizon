import { selector } from "recoil";
import { recognise } from "./request";
import { userSpeechState } from "./atom";

const KEY = {
  NLP_QUERY: "NLP_QUERY",
  INTENT: "INTENT",
};

interface Intent {
  id: number;
  name: string;
  confidence: number;
}

interface Entities {
  [key: string]: {
    id: string;
    name: string;
    role: string;
    start: number;
    end: number;
    confidence: number;
    value: string;
    type: string;
    entities: any[];
  }[];
}
export interface NLPResponse {
  text: string;
  intents: Intent[];
  entities: Entities;
}

export const nlpQuery = selector<NLPResponse>({
  key: KEY.NLP_QUERY,
  get: async ({ get }) => {
    const userSpeech = get(userSpeechState);
    if (!userSpeech) {
      return { intents: [] };
    }
    const { data } = await recognise(userSpeech);
    return data;
  },
  set : ({set},newValue) => {
    set(nlpQuery,newValue)
  }
});
