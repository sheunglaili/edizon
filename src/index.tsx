import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import cyan from "@material-ui/core/colors/cyan";
import BumbleBeeProvider from "./lib/bumblebee-provider";
import bumblebee from "./initBumblebee";
import { RecoilRoot } from "recoil";
import { fabric } from "fabric";

//workaround for bad typing
fabric.filterBackend  = new fabric.Canvas2dFilterBackend();
// if (((fabric as unknown) as any).isWebglSupported) {
//   fabric.textureSize = (fabric as unknown as any).maxTextureSize;
// }

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#121212",
      contrastText: cyan["A100"],
    },
    secondary: {
      main: grey[900],
      contrastText: grey[500],
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <BumbleBeeProvider bumblebee={bumblebee}>
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </ThemeProvider>
    </BumbleBeeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
