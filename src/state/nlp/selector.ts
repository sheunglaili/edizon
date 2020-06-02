import { selector } from 'recoil';
import { recognise } from './request';
import { userSpeechState } from './atom';

const KEY = {
    'NLP_QUERY' : 'NLP_QUERY'
}

export const nlpQuery = selector({
    key: KEY.NLP_QUERY,
    get: async ({get}) => {
        const userSpeech = get(userSpeechState);
        if(!userSpeech){
            throw new Error('No speech recorded !')
        }
        return recognise(userSpeech);
    }
})