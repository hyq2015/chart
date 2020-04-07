import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RoseChart} from '../../projects/my-lib/src/lib/chart/chart';
import {ChartOption, ProdSerial} from '../../projects/my-lib/src/lib/chart/chart.interface';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit , AfterViewInit{
  title = 'front-end-experiment';
  option: ChartOption = {
    id: 'can-outer',
    renderMode: 'canvas',
    radius: [35],
    boost: false,
    series: [
      {
        color: '#00a758',
        highLightColor: '#00a758',
        value: 60,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020 <br/>Retirement Fund ' +
          '</span><span class="chart-label-percent" style="color:#00a758;"><br/>60%</span></div>',
        thickness: 45,
      }
    ]
  };
  option4: ChartOption = {
    id: 'can-outer4',
    radius: [35],
    tooltipClass: 'tool-tip',
    boost: true,
    defaultOffset: false,
    polyline: true,
    renderMode: 'svg',
    triggerType: 'hover',
    hoverScale: 1.1,
    series: [
      {
        color: '#00a758',
        highLightColor: '#000',
        value: 4,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text" style="color: blue">I have custom offsetX & offsetY' +
          '</span><span class="chart-label-percent" style="color:#00a758;">18%</span></div>',
        thickness: 45,
        indicateOffsetX: 10,
        indicateOffsetY: -10
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 3,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">20%</span></div>',
        thickness: 42,
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 3,
        thickness: 40,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">12%</span></div>',
      },
      {
        color: '#00a758',
        highLightColor: '#00a758',
        value: 4,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020 ' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">18%</span></div>',
        thickness: 45
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 3,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">20%</span></div>',
        thickness: 42
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 4,
        thickness: 40,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">12%</span></div>',
      },
      {
        color: '#8e90a2',
        highLightColor: '#8e90a2',
        value: 4,
        thickness: 38,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text" style="color: blue">I have custom offsetX & offsetY' +
          '</span><span class="chart-label-percent" style="color:#00a758;">10%</span></div>',
        indicateOffsetX: 10,
        indicateOffsetY: 10,
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 4,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">16%</span></div>',
        thickness: 42
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 3,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">20%</span></div>',
        thickness: 42
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 4,
        thickness: 40,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">12%</span></div>',
      },
      {
        color: '#8e90a2',
        highLightColor: '#8e90a2',
        value: 4,
        thickness: 38,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text" style="color: blue">I have custome offsetX' +
          '</span><span class="chart-label-percent" style="color:#00a758;">10%</span></div>',
        // indicateOffsetX: -10,
        indicateOffsetY: 10
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 4,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text" style="color: blue">I have custom offsetX & offsetY' +
          '</span><span class="chart-label-percent" style="color:#00a758;">16%</span></div>',
        thickness: 42,
        indicateOffsetX: -10,
        indicateOffsetY: 10
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 3,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">20%</span></div>',
        thickness: 42
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 4,
        thickness: 40,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">12%</span></div>',
      },
      {
        color: '#8e90a2',
        highLightColor: '#8e90a2',
        value: 4,
        thickness: 38,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">10%</span></div>',
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 4,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">16%</span></div>',
        thickness: 42
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 3,
        thickness: 34,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">14%</span></div>',
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 2,
        thickness: 40,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">12%</span></div>',
      },
      {
        color: '#8e90a2',
        highLightColor: '#8e90a2',
        value: 3,
        thickness: 38,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020' +
          'Retirement Fund </span><span class="chart-label-percent" style="color:#00a758;">10%</span></div>',
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 2,
        thickness: 40,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/>' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00a758;">12%</span></div>',
      },
      {
        color: '#8e90a2',
        highLightColor: '#8e90a2',
        value: 3,
        thickness: 38,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/>' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00a758;">10%</span></div>',
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 2,
        thickness: 40,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text" style="color: blue">I have custom offsetX & offsetY' +
          '</span><br/><span class="chart-label-percent" style="color:#00a758;">12%</span></div>',
        indicateOffsetX: -10,
        indicateOffsetY: -10
      }
    ]
  };
  rose: RoseChart;
  rose4: RoseChart;
  constructor() {}
  ngOnInit(): void {
    this.rose = new RoseChart(this.option);
    this.rose4 = new RoseChart(this.option4);
    this.rose.init();
    this.rose4.init();
  }
  ngAfterViewInit(): void {
  }
}
