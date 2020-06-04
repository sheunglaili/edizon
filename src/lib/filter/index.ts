import { fabric } from "fabric";
import Lanrange from "../lagrange";
import map from './filter'

// create fabric filter class
export default fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: "Instagram",
  filterName: null,
  initialize: function (options: any) {
    const { filterName } = options;
    this.filterName = filterName;
    fabric.Image.filters.BaseFilter.prototype.initialize.call(this, options);
  },
  applyTo: function (options: any) {
    this.applyTo2d(options);
  },
  applyTo2d: function (options: any) {
    const imageData = options.imageData;
    const pix = imageData.data;
    options.imageData = this.applyInstagramFilter({ pix });
  },
  applyInstagramFilter: function ({ pix }: any) {
    const newPix = pix.slice();
    const rgb = map[this.filterName];
    if (rgb) {
      const lagrangeR = new Lanrange(0, 0, 1, 1),
        lagrangeG = new Lanrange(0, 0, 1, 1),
        lagrangeB = new Lanrange(0, 0, 1, 1);

      lagrangeR.addMultiPoints(rgb.r);
      lagrangeG.addMultiPoints(rgb.g);
      lagrangeB.addMultiPoints(rgb.b);

      for (let i = 0, len = pix.length; i < len; i += 4) {
        newPix[i] = lagrangeR.valueOf(pix[i]);
        newPix[i + 1] = lagrangeG.valueOf(pix[i + 1]);
        newPix[i + 2] = lagrangeB.valueOf(pix[i + 2]);
      }

      return newPix;
    } else {
      return pix;
    }
  },
});
