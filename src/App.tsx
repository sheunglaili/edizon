import React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Album from "./component/Album";
import Analyser from "./component/Analyser";
import HelpMenu from "./component/HelpMenu";
import ErrorToast from "./component/ErrorToast";
import Palette from "./component/Palette";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    [theme.breakpoints.down("xs")]: {
      height: "100%",
    },
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  spectrumPaper: {
    background: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    padding: "1rem",
    width: "300px",
  },
}));

function App() {
  const styles = useStyles();

  return (
    <>
      <CssBaseline />
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        alignContent="center"
        className={styles.container}
      >
        <Grid container item lg={4} md={3} sm={2} xs={undefined}></Grid>
        <Grid
          style={{ height: "100vh" }}
          justify="center"
          direction="column"
          alignContent="center"
          alignItems="center"
          container
          item
          lg={4}
          md={6}
          sm={8}
          xs={10}
        >
          <Grid container justify="center" alignContent="center" item xs>
            <Album />
          </Grid>
          <Grid
            style={{ maxWidth: "100%" }}
            container
            justify="center"
            alignContent="center"
            item
            xs={3}
          >
            <Paper className={styles.spectrumPaper}>
              <Analyser />
            </Paper>
          </Grid>
          <React.Suspense fallback={<></>}>
            <HelpMenu />
          </React.Suspense>
        </Grid>
        <Grid container lg={4} item md={3} sm={2} xs={12}>
          <Palette />
        </Grid>
        {/* <Grid container justify="center" alignContent="center" item xs={9}>
          <Album />
        </Grid>
        <Grid className={styles.item} item>
          <Paper className={styles.spectrumPaper}>
            <Analyser />
          </Paper>
        </Grid>
        <React.Suspense fallback={<></>}>
          <HelpMenu />
        </React.Suspense> */}
      </Grid>
      <React.Suspense fallback={<></>}>
        <ErrorToast />
      </React.Suspense>
    </>
  );
}

export default App;
