import React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Album from "./component/Album";
import Analyser from "./component/Analyser";
import HelpMenu from "./component/HelpMenu";

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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  item: {
    flex: "1 0 auto",
  },
}));

function App() {
  const styles = useStyles();

  return (
    <>
      <CssBaseline />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={styles.container}
      >
        <Grid container justify="center" alignContent="center" item xs={9}>
          <Album />
        </Grid>
        <Grid container justify="center" alignContent="center" item xs={3}>
          <React.Suspense fallback={<div>analysing...</div>}>
            <Analyser />
          </React.Suspense>
        </Grid>
        <React.Suspense fallback={<></>}>
          <HelpMenu />
        </React.Suspense>
      </Grid>
    </>
  );
}

export default App;
