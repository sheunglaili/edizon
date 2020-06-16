import axios from "axios";

const api = axios.create({
  baseURL : process.env.REACT_APP_PROXY_SERVER
})

export const recognise = (audio: Blob) => {
  return api.post("/wit/speech", audio, {
    headers: {
      "transform-encoding": "chunked",
      "content-type": "audio/wav",
    },
  });
};

export const recogniseMessage = (text: string) => {
  return api.post(`/wit/message?msg=${encodeURIComponent(text)}`, null);
};
