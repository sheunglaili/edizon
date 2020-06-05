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
    fragmentSource: `
    precision lowp float;
 
 varying highp vec2 textureCoordinate;
 
 uniform sampler2D inputImageTexture;
 uniform sampler2D inputImageTexture2;
 
 void main()
 {
     vec3 texel = texture2D(inputImageTexture, textureCoordinate).rgb;
     
     vec2 lookup;
     lookup.y = .5;
     
     lookup.x = texel.r;
     texel.r = texture2D(inputImageTexture2, lookup).r;
     
     lookup.x = texel.g;
     texel.g = texture2D(inputImageTexture2, lookup).g;
     
     lookup.x = texel.b;
     texel.b = texture2D(inputImageTexture2, lookup).b;
     
     gl_FragColor = vec4(texel, 1.0);
 }`,
    applyTo2d: function (options: any) {
      const imageData = options.imageData;
      const pix = imageData.data;
      options.imageData = this.applyInstagramFilter({ pix });
    },
    applyInstagramFilter: function ({ pix }: any) {
      console.log("calculating filter");
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
  }
);

((fabric.Image.filters as unknown) as any).InstagramFilter = InstagramFilter;

export default InstagramFilter;
