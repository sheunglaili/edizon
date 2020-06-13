import { fabric } from "fabric";
import {
  applyFilters,
  boundarySanitization,
  parseIntWithDefault,
  locateFilters,
  safelyGetEntities,
} from "./utils";
import { Entities } from "../state/nlp/selector";

export function getPreviousBrightness(canvas: any) {
  const oldBrightnessFilter = locateFilters(canvas.overlayImage, "Brightness");
  return oldBrightnessFilter?.brightness || 0;
}

export function updateBrightness(canvas: any, brightness: number) {
  const filter = new fabric.Image.filters.Brightness({
    brightness: Math.round(brightness * 1e2) / 1e2,
  });
  applyFilters(canvas, filter);
}

export function setBrightness(canvas: any, entities: Entities) {
  const value  = safelyGetEntities(entities,"wit$number:number");
  const brightness = parseIntWithDefault(value, 5) / 100;
  updateBrightness(canvas, brightness);
}

export function increaseBrightness(canvas: any, entities: Entities) {
  const oldBrightness = getPreviousBrightness(canvas);
  const  value  = safelyGetEntities(entities,"wit$number:number");
  const newBrightness = oldBrightness + parseIntWithDefault(value, 5) / 100;
  updateBrightness(canvas, boundarySanitization(newBrightness, 1, -1));
}

export function decreaseBrightness(canvas: any, entities: Entities) {
  const oldBrightness = getPreviousBrightness(canvas);
  const  value  = safelyGetEntities(entities,"wit$number:number");
  const newBrightness = oldBrightness - parseIntWithDefault(value, 5) / 100;
  updateBrightness(canvas, boundarySanitization(newBrightness, 1, -1));
}
