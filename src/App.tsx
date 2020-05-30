import React, { useEffect, useState, useCallback } from "react";
import { Container, Grid, Paper, makeStyles  } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dropzone from "./component/Dropzone";
import Spectrum from "./component/Spectrum";
import { useBumbleBee } from "./lib/bumblebee-provider";
import MicIcon from '@material-ui/icons/Mic';
import Recorder from "./lib/recorder";

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
  recordingSection : {
    margin : '3rem'
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
      const recorder = new Recorder(stream, (audio) => {
        setCalled(false)
        console.log(URL.createObjectURL(audio))
      })
      recorder.start();
    }, []);

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
        spacing={5}
        container
      >
        <Grid item>
          <Container maxWidth="sm">
            <Paper className={styles.paper}>
              <Dropzone onFilesAdded={() => { }} />
            </Paper>
          </Container>
        </Grid>
        <Grid 
        xs={3} 
        item>
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
