import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import cyan from "@material-ui/core/colors/cyan";
import BumbleBeeProvider from "./lib/bumblebee-provider";
import bumblebee from "./initBumblebee";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blueGrey[900],
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
        <App />
      </ThemeProvider>
    </BumbleBeeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
