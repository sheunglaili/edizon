import React, { useEffect, useState, useCallback } from "react";
import { Container, Grid, Paper, makeStyles } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dropzone from "./component/Dropzone";
import Spectrum from "./component/Spectrum";
import { useBumbleBee } from "./lib/bumblebee-provider";
import MicIcon from '@material-ui/icons/Mic';
import Recorder from "./lib/recorder";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    flexGrow: 1,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  paper: {
    background: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    width: "500px",
    height: "500px",
  },
  grid: {
    display: 'flex',
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  item: {
    flex: '1 0 auto'
  }
}));

function App() {
  const styles = useStyles();

  const { bumblebee } = useBumbleBee();

  const [analyserNode, setAnalyserNode] = useState<AnalyserNode>();
  const [called, setCalled] = useState(false);



  const onHotWord = useCallback(
    async (hotword) => {
      setCalled(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      source.connect(analyser);

      setAnalyserNode(analyser);

      const recorder = new Recorder(stream, (audio) => {
        setCalled(false)
        bumblebee?.start()
        console.log(URL.createObjectURL(audio))
      })
      bumblebee?.stop()
      recorder.start();
    }, [bumblebee]);


  useEffect(() => {
    if (bumblebee) {
      console.debug("start bumblebee");
      bumblebee.on("hotword", onHotWord);
      bumblebee.start();
    }
    return () => {
      console.debug("stop bumblebee");
      bumblebee?.stop();
    };
  }, [bumblebee, onHotWord,]);

  return (
    <>
      <CssBaseline />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={styles.container}>
        <Grid
          container
          justify="center"
          alignContent="center"
          item
          xs={9}>
          <Paper className={styles.paper}>
            <Dropzone onFilesAdded={() => { }} />
          </Paper>
        </Grid>
        <Grid container
          justify="center"
          alignContent="center"
          item xs={3}>
          {called ?
            <>
              <Spectrum analyserNode={analyserNode} />
            </>
            : <MicIcon />}
        </Grid>
      </Grid>
    </>
  );
}

export default App;
