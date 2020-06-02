const express = require("express");
const request = require("request");
require("dotenv").config();

const app = express();

const options = () => ({
  url: "https://api.wit.ai/speech?v=20200513",
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.WIT_SERVER_TOKEN}`,
    "transfer-encoding": "chunked",
    "content-type": "audio/wav",
  },
});

/**
 * @summary construct callback used by the request library
 * @param {Express.Response} res
 */
const callback = (res) => {
  return (error, response, body) => {
    if (!error && response.statusCode === 200) {
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
  const request_option = options();
  console.log(request_option);
  const handler = callback(res);
  req.pipe(request(request_option, handler));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Express server is running on port 3001");
});
