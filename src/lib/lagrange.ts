/**
 * At least two points are needed to interpolate something.
 * @class Lagrange polynomial interpolation.
 * The computed interpolation polynomial will be reffered to as L(x).
 * @example
 * let l = new Lagrange(0, 0, 1, 1);
 * let index = l.addPoint(0.5, 0.8);
 * console.log(l.valueOf(0.1));
 *
 * l.changePoint(index, 0.5, 0.1);
 * console.log(l.valueOf(0.1));
 *
 * @see https://gist.github.com/dburner/8550030
 * @see http://jsfiddle.net/maccesch/jgU3Y/
 * credit to kenju @see https://github.com/kenju/instagram_js_filter/blob/a7b040075b243b7b26e1a0e2b11cce4ab18ead8f/src/computation/lagrange.js
 */
export default class Lagrange {
  private xs: number[];
  private ys: number[];
  private ws: number[];

  constructor(x1: number, x2: number, y1: number, y2: number) {
    this.xs = [x1, x2];
    this.ys = [y1, y2];
    this.ws = [];
    this.updateWeight();
  }

  /**
   * @summary Add a new point to the polynomial. L(x) = y
   * @param x {Number}
   * @param y {Number}
   * @return {Number} The index of the added point.
   */
  public addPoint(x: number, y: number): number {
    this.xs.push(x);
    this.ys.push(y);
    this.updateWeight();
    return this.xs.length - 1;
  }

  /**
   * @summary Recalculate barycentric weights
   */
  private updateWeight(): void {
    const len = this.xs.length;
    let weight;
    for (let i = 0; i < len; ++i) {
      weight = 1;
      for (let j = 0; j < len; ++j) {
        if (j !== i) {
          weight *= this.xs[i] - this.xs[j];
        }
      }
      this.ws[i] = 1 / weight;
    }
  }

  /**
   * Calculate L(x)
   * @param x
   */
  public valueOf(x: number): number {
    let a = 0,
      b = 0,
      c = 0;

    const len = this.xs.length;
    for (let i = 0; i < len; ++i) {
      if (x !== this.xs[i]) {
        a = this.ws[i] / (x - this.xs[i]);
        b += a * this.ys[i];
        c += a;
      } else {
        return this.ys[i];
      }
    }
    return b / c;
  }

  public addMultiPoints(arr: number[][]) : void {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      if (arr[i][0] !== 0 && arr[i][0] !== 1) {
        this.addPoint(arr[i][1], arr[i][2]);
      }
    }
  }
}
