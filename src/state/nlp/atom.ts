import { atom } from 'recoil';

const KEY = {
    'USER_SPEECH' : 'USER_SPEECH'
}

export const userSpeechState = atom<Blob | undefined>({
    key : KEY.USER_SPEECH,
    default : undefined
})