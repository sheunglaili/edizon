import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useRecoilValue } from "recoil";
import { UnknownIntentError } from "../state/nlp/selector";
import { errorAtom } from "src/state/nlp";

export default function ErrorToast() {
  const { enqueueSnackbar } = useSnackbar();
  const error = useRecoilValue(errorAtom);

  useEffect(() => {
    if (error) {
      const { message } = error;
      let toastBody: string;
      switch (message) {
        case "audio-too-long":
          toastBody = "The recording is too long to process !";
          break;
        case "no-connection":
          toastBody = "Oops , I cannot connect to my brains !";
          break;
        case "unknown_intent":
          toastBody = `Sorry , But I couldn't understand "${
            (error as UnknownIntentError).text
          }"`;
          break;
        default:
          toastBody = message;
      }
      enqueueSnackbar(toastBody);
    }
  }, [error, enqueueSnackbar]);

  return <></>;
}
