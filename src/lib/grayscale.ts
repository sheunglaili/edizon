import { Entities } from "../state/nlp/selector";
import { applyFilters } from "./utils";
import { fabric } from "fabric";

export function grayscale(canvas: any, entities: Entities) {
  const filter = new fabric.Image.filters.Grayscale();
  applyFilters(canvas, filter);
}
