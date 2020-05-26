import React from "react";
import { Container, Grid, Paper, makeStyles } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dropzone from './component/Dropzone'

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
              <Dropzone />
            </Paper>
          </Container>
        </Grid>
        <Grid item>spectrum</Grid>
      </Grid>
    </>
  );
}

export default App;
