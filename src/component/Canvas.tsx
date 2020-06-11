import React, { useRef, useEffect, useCallback, useState } from "react";
import { fabric } from "fabric";
import { makeStyles, Backdrop, CircularProgress } from "@material-ui/core";
import { useRecoilValueLoadable } from "recoil";
import { AnalysedIntent, intentState, Entities } from "../state/nlp/selector";
import reduce from "../lib/canvas-reducer";

interface Props {
  imgURL: string;
}

const useStyles = makeStyles((theme) => ({
  canvas: {
    width: "100% !important",
    height: "100% !important",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function Canvas({ imgURL }: Props) {
  const canvasRef = useRef<any>();

  const styles = useStyles();
  const [loading, setLoading] = useState(false);

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

    fabric.Image.fromURL(imgURL, function (oImg: any) {
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
        canvas.setOverlayImage(oImg, () => {});
      }
    });
  }, [imgURL, styles, resize]);

  const applyFilters = useCallback((filter: any) => {
    console.log("applying filter ", filter);
    const { current: canvas } = canvasRef;
    if (canvas) {
      const img = canvas.overlayImage;
      img?.filters?.push(filter);
      img?.applyFilters();
      canvas.renderAll();
    }
  }, []);

  const { state, contents } = useRecoilValueLoadable(intentState);

  const onLoadingFinish = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (state === "hasValue") {
      const { current: canvas } = canvasRef;
      if (canvas) {
        const intented =
          (contents as AnalysedIntent).intent &&
          (contents as AnalysedIntent).intent !== "ask_for_help";
        if (intented) {
          setLoading(true);
        }
        reduce(contents as AnalysedIntent, { canvas }, onLoadingFinish);
      }
    } else {
      console.log(contents);
    }
  }, [state, contents, applyFilters, onLoadingFinish]);

  return (
    <>
      <canvas className={styles.canvas} id="c"></canvas>
      <Backdrop className={styles.backdrop} open={loading}>
        <CircularProgress></CircularProgress>
      </Backdrop>
    </>
  );
}
