import React, { useState, useCallback, useEffect } from "react";
import Spectrum from "./Spectrum";
import { useBumbleBee } from "../lib/bumblebee-provider";
import MicIcon from "@material-ui/icons/Mic";
import Recorder from "../lib/recorder";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userSpeechState, nlpQuery } from "../state/nlp";

export default function Analyser() {
  const { bumblebee } = useBumbleBee();

  const [analyserNode, setAnalyserNode] = useState<AnalyserNode>();
  const [called, setCalled] = useState(false);

  const setSpeech = useSetRecoilState(userSpeechState);

  const intent = useRecoilValue(nlpQuery);

  console.log(intent);

  const onHotWord = useCallback(
    async (hotword) => {
      setCalled(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      source.connect(analyser);

      setAnalyserNode(analyser);

      const recorder = new Recorder(stream, ctx, (audio) => {
        // resume the mic icon
        setCalled(false);
        // set recorded audio to trigger wit.ai
        setSpeech(audio);
        bumblebee?.start();
        console.log(URL.createObjectURL(audio));
      });
      bumblebee?.stop();
      recorder.start();
    },
    [bumblebee, setSpeech]
  );

  useEffect(() => {
    if (bumblebee) {
      console.log("start bumblebee");
      bumblebee.on("hotword", onHotWord);
      bumblebee.start();
    }
    return () => {
      console.log("stop bumblebee");
      bumblebee?.stop();
    };
  }, [bumblebee, onHotWord]);

  return called ? (
    <Spectrum analyserNode={analyserNode}></Spectrum>
  ) : (
    <MicIcon />
  );
}
