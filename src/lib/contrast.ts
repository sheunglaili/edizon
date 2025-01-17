import { fabric } from "fabric";
import {
  applyFilters,
  boundarySanitization,
  round,
  locateFilters,
  safelyGetEntities,
  parseIntWithDefault,
} from "./utils";
import { Entities } from "../state/nlp/selector";

export function updateContrast(canvas: any, contrast: number) {
  const filter = new fabric.Image.filters.Contrast({
    contrast: round(contrast),
  });
  applyFilters(canvas, filter);
}

export function setContrast(canvas: any, entities: Entities) {
  const value  = safelyGetEntities(entities,"wit$number:number");
  const contrast = parseIntWithDefault(value,5) / 100;
  updateContrast(canvas, boundarySanitization(contrast, 1, -1));
}

export function increaseContrast(canvas: any, entities: Entities) {
  const oldFilter = locateFilters(canvas.overlayImage, "Contrast");
  const  value = safelyGetEntities(entities,"wit$number:number");
  const contrast = parseIntWithDefault(value,5) / 100 + (oldFilter?.contrast || 0);
  updateContrast(canvas, boundarySanitization(contrast, 1, -1));
}

export function decreaseContrast(canvas: any, entities: Entities) {
    const oldFilter = locateFilters(canvas.overlayImage, "Contrast");
    const  value  = safelyGetEntities(entities,"wit$number:number");
    const contrast = parseIntWithDefault(value,5) / 100 - (oldFilter?.contrast || 0);
    updateContrast(canvas, boundarySanitization(contrast, 1, -1));
}