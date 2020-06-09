import { Entities } from "../state/nlp/selector";
import { fabric } from "fabric";
import { applyFilters } from "./utils";

export function invert(canvas: any, entities: Entities) {
  const filter = new fabric.Image.filters.Invert();
  applyFilters(canvas, filter);
}
