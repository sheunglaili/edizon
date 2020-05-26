import React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";

const useStyles = makeStyles((theme) => ({
  dropzoneContainer: {
    height: "100%",
  },
  dropzone: {
    border: `3px dashed ${theme.palette.secondary.contrastText}`,
    color: theme.palette.secondary.contrastText,
    margin: "1rem",
  },
}));

export default function Dropzone() {
  const styles = useStyles();

  return (
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
  );
}
