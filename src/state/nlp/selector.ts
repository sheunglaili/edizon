import { selector } from "recoil";
import { recognise } from "./request";
import { userSpeechState, nlpState } from "./atom";

const KEY = {
  NLP_QUERY: "NLP_QUERY",
  INTENT: "INTENT",
  ERROR: "ERROR",
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
  intents?: Intent[];
  entities: Entities;
}

export interface AnalysedIntent {
  text?: string;
  intent?: string;
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
    if (processed.intents && processed.intents[0]) {
      return processed;
    } else if (userSpeech) {
      try {
        const { data } = await recognise(userSpeech);
        return {
          intents: [],
          ...data,
        };
      } catch (error) {
        const { code } = error.response.data;
        if (code) {
          throw new Error(code);
        } else {
          throw new Error("no-connection");
        }
      }
    } else {
      return {};
    }
  },
});

export const intentState = selector<AnalysedIntent>({
  key: KEY.INTENT,
  get: ({ get }) => {
    const { text, intents, entities } = get(nlpQuery);
    // intented clear = undefined
    // unknown intent = ""
    // known intent = "intent"
    return {
      text,
      intent: intents ? (intents.length > 0 ? intents[0].name : "") : undefined,
      entities,
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
        : undefined,
      entities: entities,
    });
    set(userSpeechState, undefined);
  },
});

export const errorState = selector<Error | undefined>({
  key: KEY.ERROR,
  get: async ({ get }) => {
    try {
      const { intent } = get(intentState);
      if (intent === "") {
        return new Error('unknown_intent')
      }
    } catch (error) {
      return error;
    }
  },
});
