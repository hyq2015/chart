export interface SingleSerial {
  color: string;
  value: number;
  thickness?: number;
  indicateTxt?: string;
  highLightColor?: string;
  showIndicate?: boolean;
  indicateOffsetX?: number;
  indicateOffsetY?: number;
  indicatorLength?: number;
  indicatorOffset?: number;
  indicatorPercent?: number;
  indicatorOffsetAngle?: number;
}

export interface ProdSerial extends SingleSerial {
  radius?: number;
  endAngle?: number;
  startAngle?: number;
  angleScope?: number;
  indicatorAngle?: number;
  indicatorPointX1?: number;
  indicatorPointX2?: number;
  indicatorPointY1?: number;
  indicatorPointY2?: number;
  leftSide?: boolean;
  rightSide?: boolean;
  top?: number;
  bottom?: number;
  height?: number;
  left?: number | string;
  right?: number | string;
}
export interface XPoint {
  x1: number;
  x2: number;
}
export interface DoublePoint extends XPoint {
  y1: number;
  y2: number;
}
export interface SerialAndIndex {
  item: ProdSerial;
  index: number;
}
export interface Point {
  x: number;
  y: number;
}
export interface ChartOption {
  id: string;
  radius: number[];
  circleTxt?: string;
  initAngle?: number;
  hoverScale?: number;
  series: SingleSerial[];
  triggerType?: 'click' | 'hover';
  defaultOffset?: boolean;
  offsetX?: number;
  offsetY?: number;
  renderMode?: 'svg' | 'canvas';
  tooltipCLass?: string;
  autoHide?: boolean;
}

export interface ProdChartOption extends ChartOption {
  series: ProdSerial[];
}
