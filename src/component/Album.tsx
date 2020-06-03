import React, { useCallback, useState, useRef } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import Dropzone from "./Dropzone";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const validateExtensions = useCallback((fileName: string) => {
    const ext = fileName.split(".").pop();

    return ext ? availableExtension.includes(ext) : false;
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, []);

  const draw = useCallback(
    (img: HTMLImageElement) => {
      const canvas = canvasRef.current;

      if (canvas) {
        resize();
        console.log(canvas.height);
        console.log(canvas.width);
        const ctx = canvas.getContext("2d");
        var wrh = img.width / img.height;
        var newWidth = canvas.width;
        var newHeight = newWidth / wrh;
        if (newHeight > canvas.height) {
          newHeight = canvas.height;
          newWidth = newHeight * wrh;
        }
        let scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );

        let x = canvas.width / 2 - (img.width / 2) * scale;
        let y = canvas.height / 2 - (img.height / 2) * scale;

        ctx?.drawImage(img, x, y, newWidth, newHeight);
      }

      console.log(img.height);
      console.log(img.width);
    },
    [resize]
  );

  const readImage = useCallback(
    (file: File) => {
      const img = new Image();
      img.onload = () => {
        draw(img);
      };
      img.src = URL.createObjectURL(file);
    },
    [draw]
  );

  return (
    <Paper className={styles.paper}>
      {uploaded ? (
        <canvas className={styles.canvas} ref={canvasRef} />
      ) : (
        <Dropzone
          onFilesAdded={(files) => {
            setUploaded(true);
            const [file] = Array.from(files);
            const valid = validateExtensions(file.name);
            if (valid) {
              readImage(file);
            }
          }}
        />
      )}
    </Paper>
  );
}
