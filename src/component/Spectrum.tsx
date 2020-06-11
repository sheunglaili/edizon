import React, { useRef, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core";
import { fabric } from "fabric";

const useStyles = makeStyles({
  osciloscope: {
    width: "100% !important",
    height: "100% !important",
  },
});

interface Props {
  lineColor?: string;
  backGroundColor?: string;
  analyserNode?: AnalyserNode;
}

let fps = 30,
  fpsInterval: number,
  now: number,
  then: number,
  elapsed: number;

function calculateFps() {
  fpsInterval = 1000 / fps;
  then = Date.now();
}

export default function Spectrum({
  lineColor = "#ffffff",
  backGroundColor = "#ffffff",
  analyserNode,
}: Props) {
  const styles = useStyles();
  const canvasRef = useRef<any>(null);

  const smoothen = useCallback((waveform: Uint8Array, divider: number) => {
    const filtered = [];
    for (let i = 0; i < waveform.length; i += divider) {
      let sum = 0;
      for (let j = i; j < i + divider; j++) {
        sum += waveform[j];
      }
      const avg = sum / divider;
      filtered.push(avg);
    }
    return filtered;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;

    if (canvas && analyserNode) {
      requestAnimationFrame(draw);

      now = Date.now();
      elapsed = now - then;

      if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        //drawing code
        const bufferLength = analyserNode.frequencyBinCount;
        // const ctx = canvas.getContext("2d");

        const dataArr = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(dataArr);

        // make the spectrum split to 32 rect;
        let divider = 32;

        const processed = smoothen(dataArr, divider);

        var sliceWidth = canvas.width / divider;
        var x = 0;

        for (let i = 0; i < processed.length; i++) {
          // normalize the data to 0 to 1
          let normalized = processed[i] / 128;

          // height of the bar
          let height = normalized * canvas.height;

          let rectHeight = height > canvas.height ? canvas.height : height;
          // y position of the starting point rectangle
          let y = canvas.height / 2 - rectHeight / 2;

          // ctx.fillRect(x, y, sliceWidth, rectHeight);

          if (canvas.getObjects().length >= divider) {
            const rect = canvas.getObjects("rect")[i];
            rect.set({
              left: x,
              top: y,
              storke: lineColor,
              fill: backGroundColor,
              width: sliceWidth - 6,
              height: rectHeight - sliceWidth / 2,
            });
            rect.setGradient("fill", {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: rect.height,
              colorStops: {
                1: "#f58529",
                0.9: "#feda77",
                0.7: "#dd2a7b",
                0.4: "#8134af",
                0: "#5158d4",
              },
            });
          } else {
            let rect = new fabric.Rect({
              left: x,
              top: y,
              storke: lineColor,
              fill: backGroundColor,
              width: sliceWidth - 6,
              height: rectHeight - sliceWidth / 2,
              rx: sliceWidth / 2,
              ry: sliceWidth / 2,
            });

            canvas.add(rect);
          }

          // x position of the starting point of rectage
          x += sliceWidth;
        }

        canvas.renderAll();
      }
    } else {
      console.log("Canvas or analyser node not ready");
    }
  }, [analyserNode, backGroundColor, lineColor, smoothen]);

  useEffect(() => {
    if (!canvasRef.current)
      canvasRef.current = new fabric.StaticCanvas("oscilloscope");
    calculateFps();
    draw();

    return () => {
      canvasRef.current.clear();
      canvasRef.current = undefined;
    };
  }, [draw, analyserNode]);

  return <canvas className={styles.osciloscope} id="oscilloscope"></canvas>;
}
