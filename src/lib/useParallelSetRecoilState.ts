import { RecoilState, GetRecoilValue, SetRecoilState, ResetRecoilState, useSetRecoilState, useRecoilValue, useResetRecoilState } from "recoil";

export default function useParalletSetRecoilState<T>(
    state: RecoilState<T>,
    updater: (
      newValue: T,
      utils: {
        get: GetRecoilValue;
        set: SetRecoilState;
        reset: ResetRecoilState;
      }
    ) => void
  ) {
    const set = useSetRecoilState(state);
    const utils = {
      get: useRecoilValue,
      set: useSetRecoilState,
      reset: useResetRecoilState,
    };
    return (updated: T) => {
      set(updated);
      updater(updated, utils);
    };
  }