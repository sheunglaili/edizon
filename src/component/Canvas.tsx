import React, { useRef, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import { makeStyles, Theme } from "@material-ui/core";
import { useRecoilStateLoadable, useSetRecoilState } from "recoil";
import { AnalysedIntent, intentState, errorAtom } from "../state/nlp/selector";
import { color, palette } from "../state/canvas";
import reduce from "../lib/canvas-reducer";
import { processing } from "../state/canvas";
import ColorThief from "colorthief";

interface Props {
  imgURL: string;
}

const useStyles = makeStyles((theme: Theme) => ({
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
  //   console.log(imgURL)
  const canvasRef = useRef<any>();
  const thiefRef = useRef<ColorThief>(new ColorThief());

  const styles = useStyles();
  const setLoading = useSetRecoilState(processing);
  const setError = useSetRecoilState(errorAtom);
  const setColor = useSetRecoilState(color);
  const setPalette = useSetRecoilState(palette);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasEl = document.getElementById("c");
      if (canvasEl) {
        canvas.setWidth(canvasEl?.offsetWidth || 0);
        canvas.setHeight(canvasEl?.offsetHeight || 0);
        canvas.calcOffset();
        const cWidth = canvas.getWidth();
        const cHeight = canvas.getHeight();

        const oImg = canvas.overlayImage;

        if (oImg) {
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
          canvas.renderAll();
        }
      }
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

  const [loadable, setIntentState] = useRecoilStateLoadable(intentState);

  const onLoadingFinish = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    const { state, contents } = loadable;
    switch (state) {
      case "hasValue":
        const { current: canvas } = canvasRef;
        if (canvas) {
          const analysedIntent = contents as AnalysedIntent;
          const { intent } = analysedIntent;
          const intented = intent && intent !== "ask_for_help";
          if (intented) {
            console.log("intented");
            setLoading(true);
            reduce(
              analysedIntent,
              { canvas },
              {
                onComplete: ({ canvas }) => {
                  console.log("finish loading");
                  onLoadingFinish();
                  setIntentState({
                    intent: undefined,
                    entities: {},
                  });
                  const { current: thief } = thiefRef;
                  const canvasElement = canvas.toCanvasElement();
                  const color = thief.getColor(canvasElement);
                  const palette = thief.getPalette(canvasElement);
                  setColor(color);
                  setPalette(palette);
                },
                onError: (_, error) => {
                  setError(error);
                },
              }
            );
          }
        }
        break;
      default:
        console.log(contents);
    }
  }, [
    loadable,
    onLoadingFinish,
    setIntentState,
    setLoading,
    setColor,
    setPalette,
    setError,
  ]);

  useEffect(() => {
    // used to unmount those color when canvas dismiss
    return () => {
      setColor(undefined);
      setPalette(undefined);
    };
  }, [setColor, setPalette]);

  return <canvas className={styles.canvas} id="c"></canvas>;
}
