import React from "react";
import { useRecoilValue } from "recoil";
import { color, palette } from "../state/canvas";
import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  column: {
    height: "100%",
  },
  color: {
    height: "1rem",
    width: "1rem",
    borderRadius: "0.5rem",
    margin: '0.5rem'
  },
});

export default function Palette() {
  const colorState = useRecoilValue(color);
  const paletteState = useRecoilValue(palette);

  const styles = useStyles();

  if (!colorState) return <></>;

  const [r, g, b] = colorState;

  return (
    <Grid container>
      <Grid
        className={styles.column}
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        alignContent="center"
        item
        xs={6}
      >
        <div>Color</div>
        <div
          className={styles.color}
          style={{ backgroundColor: `rgb(${r},${g},${b})` }}
        ></div>
      </Grid>
      <Grid
        className={styles.column}
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        alignContent="center"
        item
        xs={6}
      >
        {paletteState && (
          <>
            <div>Palette</div>
            {paletteState.map(([r, g, b]) => (
              <div
                className={styles.color}
                style={{ backgroundColor: `rgb(${r},${g},${b})` }}
              ></div>
            ))}
          </>
        )}
      </Grid>
    </Grid>
  );
}
