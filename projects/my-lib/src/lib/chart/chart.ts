import {
  ChartOption,
  DoublePoint,
  Point, ProdChartOption,
  ProdSerial,
  SerialAndIndex,
  XPoint
} from './chart.interface';
const defaultSerialConfig = {
  showIndicate: true,
  thickness: 40,
  indicatorPercent: 0.5,
  indicatorOffset: 0,
  indicatorLength: 40,
  indicatorOffsetAngle: 0
};
export class RoseChart {
  private width: number;
  private height: number;
  private centerX: number;
  private centerY: number;
  private radiusGap: number;
  private minRadius: number;
  private inCircle: boolean;
  private hoverScale: number;
  private animationStep = 0.6;
  private devicePixelRatio = 1;
  private currentSelected = -1;
  private series: ProdSerial[];
  private can: HTMLCanvasElement;
  private svg: any;
  private pathList: HTMLElement[] = [];
  private parentDom: HTMLElement;
  private initAngle = -Math.PI / 2;
  private containerDom: HTMLElement;
  private pen: CanvasRenderingContext2D;
  private maxRadius: number | undefined;
  private activeItem: SerialAndIndex;
  private currentSvg: HTMLElement;
  private prevSvg: HTMLElement;
  private defaultOffset = true;
  public prodOption: ProdChartOption;
  private option: ChartOption;
  private renderMode = 'svg';
  constructor(opt: ChartOption) {
    this.option = opt;
  }

  init() {
    this.initParams();
    this.create();
  }
  public update(op?: ChartOption) {
    if (op) {
      this.option = op;
    }
    this.containerDom.innerHTML = '';
    this.init();
  }

