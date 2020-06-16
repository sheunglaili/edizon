import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useRecoilValue } from "recoil";
import { errorState } from "../state/nlp/selector";

export default function ErrorToast() {
  const { enqueueSnackbar } = useSnackbar();
  const error = useRecoilValue(errorState);

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
          toastBody = "Sorry , But I couldn't understand you..";
          break;
        default:
          toastBody = message;
      }
      enqueueSnackbar(toastBody);
    }
  }, [error, enqueueSnackbar]);

  return <></>;
}
