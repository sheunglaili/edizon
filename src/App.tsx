import React from "react";
import { Container, Grid, Paper, makeStyles } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import ImageIcon from "@material-ui/icons/Image";

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
  dropzoneContainer: {
    height: "100%",
  },
  dropzone: {
    border: `1px dashed ${theme.palette.secondary.contrastText}`,
    color: theme.palette.secondary.contrastText,
    margin: "1rem",
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
              <Grid container className={styles.dropzoneContainer}>
                <Grid
                  item
                  container
                  xs={12}
                  direction="column"
                  justify="center"
                  alignContent="center"
                  alignItems="center"
                  className={styles.dropzone}
                >
                  <ImageIcon />
                  Drag in your image
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Grid>
        <Grid item>spectrum</Grid>
      </Grid>
    </>
  );
}

export default App;
