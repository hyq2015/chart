import {
  ChartOption,
  ProdChartOption,
  ProdSerial,
} from './chart.interface';
const defaultSerialConfig = {
  showIndicate: true,
  thickness: 40,
  indicatorPercent: 0.5,
  indicatorOffset: 0,
  indicatorLength: 24,
  indicatorOffsetAngle: 0
};
export class RoseChart {
  private width: number;
  private height: number;
  private centerX: number;
  private centerY: number;
  private radiusGap: number;
  private minRadius: number;
  private hoverScale: number;
  private animationStep = 0.6;
  private currentSelected = -1;
  private series: ProdSerial[];
  private svg: any;
  private pathList: HTMLElement[] = [];
  private parentDom: HTMLElement;
  private initAngle = -Math.PI / 2;
  private containerDom: HTMLElement;
  private pen: CanvasRenderingContext2D;
  private maxRadius: number | undefined;
  private currentSvg: HTMLElement;
  private prevSvg: HTMLElement;
  private defaultOffset = false;
  public prodOption: ProdChartOption;
  public option: ChartOption;
  private linkNs = 'http://www.w3.org/1999/xlink';
  private svgOrg = 'http://www.w3.org/2000/svg';
  private tooltips: HTMLElement[] = [];
  private debounceTimeout: any;
  private lastTime: number;
  private isInit = true;
  private svgLine = [];
  private polylineWidth = 10;
  private defaultOffsetY = -10;
  private animations = [];
  private animationOut = [];
  private quadrants = {
    1: [],
    2: [],
    3: [],
    4: []
  };
  constructor(opt: ChartOption) {
    this.option = opt;
    this.init();
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
    this.tooltips = [];
    this.svgLine = [];
    this.pathList = [];
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
    if (!this.parentDom) {
      this.parentDom = document.getElementById(this.prodOption.id);
    }
    const width = this.parentDom.offsetWidth;
    const height = this.parentDom.offsetHeight;
    this.width = width;
    this.height = height;
    if (!this.containerDom) {
      this.containerDom = document.createElement('div');
    }
    this.containerDom.style.cssText += `position:relative;display:inline-block;width: ${width}px;height:${height}px;`;
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
    this.isInit = false;
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
      if (series[i].indicatorPointX1 >= this.centerX) {
        series[i].rightSide = true;
      } else {
        series[i].leftSide = true;
      }
    }
    this.series = series;
  }
  draw(
    drawEntity: ProdSerial,
    isMask?: boolean,
    fadeIn?: boolean,
    isSvg?: boolean
  ) {
    if (this.hoverScale > 1) {
      const params = this.calculateParams(drawEntity);
      const largeArcFlag = drawEntity.angleScope < Math.PI ? 0 : 1;
      if (isSvg) {
        this.prevSvg.setAttribute(
          'd',
          `M ${params.centerX} ${params.centerY}
  L ${params.x} ${params.y} A ${params.radius} ${params.radius} 0 ${largeArcFlag} 1 ${params.x1} ${params.y1}`
        );
      } else {
        this.currentSvg.setAttribute(
          'd',
          `M ${params.centerX} ${params.centerY}
  L ${params.x} ${params.y} A ${params.radius} ${params.radius} 0 ${largeArcFlag} 1 ${params.x1} ${params.y1}`
        );
      }
    } else {
      if (isSvg) {
        this.prevSvg.style.fill = drawEntity.color;
      } else if (this.hoverScale === 1) {
        this.currentSvg.style.fill = drawEntity.highLightColor;
      }
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
    const leftPart = [];
    const rightPart = [];
    const firstQuadrant = [];
    const secondQuadrant = [];
    const thirdQuadrant = [];
    const fourthQuadrant = [];
    for (let i = 0, len = this.series.length; i < len; i++) {
      const item = this.series[i];
      if (item.indicateTxt && item.showIndicate) {
        const points = `${item.indicatorPointX1},${item.indicatorPointY1} ${item.indicatorPointX2},${item.indicatorPointY2}`;
        item.points = points;
        const polyline = this.createSvgEl('polyline', {
          points: points,
          style: `stroke:${item.color};fill:none;`
        });
        this.svgLine.push(polyline);
        this.svg.appendChild(polyline);
        let topVal = item.indicatorPointY2;
        let leftVal: number | string = 'auto';
        let rightVal: number | string = 'auto';
        if (item.rightSide) {
          if (this.defaultOffset) {
            leftVal = item.indicatorPointX2 + 10;
          } else {
            leftVal = item.indicatorPointX2;
          }
        } else {
          if (this.defaultOffset) {
            rightVal = this.width - item.indicatorPointX2 + 10;
          } else {
            rightVal = this.width - item.indicatorPointX2;
          }
        }
        if (item.indicatorPointY2 < this.centerY) {
          if (this.defaultOffset) {
            topVal = item.indicatorPointY2 - 10;
          } else {
            topVal = item.indicatorPointY2;
          }
        } else {
          if (this.defaultOffset) {
            topVal = item.indicatorPointY2 - 8;
          } else {
            topVal = item.indicatorPointY2;
          }
        }
        rightVal = rightVal === 'auto' ? 'auto' : rightVal as number + this.polylineWidth;
        leftVal = leftVal === 'auto' ? 'auto' : leftVal as number + this.polylineWidth;
        topVal += this.defaultOffsetY;
        if (this.tooltips.length !== this.prodOption.series.length) {
          const tooltipDiv = document.createElement('div');
          tooltipDiv.className = `rose-chart-tooltip ${this.option.tooltipClass || ''}`;
          tooltipDiv.style.cssText += `position:absolute;top:${topVal}px;left:${
            leftVal === 'auto' ? 'auto' : leftVal + 'px'
          };
        right:${rightVal === 'auto' ? 'auto' : rightVal + 'px'};`;
          tooltipDiv.innerHTML = item.indicateTxt;
          this.tooltips.push(tooltipDiv);
          this.containerDom.appendChild(tooltipDiv);
          const h = tooltipDiv.offsetHeight;
          const w = tooltipDiv.offsetHeight;
          item.left = leftVal;
          item.right = rightVal;
          item.top = topVal;
          item.bottom = topVal + h;
          item.height = h;
          item.width = w;
        }
      }
      if (item.leftSide) {
        leftPart.push({item, index: i});
      } else {
        rightPart.push({item, index: i});
      }
      if (item.rightSide && item.indicatorPointY2 <= this.centerY) {
        firstQuadrant.push({item, index: i});
      } else if (item.rightSide && item.indicatorPointY2 > this.centerY) {
        secondQuadrant.push({item, index: i});
      } else if (item.leftSide && item.indicatorPointY2 > this.centerY) {
        thirdQuadrant.push({item, index: i});
      } else if (item.leftSide && item.indicatorPointY2 <= this.centerY) {
        fourthQuadrant.push({item, index: i});
      }
    }
    this.quadrants[1] = firstQuadrant;
    this.quadrants[2] = secondQuadrant;
    this.quadrants[3] = thirdQuadrant;
    this.quadrants[4] = fourthQuadrant;
    this.handleFirstAndThirdQuadrant(1);
    this.handleFirstAndThirdQuadrant(3);
    this.handleSecondAndFourthQuadrant(2);
    this.handleSecondAndFourthQuadrant(4);
  }
  handleNewParam(itemCurrent: any, itemNext: any, index: number) {
    let y = 0;
    let points = '';
    const x = Math.abs(y / Math.tan(itemNext.indicatorAngle));
    if (index === 2) {
      y = itemCurrent.bottom - itemNext.top;
      points = `${itemNext.indicatorPointX1},${itemNext.indicatorPointY1} ${itemNext.indicatorPointX2 - x},
            ${itemNext.indicatorPointY2 + y + 10}`;
    } else if (index === 4) {
      y = itemNext.bottom - itemCurrent.top;
      points = `${itemNext.indicatorPointX1},${itemNext.indicatorPointY1} ${itemNext.indicatorPointX2 - x},
            ${itemNext.indicatorPointY2 - y + 10}`;
    } else if (index === 1) {
      y = itemNext.bottom - itemCurrent.top;
      points = `${itemNext.indicatorPointX1},${itemNext.indicatorPointY1} ${itemNext.indicatorPointX2 - x - this.polylineWidth},
             ${itemNext.indicatorPointY2 - y + 10}`;
    } else if (index === 3) {
      y = itemCurrent.bottom - itemNext.top;
      points = `${itemNext.indicatorPointX1},${itemNext.indicatorPointY1} ${itemNext.indicatorPointX2 - x},
            ${itemNext.indicatorPointY2 + y + 10}`;
    }
    if (index === 2) {
      points += ` ${itemNext.indicatorPointX2 - x + this.polylineWidth},${itemNext.indicatorPointY2 + y + 10}`;
    } else if (index === 4) {
      points += ` ${itemNext.indicatorPointX2 - x - this.polylineWidth},${itemNext.indicatorPointY2 - y + 10}`;
    } else if (index === 1) {
      points += ` ${itemNext.indicatorPointX2 - x},${itemNext.indicatorPointY2 - y + 10}`;
    } else if (index === 3) {
      points += ` ${itemNext.indicatorPointX2 - x - this.polylineWidth},${itemNext.indicatorPointY2 + y + 10}`;
    }
    if (index === 2) {
      itemNext.top += y;
      itemNext.left -= x;
      itemNext.bottom += y;
      itemNext.indicatorPointY2 += y;
      itemNext.indicatorPointX2 -= x;
    } else if (index === 4) {
      itemNext.top -= y;
      itemNext.right += x;
      itemNext.bottom -= y;
      itemNext.indicatorPointY2 -= y;
      itemNext.indicatorPointX2 -= x;
    } else if (index === 1) {
      itemNext.left -= x;
      itemNext.top -= y;
      itemNext.bottom -= y;
      itemNext.indicatorPointY2 -= y;
      itemNext.indicatorPointX2 -= x;
    } else if (index === 3) {
      itemNext.top += y;
      itemNext.right -= x;
      itemNext.bottom += y;
      itemNext.indicatorPointY2 += y;
      itemNext.indicatorPointX2 += x;
    }
    itemNext.points = points;
  }
  setStyle(indexCurrent: number, itemCurrent: any) {
    if (!this.option.polyline) {
      const points = this.calculatePoints(itemCurrent.points);
      this.svgLine[indexCurrent].setAttribute('points', points[0] + ' ' + points[points.length - 1]);
    } else {
      this.svgLine[indexCurrent].setAttribute('points', itemCurrent.points);
    }
    this.tooltips[indexCurrent].style.cssText += `left:${itemCurrent.left + (itemCurrent.indicateOffsetX || 0)}px;
    top:${itemCurrent.top + (itemCurrent.indicateOffsetY || 0)}px;`;
  }
  calculatePoints(points: any) {
    points = points.replace(/[,]\s+/g, ',');
    points = points.replace(/\s{2,}/g, ' ');
    points = points.split(' ');
    return points;
  }
  handleFirstAndThirdQuadrant(index: number) {
    for (let len = this.quadrants[index].length, i = len - 1; i >= 0; i--) {
      const itemCurrent = this.quadrants[index][i].item;
      if (!itemCurrent.showIndicate || !itemCurrent.indicateTxt) {
        continue;
      }
      const indexCurrent = this.quadrants[index][i].index;
      if (index === 1) {
        itemCurrent.points = `${itemCurrent.indicatorPointX1},${itemCurrent.indicatorPointY1}
        ${itemCurrent.indicatorPointX2},${itemCurrent.indicatorPointY2} ${itemCurrent.indicatorPointX2 + this.polylineWidth},
        ${itemCurrent.indicatorPointY2}`;
      } else if (index === 3) {
        itemCurrent.points = `${itemCurrent.indicatorPointX1},${itemCurrent.indicatorPointY1}
       ${itemCurrent.indicatorPointX2},${itemCurrent.indicatorPointY2} ${itemCurrent.indicatorPointX2 - this.polylineWidth},
       ${itemCurrent.indicatorPointY2}`;
      }
      if (i > 0) {
        const itemNext = this.quadrants[index][i - 1].item;
        if (itemNext.bottom > itemCurrent.top && index === 1) {
          this.handleNewParam(itemCurrent, itemNext, index);
        } else if (itemCurrent.bottom > itemNext.top && index === 3) {
          this.handleNewParam(itemCurrent, itemNext, index);
        }
      }
      this.setStyle(indexCurrent, itemCurrent);
    }
  }
  handleSecondAndFourthQuadrant(index: number) {
    for (let i = 0, len = this.quadrants[index].length; i < len; i++) {
      const itemCurrent = this.quadrants[index][i].item;
      if (!itemCurrent.showIndicate || !itemCurrent.indicateTxt) {
        continue;
      }
      const indexCurrent = this.quadrants[index][i].index;
      if (index === 2) {
        itemCurrent.points = `${itemCurrent.indicatorPointX1},${itemCurrent.indicatorPointY1}
       ${itemCurrent.indicatorPointX2},${itemCurrent.indicatorPointY2} ${itemCurrent.indicatorPointX2 + this.polylineWidth},
       ${itemCurrent.indicatorPointY2}`;
      } else if (index === 4) {
        itemCurrent.points = `${itemCurrent.indicatorPointX1},${itemCurrent.indicatorPointY1}
       ${itemCurrent.indicatorPointX2},${itemCurrent.indicatorPointY2} ${itemCurrent.indicatorPointX2 - this.polylineWidth},
       ${itemCurrent.indicatorPointY2}`;
      }

      if (i < len - 1) {
        const itemNext = this.quadrants[index][i + 1].item;
        if (itemNext.top < itemCurrent.bottom && index === 2) {
          this.handleNewParam(itemCurrent, itemNext, index);
        } else if (itemNext.bottom > itemCurrent.top && index === 4) {
          this.handleNewParam(itemCurrent, itemNext, index);
        }
      }
      this.setStyle(indexCurrent, itemCurrent);
    }
  }
  initDraw() {
    this.drawSvg();
  }
  createSvgEl(tag: string, attrs: any): any {
    const ATTR_MAP = {
      className: 'class',
      svgHref: 'href'
    };

    const NS_MAP = {
      svgHref: this.linkNs
    };
    const d = document.createElementNS(this.svgOrg, tag);
    Object.keys(attrs).forEach(attr => {
      const attName = attr in ATTR_MAP ? ATTR_MAP[attr] : attr;
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
    return { centerX, centerY, radius, x, y, x1, y1 };
  }
  drawSvg() {
    this.svg = this.createSvgEl('svg', {
      width: this.width,
      height: this.height,
      viewBox: `0 0 ${this.width} ${this.height}`,
      xmlns: this.svgOrg,
      'xmlns:xlink': this.linkNs
    });
    if (this.series.length > 1) {
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
        this.pathList.push(p);
      }
    } else {
      const circleOuter = this.createSvgEl('circle', {
        cx: this.centerX.toString(),
        cy: this.centerY.toString(),
        r: this.series[0].radius.toString(),
        style: `fill: ${this.series[0].color};cursor:pointer;`
      });
      this.svg.appendChild(circleOuter);
      this.pathList.push(circleOuter);
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
    if (this.isInit) {
      this.containerDom.addEventListener(
        'mousemove',
        this.mouseMoveHandler.bind(this),
        false
      );
      this.hoverScale = this.prodOption.hoverScale
        ? this.prodOption.hoverScale < 1
          ? 1
          : this.prodOption.hoverScale
        : 1;
      if (
        this.prodOption.triggerType &&
        this.prodOption.triggerType === 'click'
      ) {
        this.containerDom.addEventListener(
          'click',
          this.clickOrMouseoverHandler.bind(this),
          false
        );
      }
    }
  }
  addResizeHandler() {
    if (this.isInit) {
      window.addEventListener('resize', this.resizeHandler.bind(this), false);
    }
  }
  resizeHandler() {
    const width = this.parentDom.offsetWidth;
    const height = this.parentDom.offsetHeight;
    if (
      (this.width !== width || this.height !== height) &&
      width !== 0 &&
      height !== 0
    ) {
      this.update();
      // this.debounce(2000, this.update.bind(this));
    }
  }
  debounce(delay: number, fn: any) {
    if (!this.debounceTimeout) {
      this.debounceTimeout = setTimeout(fn, delay);
      this.lastTime = +new Date();
    } else {
      if (+new Date() - this.lastTime < delay) {
        this.lastTime = +new Date();
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(fn, delay);
      }
    }
  }
  mouseMoveHandler(e: MouseEvent): void {
    if (
      this.prodOption.triggerType &&
      this.prodOption.triggerType === 'hover'
    ) {
      this.clickOrMouseoverHandler(e);
    }
  }
  clickOrMouseoverHandler(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (target.tagName === 'path') {
      const index = target.getAttribute('data-index');
      const activePath: ProdSerial = this.series[index];
      this.currentSvg = target;
      this.handleMoveIn(activePath, parseInt(index, 10));
      return;
    }
    if (this.currentSelected !== -1) {
      this.handleFadeOut();
      this.currentSelected = -1;
    }
  }
  handleFadeOut(): void {
    const prevSelected = this.series[this.currentSelected];
    const r = prevSelected.radius;
    let maxR = r * this.hoverScale;
    let step = 1;
    let requestId;
    if (this.animationOut.length > 0) {
      for (const item of this.animationOut) {
        window.cancelAnimationFrame(item);
      }
      this.animationOut = [];
    }
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
          if (maxR <= prevSelected.radius) {
            this.drawOnce(prevSelected, this.currentSelected, true);
          }
          requestId = requestAnimationFrame(renderOut.bind(this));
          this.animationOut.push(requestId);
        }
      } else {
        this.prevSvg = this.pathList[this.currentSelected];
        this.draw(prevSelected, false, false, true);
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
    if (this.animations.length > 0) {
      for (const item of this.animations) {
        window.cancelAnimationFrame(item);
      }
      this.animations = [];
    }
    let requestId;
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
        if (i >= item.radius * this.hoverScale) {
          this.drawOnce(
            Object.assign({}, item, { radius: item.radius * this.hoverScale }),
            index,
            true
          );
          if (prevSelected) {
            this.draw(prevSelected, false, true, true);
          }
        }
        requestId = requestAnimationFrame(render.bind(this));
        this.animations.push(requestId);
        // window.cancelAnimationFrame(requestId);
      } else if (this.hoverScale === 1) {
        this.drawOnce(item, index, true);
        if (prevSelected) {
          this.draw(prevSelected, false, false, true);
        }
        this.drawHtml();
      }
    }
    render.call(this);
    this.currentSelected = index;
  }
  drawOnce(item: ProdSerial, index: number, fadeIn?: boolean): void {
    this.draw(item, false, fadeIn);
  }
  velocityCurve(x: number, a: number): number {
    // return Math.pow(x, 3);
    return Math.atan(x);
    // return 8 * Math.pow(a, 3) / (Math.pow(x, 2) + 4 * Math.pow(a, 2));
  }
}
