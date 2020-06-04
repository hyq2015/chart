import {
  AfterViewInit,
  Directive, DoCheck,
  ElementRef,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import {RoseChart} from './chart';
import {ChartOption} from './chart.interface';

@Directive({
  selector: '[mldDonutChart]',
  exportAs: 'mldDonutChart'
})
export class MldDonutChartDirective implements AfterViewInit, OnDestroy, OnChanges, DoCheck {
  el: ElementRef;
  chart: any;
  @Input() option: ChartOption;
  constructor(el: ElementRef) {
    this.el = el;
  }
  ngAfterViewInit(): void {
    this.chart = new RoseChart(this.option);
    this.chart.init();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  ngDoCheck(): void {
    // console.log(this.option);
  }

  ngOnDestroy(): void {
  }
}
@NgModule({
  exports: [MldDonutChartDirective],
  declarations: [MldDonutChartDirective]
})
export class MldDonutChartDirectiveModule {}
