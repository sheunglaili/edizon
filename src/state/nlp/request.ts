import axios from "axios";

export const recognise = (audio: Blob) => {
  return axios.post("/wit/speech", audio, {
    headers: {
      "transform-encoding": "chunked",
      "content-type": "audio/wav",
    },
  });
};

export const recogniseMessage = (text: string) => {
  return axios.post(`/wit/message?msg=${encodeURIComponent(text)}`, null);
};
