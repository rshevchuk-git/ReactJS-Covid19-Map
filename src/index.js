import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Nunito",
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
