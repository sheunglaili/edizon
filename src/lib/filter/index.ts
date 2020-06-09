import { fabric } from "fabric";
import Lanrange from "../lagrange";
import map from "./filter";

// create fabric filter class
const InstagramFilter = fabric.util.createClass(
  fabric.Image.filters.BaseFilter,
  {
    type: "InstagramFilter",
    filterName: null,
    initialize: function (options: any) {
      const { filterName } = options;
      this.filterName = filterName;
      fabric.Image.filters.BaseFilter.prototype.initialize.call(this, options);
    },
    applyTo2d: function (options: any) {
      const imageData = options.imageData;
      const pix = imageData.data;

      const data = this.applyInstagramFilter({ pix });
      options.imageData = new ImageData(
        data,
        imageData.width,
        imageData.height
      );
    },
    applyInstagramFilter: function ({ pix }: any) {
      const newPix = pix.slice();
      const rgb = map[this.filterName];
      if (rgb) {
        console.debug("calculating filter", this.filterName);
        const lagrangeR = new Lanrange(0, 0, 1, 1),
          lagrangeG = new Lanrange(0, 0, 1, 1),
          lagrangeB = new Lanrange(0, 0, 1, 1);

        lagrangeR.addMultiPoints(rgb.r);
        lagrangeG.addMultiPoints(rgb.g);
        lagrangeB.addMultiPoints(rgb.b);

        for (let i = 0, len = pix.length; i < len; i += 4) {
          newPix[i] = lagrangeR.valueOf(pix[i]);
          newPix[i + 1] = lagrangeB.valueOf(pix[i + 1]);
          newPix[i + 2] = lagrangeG.valueOf(pix[i + 2]);
        }

        return newPix;
      } else {
        console.debug("filter not found", this.filterName);
        return pix;
      }
    },
  }
);

fabric.Image.filters.InstagramFilter = InstagramFilter;

export default InstagramFilter;