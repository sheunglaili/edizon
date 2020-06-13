import { Entities } from "../state/nlp/selector";
import { locateFilters, safelyGetEntities } from "./utils";

export function warmer(canvas: any, entities: Entities) {
  const oldFilter = locateFilters(canvas.overlayImage, "Gamma");
  const  value  = safelyGetEntities(entities,"wit$number:number");
  if (oldFilter) {
      
  }
}

export function colder(canvas: any, entities: Entities) {}
