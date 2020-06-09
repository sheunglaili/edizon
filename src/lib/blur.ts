import { fabric } from "fabric";
import { applyFilters , locateFilters   } from './utils'
import { Entities } from "../state/nlp/selector";


export function updateBlurriness(canvas: any, blurriness: number) {
  const filter = new fabric.Image.filters.Blur({
    blur: Math.round(blurriness * 1e2) / 1e2,
  });
  applyFilters(canvas, filter);
}

export function setBlurriness(canvas: any, entities: Entities) {
  const [{ value }] = entities["wit$number:number"];
  const blurriness = parseInt(value) / 100;
  updateBlurriness(canvas, blurriness > 1 ? 1 : blurriness);
}

export function getAndRemovePreviousBlurriness(canvas: any) {
  const oldBlurFilter = locateFilters(canvas, "Blur");
  return oldBlurFilter ? oldBlurFilter.blur : 0;
}

export function increaseBlurriness(canvas: any, entities: Entities) {
  const oldBlurriness = getAndRemovePreviousBlurriness(canvas);
  const [{ value }] = entities["wit$number:number"];
  const newBlurriness = oldBlurriness + parseInt(value) / 100;
  updateBlurriness(canvas, newBlurriness > 1 ? 1 : newBlurriness);
}

export function decreaseBlurriness(canvas: any, entities: Entities) {
  const oldBlurriness = getAndRemovePreviousBlurriness(canvas);
  const [{ value }] = entities["wit$number:number"];
  const newBlurriness = oldBlurriness - parseInt(value) / 100;
  updateBlurriness(canvas, newBlurriness < 0 ? 0 : newBlurriness);
}
