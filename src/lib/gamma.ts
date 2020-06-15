import { Entities } from "../state/nlp/selector";
import {
  locateFilters,
  safelyGetEntities,
  parseIntWithDefault,
  round,
  applyFilters,
  boundarySanitization,
} from "./utils";
import { fabric } from "fabric";

function extract(canvas: any, entities: Entities) {
  const oldFilter = locateFilters(canvas.overlayImage, "Gamma");
  const value = safelyGetEntities(entities, "wit$number:number");
  const percentagae = parseIntWithDefault(value, 5) / 100;
  return [oldFilter, percentagae];
}

export function setGamma(canvas: any, r: number, g: number, b: number) {
  const filter = new fabric.Image.filters.Gamma({
    gamma: [r, g, b],
  });
  applyFilters(canvas, filter);
}

export function warmer(canvas: any, entities: Entities) {
  const [oldFilter, percentage] = extract(canvas, entities);
  if (oldFilter) {
    let [r, g, b] = oldFilter.gamma;
    let value = round(percentage * 1.1);
    if (b > 1) {
      b = b - value;
      if (b < 1) {
        value = 1 - b;
        b = 1;
      } else {
        value = 0;
      }
    }
    let newR = value < 0 ? 1 : r + value;
    setGamma(
      canvas,
      boundarySanitization(newR, 2.2, 0.01),
      g,
      boundarySanitization(b, 2.2, 0.01)
    );
  } else {
    const value = round(percentage * 1.1);
    const newR = value > 0 ? 1 + value : 1;
    setGamma(canvas, boundarySanitization(newR, 2.2, 1), 1, 1);
  }
}

export function cooler(canvas: any, entities: Entities) {
  const [oldFilter, percentage] = extract(canvas, entities);
  if (oldFilter) {
    let [r, g, b] = oldFilter.gamma;
    let value = round(percentage * 1.1);
    if (r > 1) {
      r =  r - value; 
      if (r < 1) {
        value = 1 - r;
        r = 1;
      } else {
        value = 0;
      }
    }
    let newB = value < 0 ? 1 : b + value;
    setGamma(
      canvas,
      boundarySanitization(r, 2.2, 1),
      g,
      boundarySanitization(newB, 2.2, 1)
    );
  } else {
    const value = round(percentage * 1.1);
    const newB = value > 0 ? 1 + value : 1;
    setGamma(canvas, 1, 1, boundarySanitization(newB, 2.2, 1));
  }
}
