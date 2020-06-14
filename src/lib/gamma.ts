import { Entities } from "../state/nlp/selector";
import { locateFilters, safelyGetEntities, parseIntWithDefault, round, applyFilters } from "./utils";
import { fabric } from 'fabric';


function extract(canvas: any, entities: Entities) {
  const oldFilter = locateFilters(canvas.overlayImage, "Gamma");
  const value = safelyGetEntities(entities, "wit$number:number");
  const percentagae = parseIntWithDefault(value, 5) / 100;
  return [oldFilter, percentagae]
}

export function setGamma(canvas: any, r: number, g: number, b: number) {
  const filter = new fabric.Image.filters.Gamma({
    gamma: [r, g, b]
  });
  applyFilters(canvas, filter);
}

export function inceraseWarmness(canvas: any, entities: Entities) {
  const [oldFilter, percentage] = extract(canvas, entities);
  if (oldFilter) {
    const [r, g, b] = oldFilter.gamma;
    const newR = r + round(percentage * 2.2);
    setGamma(canvas, newR > 2.2 ? 2.2 : newR, g, b);
  } else {
    const newR = 1 + round(percentage * 2.2);
    setGamma(canvas, newR, 1, 1);
  }
}

export function decreaseWarmness(canvas: any, entities: Entities) {
  const [oldFilter, percentage] = extract(canvas, entities);
  if (oldFilter) {
    const [r, g, b] = oldFilter.gamma;
    const newR = r - round(percentage * 2.2);
    setGamma(canvas, newR < 0.01 ? 0.01 : newR, g, b);
  } else {
    const newR = 1 + round(percentage * 2.2);
    setGamma(canvas, newR, 1, 1);
  }
}

export function increaseColdness(canvas: any, entities: Entities) {
  const [oldFilter, percentage] = extract(canvas, entities);
  if (oldFilter) {
    const [r, g, b] = oldFilter.gamma;
    const newB = b - round(percentage * 2.2);
    setGamma(canvas, r, g, newB > 2.2 ? 2.2 : newB)
  } else {
    const newB = 1 + round(percentage * 2.2);
    setGamma(canvas, 1, 1, newB > 2.2 ? 2.2 : newB)
  }
}

export function decreaseColdness(canvas: any, entities: Entities) {
  const [oldFilter, percentage] = extract(canvas, entities);
  if (oldFilter) {
    const [r, g, b] = oldFilter.gamma;
    const newB = b - round(percentage * 2.2);
    setGamma(canvas, r, g, newB < 0.01 ? 0.01 : newB)
  } else {
    const newB = 1 + round(percentage * 2.2);
    setGamma(canvas , 1 , 1 , newB < 0.01 ? 0.01 : newB)
  }
}