import { AnalysedIntent, Entities } from "../state/nlp/selector";
import InstagramFilter from "./filter";
import { applyFilters } from "./utils";
import { setBlurriness, increaseBlurriness, decreaseBlurriness } from "./blur";
import {
  setBrightness,
  increaseBrightness,
  decreaseBrightness,
} from "./brightness";
import { setContrast, increaseContrast, decreaseContrast } from "./contrast";
import { grayscale } from "./grayscale";
import { invert } from "./invert";
import { pixelate } from "./pixelate";

interface Deps {
  canvas: any;
}

interface ReducerMap {
  [intent: string]: (canvas: any, entities: Entities) => void;
}

function applyInstagramFilters(canvas: any, entities: Entities) {
  const [{ value }] = entities["vedit_filter:vedit_filter"];
  const filter = new InstagramFilter({ filterName: value });
  applyFilters(canvas, filter);
}

function downloadURI(uri: string, name: string) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportImage(canvas: any, entities: Entities) {
  const [{ value: extension }] = entities["file_format:format"];
  const img = canvas.overlayImage;
  const url = img?.toDataURL({ format: extension });
  url && downloadURI(url, `image.${extension}`);
}

function resetFilters(canvas: any, entities: Entities) {
  const img = canvas.overlayImage;
  if (!img) return;
  img.filters = [];
  applyFilters(canvas);
}

const rootReducer: ReducerMap = {
  apply_filter: applyInstagramFilters,
  set_blurriness: setBlurriness,
  increase_blurriness: increaseBlurriness,
  decrease_blurriness: decreaseBlurriness,
  set_brightness: setBrightness,
  increase_brightness: increaseBrightness,
  decrease_brightness: decreaseBrightness,
  set_contrast: setContrast,
  increase_contrast: increaseContrast,
  decrease_contrast: decreaseContrast,
  grayscale: grayscale,
  invert: invert,
  pixelate: pixelate,
  reset_filters: resetFilters,
  export_image: exportImage,
};

export default function reducer(action: AnalysedIntent, { canvas }: Deps) {
  const { intent, entities } = action;
  const handler = rootReducer[intent];
  if (handler) handler(canvas, entities);
}