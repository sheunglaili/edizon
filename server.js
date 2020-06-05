const express = require("express");
const request = require("request");
require("dotenv").config();

const app = express();

const options = (method = "GET", path, headers = {}) => ({
  url: `https://api.wit.ai/${path}`,
  method,
  headers: {
    Authorization: `Bearer ${process.env.WIT_SERVER_TOKEN}`,
    ...headers,
  },
});

/**
 * @summary construct callback used by the request library
 * @param {Express.Response} res
 */
const callback = (res) => {
  return (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log(body);
      res.set("Content-Type", "application/json");
      res.send(body);
    } else {
      res.status(500);
      res.send(body);
    }
  };
};

/**
 * @summary POST endpoint for uploading user speech
 */
app.post("/wit/speech", (req, res) => {
  const request_option = options("POST", "speech?v=20200513", {
    "transfer-encoding": "chunked",
    "content-type": "audio/wav",
  });
  const handler = callback(res);
  req.pipe(request(request_option, handler));
});

/**
 * @summary POST endpoint for uploading user message
 */
app.post("/wit/message", (req, res) => {
  const { msg } = req.query;
  const request_option = options("GET", `message?v=20200513&q=${msg}`);
  const handler = callback(res);
  request(request_option, handler);
});

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  console.log("Express server is running on port ", process.env.SERVER_PORT);
});
