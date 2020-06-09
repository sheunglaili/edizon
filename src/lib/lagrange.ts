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

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.xs = [x1, x2];
    this.ys = [y1, y2];
    this.ws = [];
    this.updateWeights();
  }

  /**
   * Adds a new point to the polynomial. L(x) = y
   * @return {Number} The index of the added point. Used for changing the point. See changePoint.
   */
  addPoint(x: number, y: number) {
    this.xs.push(x);
    this.ys.push(y);
    this.updateWeights();
    return this.xs.length - 1;
  }
  /**
   * Recalculate barycentric weights.
   */
  private updateWeights() {
    let len = this.xs.length; // the number of points
    let weight;
    for (let j = 0; j < len; ++j) {
      weight = 1;
      for (let i = 0; i < len; ++i) {
        if (i !== j) {
          weight *= this.xs[j] - this.xs[i];
        }
      }
      this.ws[j] = 1 / weight;
    }
  }
  /**
   * Calculate L(x)
   */
  valueOf(x: number) {
    let a = 0;
    let b = 0;
    let c = 0;
    for (let j = 0; j < this.xs.length; ++j) {
      if (x !== this.xs[j]) {
        a = this.ws[j] / (x - this.xs[j]);
        b += a * this.ys[j];
        c += a;
      } else {
        return this.ys[j];
      }
    }
    return b / c;
  }

  addMultiPoints(arr: number[][]) {
    for (let i = 0, n = arr.length; i < n; i++) {
      if (arr[i][0] !== 0 && arr[i][0] !== 1) {
        this.addPoint(arr[i][1], arr[i][2]);
      }
    }
  }
}
