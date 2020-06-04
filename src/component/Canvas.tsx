import React, { useRef, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import { makeStyles } from "@material-ui/core";

interface Props {
  imgURL: string;
}

const useStyles = makeStyles({
  canvas: {
    width: "100% !important",
    height: "100% !important",
  },
});

export default function Canvas({ imgURL }: Props) {
  const canvasRef = useRef<fabric.StaticCanvas>();

  const styles = useStyles();

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasEl = document.getElementById("c");
      canvas.setWidth(canvasEl?.offsetWidth || 0);
      canvas.setHeight(canvasEl?.offsetHeight || 0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    let { current: canvas } = canvasRef;

    if (!canvas) {
      canvasRef.current = new fabric.StaticCanvas("c", {
        containerClass: styles.canvas,
      });
      canvas = canvasRef.current;
    }

    console.log(imgURL);

    fabric.Image.fromURL(imgURL, function (oImg) {
      if (
        oImg.height &&
        oImg.width &&
        canvas?.getHeight() &&
        canvas?.getWidth()
      ) {

        resize();
        const cWidth = canvas.getWidth();
        const cHeight = canvas.getHeight();

        const wrh = oImg.width / oImg.height;
        let newWidth = cWidth;
        let newHeight = cWidth / wrh;

        if (newHeight > canvas.getHeight()) {
          newHeight = cHeight;
          newWidth = cHeight * wrh;
        }

        let scale = Math.min(cWidth / oImg.width, cHeight / oImg.height);

        const x = cWidth / 2 - (oImg.width / 2) * scale;
        const y = cHeight / 2 - (oImg.height / 2) * scale;

        oImg.set({
          top: y,
          left: x,
        });

        oImg.scaleToHeight(newHeight);
        oImg.scaleToWidth(newWidth);
        canvas.add(oImg);
      }
    });
  }, [imgURL, styles, resize]);

  return <canvas className={styles.canvas} id="c"></canvas>;
}
