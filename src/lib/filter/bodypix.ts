import { fabric } from "fabric";
import * as ml5 from "ml5";

const BodyPix = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: "BodyPix",
  backgroundMask: undefined,
  blur: 0,
  imageData: [],
  initialize: function ({ imageData }: any) {
    this.imageData = imageData;
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
    options.imageData = this.imageData;
  },
});

fabric.Image.filters.BodyPix = BodyPix;

export default BodyPix;
