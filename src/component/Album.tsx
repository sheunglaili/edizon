import React, { useCallback, useState, useEffect } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import Canvas from "./Canvas";
import Dropzone from "./Dropzone";
import { useRecoilValueLoadable } from "recoil";
import { nlpQuery, NLPResponse } from "src/state/nlp";

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

  const { state, contents } = useRecoilValueLoadable(nlpQuery);

  useEffect(() => {
    if (state === "hasValue") {
      const { intents  } = contents as NLPResponse;
      const intent = intents[0]?.name;

      if (intent === "clear") {
        setUploaded(false);
        setImgURL("");
      }
    } else if (state === "hasError") {
      //handle error 
    }
  }, [state, contents]);

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
              setUploaded(true);
              readImage(file);
            }
          }}
        />
      )}
    </Paper>
  );
}
