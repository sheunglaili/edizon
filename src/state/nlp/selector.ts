import { selector } from 'recoil';
import { recognise } from './request';
import { userSpeechState } from './atom';

const KEY = {
    'NLP_QUERY' : 'NLP_QUERY',
    'INTENT' : 'INTENT'
}

interface Intent {
    id: number
    name: string
    confidence : number
}
interface Response {
    text : string
    intents: Intent[]
    entities : any[]
}

export const nlpQuery = selector({
    key: KEY.NLP_QUERY,
    get: async ({get}) => {
        const userSpeech = get(userSpeechState);
        if(!userSpeech){
           return null;
        }
        const {data} = await recognise(userSpeech);
        return data as Response;
    }
})

export const intent = selector({
    key: KEY.INTENT,
    get: ({get}) => {
        const analysed = get(nlpQuery);
        return analysed?.intents[0].name;
    },
    set: ({set},newValue) => {
        set(intent,newValue)
    }
})