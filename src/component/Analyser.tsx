import React, { useState, useCallback, useEffect, MouseEvent } from "react";
import Spectrum from "./Spectrum";
import { useBumbleBee } from "../lib/bumblebee-provider";
import MicIcon from "@material-ui/icons/Mic";
import Recorder from "../lib/recorder";
import { useSetRecoilState } from "recoil";
import { userSpeechState, intentState } from "../state/nlp";
import {
  Fab,
  Typography,
  Grid,
  makeStyles,
  Link,
  Paper,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  caption: {
    paddingTop: "1rem",
    maxWidth: "100%",
  },
  bold: {
    fontWeight: 700,
  },
  button: {
    color: theme.palette.primary.contrastText,
    textTransform: "none",
  },
  paper: {
    background: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    padding: "1rem",
    width: "300px",
  },
}));

export default function Analyser() {
  const { bumblebee } = useBumbleBee();
  const styles = useStyles();

  const [analyserNode, setAnalyserNode] = useState<AnalyserNode>();
  const [called, setCalled] = useState(false);

  const setSpeech = useSetRecoilState(userSpeechState);
  const setIntent = useSetRecoilState(intentState);

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
        // clear manual message if audio is input
        setIntent({
          intent: "",
          entities: {},
        });
        // set recorded audio to trigger wit.ai
        setSpeech(audio);
        bumblebee?.start();
      });
      bumblebee?.stop();
      recorder.start();
    },
    [bumblebee, setSpeech, setIntent]
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

  return (
    <Paper className={styles.paper}>
      {called ? (
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
              Say <span className={styles.bold}>Bumblebee</span> then
              <span className={styles.bold}> What can I do </span>
            </Typography>
            <Typography variant="caption">or</Typography>
            <Link
              onClick={(evt: MouseEvent<HTMLAnchorElement>) => {
                evt.preventDefault();
                setIntent({
                  intent: "ask_for_help",
                  entities: {},
                });
              }}
              className={styles.button}
              variant="caption"
            >
              click here
            </Link>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}
