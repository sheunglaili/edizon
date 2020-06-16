// export = ColorThief;

declare module "colorthief" {
  export = ColorThief;

  declare class ColorThief {
    constructor();

    getPalette(
      image: HTMLCanvasElement | HTMLImageElement,
      colorCount?: number,
      quality?: number
    ): [number, number, number];

    getColor(
      image: HTMLCanvasElement | HTMLImageElement,
      quality?: number
    ): [number, number, number];
  }
}
