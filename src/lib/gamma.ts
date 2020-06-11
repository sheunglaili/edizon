import { Entities } from "../state/nlp/selector";
import { locateFilters } from "./utils";

export function warmer(canvas: any, entities: Entities) {
  const oldFilter = locateFilters(canvas.overlayImage, "Gamma");
  const [{ value }] = entities["wit$number:number"];
  if (oldFilter) {
      
  }
}

export function colder(canvas: any, entities: Entities) {}
