import { Entities } from "../state/nlp/selector";
import { fabric } from "fabric";
import { applyFilters, parseIntWithDefault, safelyGetEntities  } from "./utils";

export function pixelate(canvas: any, entities: Entities) {
  const value = safelyGetEntities(entities,"grid_size:size");
  const filter = new fabric.Image.filters.Pixelate({
    blocksize: parseIntWithDefault(value, 7),
  });
  applyFilters(canvas, filter);
}
