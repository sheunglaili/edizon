import { fabric } from "fabric";
import * as ml5 from "ml5";
import { rejects } from "assert";

const BodyPix = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: "BodyPix",
  backgroundMask: undefined,
  blur: 0,
  initialize: function ({ blur }: any) {
    this.blur = blur;
  },
  imageFromUrl: async function (url: string) {
    return new Promise((resolve, rejects) => {
      fabric.Image.fromURL(url, function (img: any) {
        resolve(img);
      });
    });
  },
  applyTo: async function (options: any) {
    if (!options.webgl) await this.applyTo2d(options);
  },
  applyTo2d: async function (options: any) {
    let modelLoaded = false , finishingBlur = false;
    if (!this.model) {
      this.model = await ml5.bodyPix();
    }
    const model = this.model;
    const blur = this.blur;

    const originalImage = await this.imageFromUrl(options.canvasEl.toDataURL());

    const { segmentation, raw } = await model.segment(options.imageData);

    const c = document.createElement("canvas");
    c.width = options.canvasEl.width;
    c.height = options.canvasEl.height;
    c.getContext("2d")?.putImageData(raw.backgroundMask, 0, 0);

    const bgMaskUrl = c.toDataURL();

    const bgMaskImg = await this.imageFromUrl(bgMaskUrl);

    c.getContext("2d")?.putImageData(raw.personMask, 0, 0);

    const personMaskUrl = c.toDataURL();

    const personMaskImg = await this.imageFromUrl(personMaskUrl);

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
        blur,
      })
    );
    originalImage.applyFilters();

    const fCanvas = new fabric.StaticCanvas(c);

    fCanvas.add(originalImage);
    fCanvas.add(originalClone);

    const canvas = fCanvas.toCanvasElement();

    options.imageData = canvas
      .getContext("2d")
      ?.getImageData(0, 0, canvas.width, canvas.height);
  },
});

fabric.Image.filters.BodyPix = BodyPix;

export default BodyPix;
