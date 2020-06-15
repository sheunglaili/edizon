import React, { useCallback, useState, useEffect } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import Canvas from "./Canvas";
import Dropzone from "./Dropzone";
import { useRecoilStateLoadable } from "recoil";
import { intentState, AnalysedIntent } from "src/state/nlp";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  paper: {
    background: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    width: "500px",
    height: "500px",
    padding: "1rem",
  },
  canvas: {
    width: "100%",
    height: "100%",
  },
}));

const availableExtension = ["png", "jpg", "jpeg"];

export default function Album() {
  const styles = useStyles();
  const [uploaded, setUploaded] = useState(false);
  const [imgURL, setImgURL] = useState<string>();

  const [{ state, contents }, setIntent] = useRecoilStateLoadable(intentState);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (state === "hasValue") {
      const { intent } = contents as AnalysedIntent;
      if (intent === "clear") {
        setUploaded(false);
        setImgURL("");
      }
    } // error handled in analyser
  }, [state, contents, enqueueSnackbar]);

  const validateExtensions = useCallback((fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();

    return ext ? availableExtension.includes(ext) : false;
  }, []);

  const readImage = useCallback((file: File) => {
    setImgURL(URL.createObjectURL(file));
  }, []);

  return (
    <Paper className={styles.paper}>
      {uploaded && imgURL ? (
        <Canvas imgURL={imgURL} />
      ) : (
        <Dropzone
          onFilesAdded={(files) => {
            const [file] = Array.from(files);
            const valid = validateExtensions(file.name);
            if (valid) {
              setIntent({
                intent: undefined,
                entities: {},
              });
              readImage(file);
              setUploaded(true);
            }
          }}
        />
      )}
    </Paper>
  );
}
