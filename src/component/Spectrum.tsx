import React, { useRef, useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  osciloscope: {
    width: "100%",
    height: "100%",
  },
});

interface Props {
  lineColor?: string;
  backGroundColor?: string;
  analyserNode?: AnalyserNode;
}

export default function Spectrum({
  lineColor = "#ffffff",
  backGroundColor,
  analyserNode,
}: Props) {
  const styles = useStyles();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const smoothen = useCallback((waveform: Uint8Array) => {
    // const divider = 63;
    // const filtered = [];
    // for (let i = 0; i < waveform.length; i += divider) {
    //   let sum = 0;
    //   for (let j = i; j < i + divider; j++) {
    //     sum += waveform[j];
    //   }
    //   const avg = sum / divider;
    //   filtered.push(avg);
    // }
    return waveform;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;

    if (canvas && analyserNode) {
      const bufferLength = analyserNode.frequencyBinCount;
      const ctx = canvas.getContext("2d");

      const dataArr = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArr);

      const processed = smoothen(dataArr);

      if (!ctx) throw new Error("2d context not found");

      if (backGroundColor) {
        ctx.fillStyle = backGroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      ctx.lineWidth = 1.5;

      if (lineColor) {
        ctx.strokeStyle = lineColor;
        ctx.fillStyle = lineColor;
      }

      ctx.beginPath();

      var sliceWidth = canvas.width / 32;
      var x = 0;

      for (let i = 0; i < processed.length; i++) {
        // normalize the data to 0 to 1
        let normalized = processed[i]  / 128;

        // height of the bar , when smaller then 0.01 stay 2 to prevent shaking of bar
        let rectHeight = normalized  * canvas.height;
        // y position of the starting point rectangle
        let y = canvas.height / 2 - rectHeight / 2;

        ctx.fillRect(x, y, sliceWidth, rectHeight);

        // x position of the starting point of rectage
        x += sliceWidth + 6;
      }

      requestAnimationFrame(draw);
    } else {
      console.log("Canvas or analyser node not ready");
    }
  }, [analyserNode, backGroundColor, lineColor, smoothen]);

  useEffect(() => {
    console.log(analyserNode?.frequencyBinCount);
    draw();
  }, [draw, analyserNode]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.osciloscope}
      id="oscilloscope"
    ></canvas>
  );
}
