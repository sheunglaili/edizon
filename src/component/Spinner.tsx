import React from "react";
import { makeStyles } from "@material-ui/core";

interface Props {
  height?: number;
  width?: number;
}

const useStyles = makeStyles({
  "@keyframes rotate": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
  spinner: {
    animation: "$rotate 1s ease-in infinite",
  },
});

export default function Spinner({ height = 50, width = 50 }: Props) {
  const styles = useStyles();
  return (
    <div
      className={styles.spinner}
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      <svg width={width} height={height}>
        <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
          <stop offset="5%" stopColor="#5158d4"></stop>
          <stop offset="25%" stopColor="#8134af"></stop>
          <stop offset="40%" stopColor="#dd2a7b"></stop>
          <stop offset="60%" stopColor="#dd2a7b"></stop>
          <stop offset="80%" stopColor="#feda77"></stop>
          <stop offset="100%" stopColor="#7D0022"></stop>
        </linearGradient>
        <circle
          r="20"
          cx={width / 2}
          cy={height / 2}
          className="external-circle"
          strokeWidth="4"
          fill="none"
          stroke="url(#linearColors)"
        ></circle>
      </svg>
    </div>
  );
}
