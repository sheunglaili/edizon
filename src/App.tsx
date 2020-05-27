import React, { useEffect, useState, useCallback } from "react";
import { Container, Grid, Paper, makeStyles } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dropzone from "./component/Dropzone";
import Spectrum from "./component/Spectrum";
import { useBumbleBee } from "./lib/bumblebee-provider";
import hark from "hark";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  paper: {
    background: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    width: "500px",
    height: "500px",
  },
}));

function App() {
  const styles = useStyles();

  const { bumblebee } = useBumbleBee();

  const [analyserNode, setAnalyserNode] = useState<AnalyserNode>();
  const [chucks, setChunks] = useState<Blob[]>([]);

  const onRecording = useCallback((event) => {
    if (event.data.size > 0) {
      setChunks((state) => [...state, event.data]);
    }
  }, []);

  const onHotWord = useCallback(
    async (hotword) => {
      console.log("called");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const speechEvents = hark(stream);

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      recorder.ondataavailable = onRecording;

      recorder.start();

      speechEvents.on("stopped_speaking", () => {
        console.log("stopped talking");
        recorder.stop();
        //dispatch action here;
        let blob = new Blob(chucks, {
          type: "audio/webm",
        });
        console.log(URL.createObjectURL(blob));
      });
    },
    [onRecording, chucks]
  );

  const onAnalyserReady = useCallback((analyser) => {
    setAnalyserNode(analyser);
  }, []);

  useEffect(() => {
    if (bumblebee) {
      console.debug("start bumblebee");
      bumblebee.start();
      bumblebee.on("hotword", onHotWord);
      bumblebee.on("analyser", onAnalyserReady);
    }
    return () => {
      console.debug("stop bumblebee");
      bumblebee?.stop();
    };
  }, [bumblebee, onHotWord, onAnalyserReady]);

  return (
    <>
      <CssBaseline />
      <Grid
        className={styles.container}
        alignItems="center"
        justify="center"
        direction="column"
        container
      >
        <Grid item>
          <Container maxWidth="sm">
            <Paper className={styles.paper}>
              <Dropzone onFilesAdded={() => {}} />
            </Paper>
          </Container>
        </Grid>
        <Grid item>
          <Spectrum analyserNode={analyserNode} />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