  initParams() {
    this.prodOption = JSON.parse(JSON.stringify(this.option));
    if (this.prodOption.hasOwnProperty('initAngle')) {
      this.initAngle = this.prodOption.initAngle;
    }
    if (this.prodOption.hasOwnProperty('defaultOffset')) {
      this.defaultOffset = this.prodOption.defaultOffset;
    }
    if (this.prodOption.renderMode) {
      this.renderMode = this.prodOption.renderMode;
    }
    if (this.prodOption.series.length === 1) {
      this.renderMode = 'canvas';
    }
    this.parentDom = document.getElementById(this.prodOption.id);
    const width = this.parentDom.offsetWidth;
    const height = this.parentDom.offsetHeight;
    this.width = width;
    this.height = height;
    if (!this.containerDom) {
      this.containerDom = document.createElement('div');
      this.containerDom.style.cssText += `position:relative;display:inline-block`;
      this.containerDom.style.cssText += `width: ${width}px;height:${height}px;`;
    }
    this.centerX = width / 2 + (this.option.offsetX || 0);
    this.centerY = height / 2 + (this.option.offsetY || 0);
    this.minRadius = this.prodOption.radius[0];
    this.maxRadius = this.prodOption.radius[1];
    if (this.maxRadius) {
      this.radiusGap = this.maxRadius - this.minRadius;
    }
  }
  create() {
    this.calculateRadius();
    this.initDraw();
    this.drawHtml();
    this.addMoveHandler();
    this.addResizeHandler();
  }
  public destroy() {
    this.containerDom.removeEventListener(
      'mousemove',
      this.mouseMoveHandler.bind(this),
      false
    );
    if (
      this.prodOption.triggerType &&
      this.prodOption.triggerType === 'click'
    ) {
      this.containerDom.removeEventListener(
        'click',
        this.clickOrMouseoverHandler.bind(this),
        false
      );
    }
    window.removeEventListener('resize', this.resizeHandler.bind(this), false);
    this.parentDom.removeChild(this.containerDom);
  }
  // calculate angle
  calculateRadius() {
    const series: ProdSerial[] = this.prodOption.series;
    const arr = [];
    const thickness = [];
    let total = 0;
    series.map(item => {
      total += item.value;
      arr.push(item.value);
      if (item.thickness) {
        thickness.push(item.thickness);
      }
    });
    const maxVal = Math.max.apply(null, arr);
    if (thickness.length > 0) {
      const maxThickness = Math.max.apply(null, thickness);
      this.maxRadius = maxThickness + this.minRadius;
    }
    for (let i = 0, len = series.length; i < len; i++) {
      series[i] = Object.assign({}, defaultSerialConfig, series[i]);
      series[i].angleScope = (Math.PI * 2 * series[i].value) / total;
      if (i > 0) {
        series[i].startAngle = series[i - 1].endAngle;
      } else {
        series[i].startAngle = this.initAngle;
      }
      if (series[i].startAngle > Math.PI) {
        series[i].startAngle = series[i].startAngle - Math.PI * 2;
      }
      if (this.radiusGap) {
        series[i].radius =
          this.minRadius + (this.radiusGap * series[i].value) / maxVal;
      } else {
        series[i].radius = this.minRadius + series[i].thickness;
      }
      if (i > 0) {
        series[i].endAngle = series[i - 1].endAngle + series[i].angleScope;
        series[i].indicatorAngle =
          series[i - 1].endAngle +
          series[i].angleScope * series[i].indicatorPercent;
      } else {
        series[i].endAngle = series[i].angleScope + this.initAngle;
        series[i].indicatorAngle =
          series[i].angleScope * series[i].indicatorPercent + this.initAngle;
      }
      if (series[i].endAngle > Math.PI && series.length > 1) {
        series[i].endAngle = series[i].endAngle - Math.PI * 2;
      }
      if (series[i].indicatorAngle > Math.PI && series.length > 1) {
        series[i].indicatorAngle = series[i].indicatorAngle - Math.PI * 2;
      }
      series[i].indicatorPointX1 =
        (series[i].radius + series[i].indicatorOffset) *
          Math.cos(series[i].indicatorAngle) +
        this.centerX;
      series[i].indicatorPointY1 =
        (series[i].radius + series[i].indicatorOffset) *
          Math.sin(series[i].indicatorAngle) +
        this.centerY;
      series[i].indicatorPointX2 =
        series[i].indicatorLength * Math.cos(series[i].indicatorAngle) +
        series[i].indicatorPointX1;
      series[i].indicatorPointY2 =
        series[i].indicatorLength * Math.sin(series[i].indicatorAngle) +
        series[i].indicatorPointY1;
      // custom offsetAngle
      const indicatorAngle = series[i].indicatorAngle;
      if (series[i].indicatorOffsetAngle) {
        if (series[i].indicatorOffsetAngle <= -Math.PI / 2) {
          series[i].indicatorOffsetAngle = -Math.PI / 2;
        }
        if (series[i].indicatorOffsetAngle >= Math.PI / 2) {
          series[i].indicatorOffsetAngle = Math.PI / 2;
        }
        const finalAngle = indicatorAngle + series[i].indicatorOffsetAngle;
        series[i].indicatorPointY2 =
          series[i].indicatorPointY1 +
          series[i].indicatorLength * Math.sin(finalAngle);
        series[i].indicatorPointX2 =
          series[i].indicatorPointX1 +
          series[i].indicatorLength * Math.cos(finalAngle);
      }
    }
    this.series = series;
  }
  draw(drawEntity: ProdSerial, isMask?: boolean, fadeIn?: boolean, isSvg?: boolean) {
    if (this.renderMode === 'canvas') {
      this.pen.beginPath();
      this.pen.fillStyle = drawEntity.color;
      if (fadeIn && drawEntity.highLightColor) {
        this.pen.fillStyle = drawEntity.highLightColor;
      }
      this.pen.moveTo(this.centerX, this.centerY);
      this.pen.arc(
        this.centerX,
        this.centerY,
        drawEntity.radius,
        drawEntity.startAngle,
        drawEntity.endAngle
      );
      this.pen.fill();
      this.pen.closePath();
      if (drawEntity.indicatorPointX1 && drawEntity.showIndicate && !isMask) {
        this.pen.beginPath();
        this.pen.strokeStyle = drawEntity.color;
        if (fadeIn && drawEntity.highLightColor) {
          this.pen.strokeStyle = drawEntity.highLightColor;
        }
        this.pen.moveTo(drawEntity.indicatorPointX1, drawEntity.indicatorPointY1);
        this.pen.lineWidth = 1;
        this.pen.lineTo(drawEntity.indicatorPointX2, drawEntity.indicatorPointY2);
        this.pen.stroke();
        this.pen.closePath();
      }
      this.pen.save();
    } else if (this.renderMode === 'svg') {
      if (this.hoverScale > 1) {
        const params = this.calculateParams(drawEntity);
        // TODO
        const largeArcFlag = drawEntity.angleScope < Math.PI ? 0 : 1;
        if (isSvg) {
          this.prevSvg.setAttribute('d', `M ${params.centerX} ${params.centerY}
    L ${params.x} ${params.y} A ${params.radius} ${params.radius} 0 ${largeArcFlag} 1 ${params.x1} ${params.y1}`);
        } else {
          this.currentSvg.setAttribute('d', `M ${params.centerX} ${params.centerY}
    L ${params.x} ${params.y} A ${params.radius} ${params.radius} 0 ${largeArcFlag} 1 ${params.x1} ${params.y1}`);
        }
      } else {
        if (isSvg) {
          this.prevSvg.style.fill = drawEntity.color;
        } else {
          this.currentSvg.style.fill = drawEntity.highLightColor;
        }
      }
    }
  }
  drawMask() {
    if (this.renderMode === 'canvas') {
      this.draw(
        {
          color: '#fff',
          highLightColor: '#fff',
          startAngle: 0,
          endAngle: Math.PI * 2,
          radius: this.minRadius,
          value: 100
        },
        true
      );
    }
  }
  drawHtml() {
    if (this.prodOption.circleTxt) {
      const inner = document.createElement('div');
      inner.style.cssText += `position:absolute;top:${this.centerY}px;left:${this.centerX}px;
      transform:translate(-50%, -50%);z-index: 10;`;
      inner.innerHTML = this.prodOption.circleTxt;
      this.containerDom.appendChild(inner);
    }
    for (const item of this.series) {
      if (item.indicateTxt && item.showIndicate) {
        const tooltipDiv = document.createElement('div');
        tooltipDiv.style.cssText += `position:absolute;top:${item.indicatorPointY2}px;`;
        if (item.indicatorPointX2 > this.centerX) {
          if (this.defaultOffset) {
            tooltipDiv.style.cssText += `left:${item.indicatorPointX2 +
              10 +
              (item.indicateOffsetX || 0)}px;`;
          } else {
            tooltipDiv.style.cssText += `left:${item.indicatorPointX2 +
              (item.indicateOffsetX || 0)}px;`;
          }
        } else {
          if (this.defaultOffset) {
            tooltipDiv.style.cssText += `right:${this.width -
              item.indicatorPointX2 +
              10 -
              (item.indicateOffsetX || 0)}px;`;
          } else {
            tooltipDiv.style.cssText += `right:${this.width -
              item.indicatorPointX2 -
              (item.indicateOffsetX || 0)}px;`;
          }
        }
        if (item.indicatorPointY2 < this.centerY) {
          if (this.defaultOffset) {
            tooltipDiv.style.cssText += `top:${item.indicatorPointY2 -
            10 +
            (item.indicateOffsetY || 0)}px;`;
          } else {
            tooltipDiv.style.cssText += `top:${item.indicatorPointY2 +
              (item.indicateOffsetY || 0)}px;`;
          }
        } else {
          if (this.defaultOffset) {
            tooltipDiv.style.cssText += `top:${item.indicatorPointY2 -
            8 +
            (item.indicateOffsetY || 0)}px;`;
          } else {
            tooltipDiv.style.cssText += `top:${item.indicatorPointY2 +
              (item.indicateOffsetY || 0)}px;`;
          }
        }
        if (Math.abs(Math.abs(item.indicatorAngle) - Math.PI / 2) <= Math.PI / 10) {
          if (item.indicatorPointY2 < this.centerY) {
            tooltipDiv.style.cssText += `top:${item.indicatorPointY2 -
            20 +
            (item.indicateOffsetY || 0)}px;`;
          } else {
            tooltipDiv.style.cssText += `top:${item.indicatorPointY2 +
            1 +
            (item.indicateOffsetY || 0)}px;`;
          }
          if (Math.abs(item.indicatorAngle) >= Math.PI / 2) {
            tooltipDiv.style.cssText += `right:${this.width -
            item.indicatorPointX2 - 4
            -
            (item.indicateOffsetX || 0)}px;`;
          } else {
            tooltipDiv.style.cssText += `left:${item.indicatorPointX2 +
            1 +
            (item.indicateOffsetX || 0)}px;`;
          }
        }
        tooltipDiv.innerHTML = item.indicateTxt;
        this.containerDom.appendChild(tooltipDiv);
      }
    }
  }
  initDraw() {
    if (this.renderMode === 'canvas') {
      this.can = document.createElement('canvas');
      this.can.style.cssText += `width:${this.width}px;height:${this.height}px;`;
      this.can.width = this.width;
      this.can.height = this.height;
      this.pen = this.can.getContext('2d');
      this.containerDom.appendChild(this.can);
      this.parentDom.appendChild(this.containerDom);
      if (window.devicePixelRatio) {
        const ratio = window.devicePixelRatio;
        this.devicePixelRatio = ratio;
        this.can.height = this.height * ratio;
        this.can.width = this.width * ratio;
        this.pen.scale(ratio, ratio);
      }
      this.pen.clearRect(0, 0, this.width, this.height);
      for (const item of this.series) {
        this.draw(item);
      }
      this.drawMask();
    } else if (this.renderMode === 'svg') {
      this.drawSvg();
    }
  }
  createSvgEl(tag: string, attrs: any): any {
    const svgOrg = 'http://www.w3.org/2000/svg';
    const linkNs = 'http://www.w3.org/1999/xlink';
    const ATTR_MAP = {
      className: 'class',
      svgHref: 'href'
    };

    const NS_MAP = {
      svgHref: linkNs
    };
    const d = document.createElementNS(svgOrg, tag);
    Object.keys(attrs).forEach(attr => {
      const attName = (attr in ATTR_MAP ? ATTR_MAP[attr] : attr);
      const val = attrs[attr];
      if (attr in NS_MAP) {
        d.setAttributeNS(NS_MAP[attr], attName, val);
      } else {
        d.setAttribute(attName, val);
      }
    });
    return d;
  }
  calculateParams(serial: ProdSerial) {
    const centerX = this.centerX;
    const centerY = this.centerY;
    const radius = serial.radius;
    const x = centerX + Math.cos(serial.startAngle) * radius;
    const y = centerY + Math.sin(serial.startAngle) * radius;
    const x1 = centerX + Math.cos(serial.endAngle) * radius;
    const y1 = centerY + Math.sin(serial.endAngle) * radius;
    return {centerX, centerY, radius, x, y, x1, y1};
  }
  drawSvg() {
    this.svg = this.createSvgEl('svg', {
      width: this.width,
      height: this.height,
      viewBox: `0 0 ${this.width} ${this.height}`
    });
    for (let i = 0, len = this.series.length; i < len; i++) {
      const item = this.series[i];
      const params = this.calculateParams(item);
      const largeArcFlag = item.angleScope < Math.PI ? 0 : 1;
      const p = this.createSvgEl('path', {
        d: `M ${params.centerX} ${params.centerY}
        L ${params.x} ${params.y} A ${params.radius} ${params.radius} 0 ${largeArcFlag} 1 ${params.x1} ${params.y1}`,
        style: `fill:${item.color};cursor:pointer;`,
        'data-index': i
      });
      this.svg.appendChild(p);
      if (item.indicateTxt && item.showIndicate ) {
        const polyline = this.createSvgEl('polyline', {
          points: `${item.indicatorPointX1},${item.indicatorPointY1} ${item.indicatorPointX2},${item.indicatorPointY2}`,
          style: `stroke:${item.color};`
        });
        this.svg.appendChild(polyline);
      }
      this.pathList.push(p);
    }
    const circle = this.createSvgEl('circle', {
      cx: this.centerX.toString(),
      cy: this.centerY.toString(),
      r: this.minRadius.toString(),
      style: 'fill: #fff'
    });
    this.svg.appendChild(circle);
    this.containerDom.appendChild(this.svg);
    this.parentDom.appendChild(this.containerDom);
  }
  addMoveHandler() {
    if (this.renderMode === 'canvas') {
      this.containerDom.addEventListener(
        'mousemove',
        this.mouseMoveHandler.bind(this),
        false
      );
    } else if (this.renderMode === 'svg') {
      this.containerDom.addEventListener(
        'mousemove',
        this.mouseMoveHandler.bind(this),
        false
      );
    }
    this.hoverScale = this.prodOption.hoverScale
      ? this.prodOption.hoverScale < 1
        ? 1
        : this.prodOption.hoverScale
      : 1;
    if (
      this.prodOption.triggerType &&
      this.prodOption.triggerType === 'click'
    ) {
      if (this.renderMode === 'canvas') {
        this.containerDom.addEventListener(
          'click',
          this.clickOrMouseoverHandler.bind(this),
          false
        );
      } else if (this.renderMode === 'svg') {
        this.containerDom.addEventListener(
          'click',
          this.clickOrMouseoverHandler.bind(this),
          false
        );
      }
    }
  }
  addResizeHandler() {
    window.addEventListener('resize', this.resizeHandler.bind(this), false);
  }
  resizeHandler() {
    const width = this.parentDom.offsetWidth;
    const height = this.parentDom.offsetHeight;
    if (this.width !== width || this.height !== height) {
      this.update();
    }
  }
  mouseMoveHandler(e: MouseEvent): void {
    if (this.renderMode === 'canvas') {
      const x = e.clientX - this.can.getBoundingClientRect().left;
      const y = e.clientY - this.can.getBoundingClientRect().top;
      const result = this.isInPath(x, y);
      if (result) {
        this.inCircle = true;
        this.activeItem = result;
        this.can.style.cursor = 'pointer';
      } else {
        this.can.style.cursor = 'default';
        this.inCircle = false;
      }
    }
    if (
      this.prodOption.triggerType &&
      this.prodOption.triggerType === 'hover'
    ) {
      this.clickOrMouseoverHandler(e);
    }
  }
  clickOrMouseoverHandler(e: MouseEvent): void {
    if (this.renderMode === 'canvas') {
      if (this.inCircle) {
        this.handleMoveIn(this.activeItem.item, this.activeItem.index);
        return;
      }
    } else if (this.renderMode === 'svg') {
      console.log('click');
      const target = e.target as HTMLElement;
      if (target.tagName === 'path') {
        const index = target.getAttribute('data-index');
        const activePath: ProdSerial = this.series[index];
        this.currentSvg = target;
        this.handleMoveIn(activePath, parseInt(index, 10));
        return;
      }
    }
    if (this.currentSelected !== -1) {
      this.handleFadeOut();
      this.currentSelected = -1;
    }
  }
  getDistance(x1: number, x2: number, y1: number, y2: number): number {
    return Math.sqrt(
      Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2)
    );
  }
  getClosePoint(
    x: number,
    y: number,
    obj: { x1: number; x2: number; y1: number; y2: number }
  ): Point {
    const dis1 = Math.sqrt(
      Math.pow(Math.abs(obj.x1 - x), 2) + Math.pow(Math.abs(obj.y1 - y), 2)
    );
    const dis2 = Math.sqrt(
      Math.pow(Math.abs(obj.x2 - x), 2) + Math.pow(Math.abs(obj.y2 - y), 2)
    );
    return dis1 >= dis2 ? { x: obj.x2, y: obj.y2 } : { x: obj.x1, y: obj.y1 };
  }
  isInPath(x: number, y: number): SerialAndIndex {
    const centerX = this.centerX;
    const centerY = this.centerY;
    const distance = this.getDistance(centerX, x, centerY, y);
    if (distance >= this.minRadius && distance <= this.maxRadius) {
      if (this.series.length > 1) {
        const point = this.getClosePoint(
          x,
          y,
          this.lineEquation(this.centerX, this.centerY, x, y)
        );
        let negativeSymbol = 1;
        if (point.y < this.centerY) {
          negativeSymbol = -1;
        }
        const angle =
          negativeSymbol * Math.acos((point.x - this.centerX) / this.minRadius);
        for (let i = 0, len = this.series.length; i < len; i++) {
          const item = this.series[i];
          if (
            ((item.startAngle >= 0 && item.endAngle >= 0) ||
              (item.startAngle <= 0 && item.endAngle <= 0)) &&
            item.angleScope <= Math.PI
          ) {
            if (angle >= item.startAngle && angle <= item.endAngle) {
              return { item, index: i };
            }
          } else if (item.startAngle <= 0 && item.endAngle >= 0) {
            if (angle >= item.startAngle && angle <= item.endAngle) {
              return { item, index: i };
            }
          } else if (item.startAngle >= 0 && item.endAngle <= 0) {
            if (angle <= 0 && angle <= item.endAngle) {
              return { item, index: i };
            } else if (angle >= 0 && angle >= item.startAngle) {
              return { item, index: i };
            }
          } else if (
            ((item.startAngle <= 0 && item.endAngle <= 0) ||
              (item.startAngle >= 0 && item.endAngle >= 0)) &&
            item.angleScope >= (Math.PI * 3) / 2
          ) {
            if (!(item.endAngle <= angle && item.startAngle >= angle)) {
              return { item, index: i };
            }
          }
        }
      } else {
        return { item: this.series[0], index: 0 };
      }
    }
  }
  handleFadeOut(): void {
    const prevSelected = this.series[this.currentSelected];
    const r = prevSelected.radius;
    let maxR = r * this.hoverScale;
    let step = 1;
    function renderOut() {
      if (this.hoverScale > 1) {
        if (maxR > prevSelected.radius) {
          step += this.animationStep;
          maxR -= this.velocityCurve(step, 1);
          this.drawOnce(
            Object.assign({}, prevSelected, { radius: maxR }),
            this.currentSelected,
            true
          );
          this.drawMask();
          if (maxR <= prevSelected.radius) {
            this.drawOnce(prevSelected, this.currentSelected, true);
            this.drawMask();
          }
          requestAnimationFrame(renderOut.bind(this));
        }
      } else {
        if (this.renderMode === 'svg') {
          this.prevSvg = this.pathList[this.currentSelected];
          this.draw(prevSelected, false, false, true);
        } else if (this.renderMode === 'canvas') {
          this.drawOnce(prevSelected, this.currentSelected);
        }
        this.drawMask();
      }
    }
    renderOut.call(this);
  }
  /**
   * mouse click a specific target
   * @param item -SingleSerial
   * @param  index -index
   */
  handleMoveIn(item: ProdSerial, index: number): void {
    if (this.currentSelected === index) {
      return;
    }
    let i = item.radius;
    let step = 1;
    let r = 0;
    let maxR = 0;
    let prevSelected = null;
    if (this.currentSelected !== -1) {
      this.prevSvg = this.pathList[this.currentSelected];
      prevSelected = this.series[this.currentSelected];
      r = prevSelected.radius;
      maxR = r * this.hoverScale;
    }
    function render() {
      if (i < item.radius * this.hoverScale && this.hoverScale > 1) {
        step += this.animationStep;
        i += this.velocityCurve(step, 1);
        maxR -= this.velocityCurve(step, 1);
        this.drawOnce(Object.assign({}, item, { radius: i }), index);
        if (prevSelected) {
          if (maxR <= r) {
            maxR = r;
          }
          this.draw(
            Object.assign({}, prevSelected, { radius: maxR }),
            false,
            true,
            true
          );
        }
        this.drawMask();
        if (i >= item.radius * this.hoverScale) {
          this.drawOnce(
            Object.assign({}, item, { radius: item.radius * this.hoverScale }),
            index,
            true
          );
          if (prevSelected) {
            this.draw(prevSelected, false, true, true);
          }
          this.drawMask();
        }
        requestAnimationFrame(render.bind(this));
      } else if (this.hoverScale === 1) {
        this.drawOnce(item, index, true);
        if (prevSelected) {
          this.draw(prevSelected, false, false, true);
        }
        this.drawMask();
      }
    }
    render.call(this);
    this.currentSelected = index;
  }
  drawOnce(item: ProdSerial, index: number, fadeIn?: boolean): void {
    if (this.renderMode === 'canvas') {
      this.pen.clearRect(0, 0, this.width, this.height);
      for (let a = 0, l = this.series.length; a < l; a++) {
        if (a !== index && a !== this.currentSelected) {
          const item1 = this.series[a];
          this.draw(item1, false);
        }
      }
    }
    this.draw(item, false, fadeIn);
  }
  velocityCurve(x: number, a: number): number {
    // return Math.pow(x, 3);
    return Math.atan(x);
    // return 8 * Math.pow(a, 3) / (Math.pow(x, 2) + 4 * Math.pow(a, 2));
  }
  /**
   * line equation
   *  y1 = kx1 + b
   *  y2 = kx2 + b
   *  => k = (y1 - y2) / (x1 - x2);
   *  => b = y1 - kx1;
   */
  lineEquation(x1: number, y1: number, x2: number, y2: number): DoublePoint {
    // consider vertical scenario
    if (x1 !== x2) {
      const k = (y1 - y2) / (x1 - x2);
      const b = y1 - k * x1;
      return this.intersectionOfLineAndCircle(
        this.centerX,
        this.centerY,
        this.minRadius,
        k,
        b
      );
    } else {
      return {
        x1,
        y1: this.centerY - this.minRadius,
        x2: x1,
        y2: this.centerY - this.minRadius
      };
    }
  }

  /**
   * circle equation
   * (x - o1) ^ 2 + (y - o2) ^ 2 = r ^ 2
   */
  intersectionOfLineAndCircle(
    o1: number,
    o2: number,
    r: number,
    k: number,
    b: number
  ): DoublePoint {
    const result = this.twoPowerEquationResult(
      1 + Math.pow(k, 2),
      2 * (k * b - o1 - k * o2),
      Math.pow(o1, 2) +
        Math.pow(b, 2) +
        Math.pow(o2, 2) -
        Math.pow(r, 2) -
        2 * b * o2
    );
    const x1 = result.x1;
    const x2 = result.x2;
    const y1 = k * x1 + b;
    const y2 = k * x2 + b;
    return { x1, x2, y1, y2 };
  }

  /**
   * x1 = (-b+Math.sqrt(b^2-4ac))/2*a
   * x2 = (-b-Math.sqrt(b^2-4ac))/2*a
   */
  twoPowerEquationResult(a: number, b: number, c: number): XPoint {
    const x1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
    const x2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
    return { x1, x2 };
  }
}
