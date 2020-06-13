import { selector } from "recoil";
import { recognise } from "./request";
import { userSpeechState, nlpState } from "./atom";

const KEY = {
  NLP_QUERY: "NLP_QUERY",
  INTENT: "INTENT",
};

export interface Intent {
  id: number;
  name: string;
  confidence: number;
}

export interface Entities {
  [key: string]: {
    id?: string;
    name?: string;
    role?: string;
    start?: number;
    end?: number;
    confidence?: number;
    value: string;
    type?: string;
    entities?: any[];
  }[];
}
export interface NLPResponse {
  text: string;
  intents: Intent[];
  entities: Entities;
}

export interface AnalysedIntent {
  intent: string;
  entities: Entities;
}

export interface NLPResponseSetterObject {
  intent: string;
  entitits: Entities;
}

export const nlpQuery = selector<NLPResponse>({
  key: KEY.NLP_QUERY,
  get: async ({ get }) => {
    const processed = get(nlpState);
    const userSpeech = get(userSpeechState);
    if (processed.intents[0]) {
      return processed;
    } else if (userSpeech) {
      const { data } = await recognise(userSpeech);
      return {
        intents: [],
        ...data,
      };
    } else {
      return { intents: [] };
    }
  }
});

export const intentState = selector<AnalysedIntent>({
  key: KEY.INTENT,
  get: ({ get }) => {
    const data = get(nlpQuery);
    return {
      intent: data.intents[0]?.name || "",
      entities: data.entities,
    };
  },
  set: ({ set }, newValue) => {
    const { intent, entities } = newValue as AnalysedIntent;
    set(nlpState, {
      intents: intent
        ? [
            {
              id: 0,
              name: intent,
              confidence: 1,
            },
          ]
        : [],
      entities: entities,
    });
    set(userSpeechState,undefined)
  },
});
