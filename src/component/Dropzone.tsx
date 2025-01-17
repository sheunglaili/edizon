import React, { useState, useCallback, useRef } from "react";
import { Grid, makeStyles, ButtonBase } from "@material-ui/core";
import InstagramIcon from "@material-ui/icons/Instagram";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  dropzoneContainer: {
    height: "100%",
  },
  dropzone: {
    border: `3px dashed ${theme.palette.secondary.contrastText}`,
    color: theme.palette.secondary.contrastText,
    borderRadius: '5px',
    "& input": {
      display: "none",
    },
    "& button": {
      width: "100%",
      height: "100%",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Poppins, Arial, Helvetica, Helvetica Neue, serif",
      color: theme.palette.grey[400],
      transition: "color ease 0.3s",
    },
  },
}));

interface Props {
  onFilesAdded: (files: FileList) => void;
}

export default function Dropzone({ onFilesAdded }: Props) {
  const styles = useStyles();

  const fileRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const onDragEnter = useCallback(() => {
    setHover(true);
  }, []);
  const onDragLeave = useCallback(() => {
    setHover(false);
  }, []);
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = evt.target;
      if (files) onFilesAdded(files);
    },
    [onFilesAdded]
  );
  const onDrop = useCallback(
    (evt: React.DragEvent<HTMLButtonElement>) => {
      evt.preventDefault();
      const { files } = evt.dataTransfer;
      onFilesAdded(files);
    },
    [onFilesAdded]
  );
  const onDragOver = useCallback((evt) => {
    evt.preventDefault();
  }, []);
  const onClick = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

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
        <>
          <ButtonBase
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onClick={onClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            style={{ color: hover ? grey[100] : grey[400] }}
          >
            <InstagramIcon />
            Drag in your image
          </ButtonBase>
          <input ref={fileRef} type="file" multiple onChange={onChange} />
        </>
      </Grid>
    </Grid>
  );
}
