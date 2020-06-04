import React, { useState, useCallback, useEffect } from "react";
import Spectrum from "./Spectrum";
import { useBumbleBee } from "../lib/bumblebee-provider";
import MicIcon from "@material-ui/icons/Mic";
import Recorder from "../lib/recorder";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userSpeechState, nlpQuery } from "../state/nlp";
import { Fab, Typography, Grid, makeStyles, Link } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.primary.contrastText,
    textTransform: "none",
  },
  caption: {
    paddingTop: "1rem",
    maxWidth: "100%",
  },
  bold: {
    fontWeight: 700,
  },
}));

export default function Analyser() {
  const styles = useStyles();

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

  const setIntent = useSetRecoilState(nlpQuery);

  // const onClick = useCallback(
  //   (evt) => {
  //     evt.preventDefault();
  //     setIntent();
  //   },
  //   [setIntent]
  // );

  return called ? (
    <Spectrum analyserNode={analyserNode}></Spectrum>
  ) : (
    <Grid alignItems="center" container direction="column">
      <Fab onClick={onHotWord}>
        <MicIcon />
      </Fab>
      <Grid
        className={styles.caption}
        container
        alignItems="center"
        direction="column"
      >
        <Typography variant="caption">
          Say <span className={styles.bold}> Bumblebee , What can I do </span>
        </Typography>
        <Typography variant="caption">or</Typography>
        <Link  className={styles.button} variant="caption">
          click here
        </Link>
      </Grid>
    </Grid>
  );
}
