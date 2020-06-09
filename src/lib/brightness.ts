import { fabric } from "fabric";
import {
  applyFilters,
  locateAndRemoveFilters,
  boundarySanitization,
  parseIntWithDefault,
} from "./utils";
import { Entities } from "../state/nlp/selector";

export function getAndRemovePreviousBrightness(canvas: any) {
  const oldBrightnessFilter = locateAndRemoveFilters(canvas, "Brightness");
  return oldBrightnessFilter?.brightness || 0;
}

export function updateBrightness(canvas: any, brightness: number) {
  const filter = new fabric.Image.filters.Brightness({
    brightness: Math.round(brightness * 1e2) / 1e2,
  });
  applyFilters(canvas, filter);
}

export function setBrightness(canvas: any, entities: Entities) {
  locateAndRemoveFilters(canvas, "Brightness"); // remove old filter
  const [{ value }] = entities["wit$number:number"];
  const brightness = parseIntWithDefault(value, 5) / 100;
  updateBrightness(canvas, brightness);
}

export function increaseBrightness(canvas: any, entities: Entities) {
  const oldBrightness = getAndRemovePreviousBrightness(canvas);
  const [{ value }] = entities["wit$number:number"];
  const newBrightness = oldBrightness + parseIntWithDefault(value, 5) / 100;
  updateBrightness(canvas, boundarySanitization(newBrightness, 1, -1));
}

export function decreaseBrightness(canvas: any, entities: Entities) {
  const oldBrightness = getAndRemovePreviousBrightness(canvas);
  const [{ value }] = entities["wit$number:number"];
  const newBrightness = oldBrightness - parseIntWithDefault(value, 5) / 100;
  updateBrightness(canvas, boundarySanitization(newBrightness, 1, -1));
}
