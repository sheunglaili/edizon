import { fabric } from "fabric";

export function locateFilters(img: any, type: string) {
  console.log(img.filters)
  return img.filters.find((filter: any) => filter.type === type);
}

export function locateAndRemoveFilters(canvas: any, type: string) {
  const img = canvas.overlayImage;
  const filter = locateFilters(img, type);
  fabric.util.removeFromArray(img.filters, filter);
  return filter;
}

export function boundarySanitization(
  number: number,
  upper: number,
  lower: number
) {
  if (upper < lower)
    throw new Error("Upper boundary cannot be less than lower boundary");
  const acrossZero = lower < 0 || upper < 0;
  if (acrossZero) {
    if (number > 0 && number > upper) {
      return upper;
    } else if (number < 0 && number < lower) {
      return lower;
    }
  } else {
    if (number < lower) return lower;
    if (number > upper) return upper;
  }
  return number;
}

export function applyFilters(canvas: any, filter?: any) {
  console.log("applying filter ", filter);
  const img = canvas.overlayImage;
  if (filter && img) {
    locateAndRemoveFilters(canvas, filter.type);
    img?.filters?.push(filter);
  }
  img?.applyFilters();
  canvas.renderAll();
}

export function parseIntWithDefault(numStr: string, defaultNum: number) {
  const parsed = parseInt(numStr);
  return parsed || defaultNum;
}

/**
 * @summary round number to decimant place . default is 2
 * @param num
 * @param decimanPlace
 */
export function round(num: number, decimanPlace: number = 2) {
  let pow = Math.pow(10, decimanPlace);
  return Math.round(num * pow) / pow;
}
