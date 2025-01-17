import { AnalysedIntent, Entities } from "../state/nlp/selector";
import { Instagram } from "./filter";
import { applyFilters, safelyGetEntities } from "./utils";
import {
  setBlurriness,
  increaseBlurriness,
  decreaseBlurriness,
  blurBackground,
} from "./blur";
import {
  setBrightness,
  increaseBrightness,
  decreaseBrightness,
} from "./brightness";
import { setContrast, increaseContrast, decreaseContrast } from "./contrast";
import { grayscale } from "./grayscale";
import { invert } from "./invert";
import { pixelate } from "./pixelate";
import { warmer, cooler } from "./gamma";
import { fabric } from "fabric";

interface Deps {
  canvas: any;
}

interface ReducerMap {
  [intent: string]: (canvas: any, entities: Entities) => void | Promise<void>;
}

function applyInstagramFilters(canvas: any, entities: Entities) {
  const value = safelyGetEntities(entities, "vedit_filter:vedit_filter");
  const filter = new Instagram({ filterName: value });
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
  const extension = safelyGetEntities(entities, "file_format:format", "png");
  const img = canvas.overlayImage;
  const url = img?.toDataURL({ format: extension, enableRetinaScaling: true });
  url && downloadURI(url, `image.${extension}`);
}

function resetFilters(canvas: any, entities: Entities) {
  const img = canvas.overlayImage;
  if (!img) return;
  img.filters = [];
  applyFilters(canvas);
}

function undo(canvas: any, entities: Entities) {
  const img = canvas.overlayImage;
  fabric.util.removeFromArray(img.filters, img.filters[img.filters.length - 1]);
  applyFilters(canvas);
}

const rootReducer: ReducerMap = {
  apply_filter: applyInstagramFilters,
  set_blurriness: setBlurriness,
  increase_blurriness: increaseBlurriness,
  decrease_blurriness: decreaseBlurriness,
  blur_background: blurBackground,
  set_brightness: setBrightness,
  increase_brightness: increaseBrightness,
  decrease_brightness: decreaseBrightness,
  set_contrast: setContrast,
  increase_contrast: increaseContrast,
  decrease_contrast: decreaseContrast,
  warmer: warmer,
  cooler: cooler,
  grayscale: grayscale,
  invert: invert,
  pixelate: pixelate,
  undo: undo,
  reset_filters: resetFilters,
  export_image: exportImage,
};

interface ReducerOptions {
  onComplete: (deps: Deps) => void;
  onError: (deps: Deps, err: Error) => void;
}

export default async function reducer(
  action: AnalysedIntent,
  deps: Deps,
  options?: ReducerOptions
) {
  const { onComplete = () => {}, onError = () => {} } = options || {};
  const { canvas } = deps;
  const { intent, entities } = action;
  const handler = rootReducer[intent || ""];
  if (handler) {
    try {
      const res = handler(canvas, entities);
      if (res && res instanceof Promise) {
        await res;
        onComplete(deps);
        return;
      }
    } catch (error) {
      onError(deps, error);
    }
  }
  onComplete(deps);
}
