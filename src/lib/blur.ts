import { fabric } from "fabric";
import {
  applyFilters,
  locateFilters,
  parseIntWithDefault,
  safelyGetEntities,
} from "./utils";
import { Entities } from "../state/nlp/selector";
import { BodyPix } from "./filter";
import * as ml5 from "ml5";

export function updateBlurriness(canvas: any, blurriness: number) {
  const filter = new fabric.Image.filters.Blur({
    blur: Math.round(blurriness * 1e2) / 1e2,
  });
  applyFilters(canvas, filter);
}

export function setBlurriness(canvas: any, entities: Entities) {
  const value = safelyGetEntities(entities, "wit$number:number") || "0";
  const blurriness = parseInt(value) / 100;
  updateBlurriness(canvas, blurriness > 1 ? 1 : blurriness);
}

export function getPreviousBlurriness(canvas: any) {
  const oldBlurFilter = locateFilters(canvas.overlayImage, "Blur");
  return oldBlurFilter ? oldBlurFilter.blur : 0;
}

export function increaseBlurriness(canvas: any, entities: Entities) {
  const oldBlurriness = getPreviousBlurriness(canvas);
  const value = safelyGetEntities(entities, "wit$number:number");
  const newBlurriness = oldBlurriness + parseInt(value) / 100;
  updateBlurriness(canvas, newBlurriness > 1 ? 1 : newBlurriness);
}

export function decreaseBlurriness(canvas: any, entities: Entities) {
  const oldBlurriness = getPreviousBlurriness(canvas);
  const value = safelyGetEntities(entities, "wit$number:number");
  const newBlurriness = oldBlurriness - parseInt(value) / 100;
  updateBlurriness(canvas, newBlurriness < 0 ? 0 : newBlurriness);
}

async function imageFromUrl(url: string): Promise<any> {
  return new Promise((resolve, rejects) => {
    fabric.Image.fromURL(url, function (img: any) {
      resolve(img);
    });
  });
}

export async function blurBackground(canvas: any, entities: Entities) {
  const value = safelyGetEntities(entities, "wit$number:number");
  const blurriness = parseIntWithDefault(value, 5) / 100;

  const model = await ml5.bodyPix();

  const originalImage = await imageFromUrl(canvas.overlayImage.toDataURL());
  const canvasEl = originalImage.toCanvasElement();

  const imageData = canvasEl
    .getContext("2d")
    ?.getImageData(0, 0, canvasEl.width, canvasEl.height);

  const { raw } = await model.segment(imageData);

  const c = document.createElement("canvas");
  c.width = canvasEl.width;
  c.height = canvasEl.height;
  c.getContext("2d")?.putImageData(raw.backgroundMask, 0, 0);

  const bgMaskUrl = c.toDataURL();

  const bgMaskImg = await imageFromUrl(bgMaskUrl);

  c.getContext("2d")?.putImageData(raw.personMask, 0, 0);

  const personMaskUrl = c.toDataURL();

  const personMaskImg = await imageFromUrl(personMaskUrl);

  //clone the original img for person mask operation
  const originalClone: any = await new Promise((resolve, rejects) => {
    originalImage.clone((img: any) => {
      resolve(img);
    });
  });

  // reposition orign to center
  personMaskImg.set({
    originX: "center",
    originY: "center",
  });

  originalClone.set({
    clipPath: personMaskImg,
  });

  // reposition origin to center
  bgMaskImg.set({
    originX: "center",
    originY: "center",
  });

  //clip by the mask Image to get the background
  originalImage.set({
    clipPath: bgMaskImg,
  });
  //blur the background image
  originalImage?.filters?.push(
    new fabric.Image.filters.Blur({
      blur: blurriness,
    })
  );
  originalImage.applyFilters();

  const fCanvas = new fabric.StaticCanvas(c);

  fCanvas.add(originalImage);
  fCanvas.add(originalClone);

  const finalCanvas = fCanvas.toCanvasElement();

  const filter = new BodyPix({
    imageData: finalCanvas
      .getContext("2d")
      .getImageData(0, 0, finalCanvas.width, finalCanvas.height),
  });

  applyFilters(canvas, filter);
  console.log("finish apply ");
}
