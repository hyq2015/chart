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
    radius: [35],
    series: [
      {
        color: '#00a758',
        highLightColor: '#00a758',
        value: 60,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/> Retirement Fund ' +
          '</span><br/><span class="chart-label-percent" style="color:#00a758;">60%</span></div>',
        thickness: 45
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 20,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2035<br/> Retirement Fund ' +
          '</span><br/><span class="chart-label-percent" style="color:#00009a;">20%</span></div>',
        thickness: 42
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 10,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2030<br/> Retirement Fund ' +
          '</span><br/><span class="chart-label-percent" style="color:#ff7769;">10%</span></div>',
        thickness: 40
      },
      {
        color: '#8e90a2',
        highLightColor: '#8e90a2',
        value: 10,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF Smart Retirement</span>' +
          '<br/><span class="chart-label-percent" style="color:#8e90a2;">10%</span></div>',
        thickness: 38,
        indicateOffsetY: -10,
        indicateOffsetX: 12
      }
    ]
  };
  option1: ChartOption = {
    id: 'can-outer1',
    defaultOffset: true,
    radius: [35],
    initAngle: 0,
    series: [
      {
        color: '#00a758',
        highLightColor: '#00a758',
        value: 60,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF Smart<br/> ' +
          'Retirement</span><br/><span class="chart-label-percent" style="color:#00a758;">40%</span></div>',
        thickness: 45
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 25,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2035<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00009a;">20%</span></div>',
        thickness: 42
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 20,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2030<br/> Retirement Fund </span>' +
          '<br/><span class="chart-label-percent" style="color:#ff7769;">20%</span></div>',
        thickness: 40
      }
    ]
  };
  option2: ChartOption = {
    id: 'can-outer2',
    radius: [35],
    hoverScale: 1.1,
    triggerType: 'click',
    circleTxt: '<div style="font-weight: 300;font-size: 12px;line-height: 1.38">Click<br/>effect</div>',
    series: [
      {
        color: '#00a758',
        highLightColor: '#00a758',
        value: 50,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00a758;">50%</span></div>',
        thickness: 45
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 30,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2035<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00009a;">30%</span></div>',
        thickness: 42
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 10,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2030<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#ff7769;">10%</span></div>',
        thickness: 40
      },
      {
        color: '#8e90a2',
        highLightColor: '#8e90a2',
        value: 10,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF Smart Retirement</span>' +
          '<br/><span class="chart-label-percent" style="color:#8e90a2;">10%</span></div>',
        thickness: 38,
        indicateOffsetY: -10,
        indicateOffsetX: 12
      }
    ]
  };
  option3: ChartOption = {
    id: 'can-outer3',
    radius: [35],
    triggerType: 'hover',
    circleTxt: '<div style="font-weight: 300;font-size: 12px;line-height: 1.38">Hover<br/>effect</div>',
    series: [
      {
        color: '#00a758',
        highLightColor: '#46a735',
        value: 60,
        thickness: 45,
        showIndicate: false
      },
      {
        color: '#00009a',
        highLightColor: '#61339a',
        value: 20,
        thickness: 42,
        showIndicate: false
      },
      {
        color: '#ff7769',
        highLightColor: '#ffd1be',
        value: 10,
        thickness: 40,
        showIndicate: false
      },
      {
        color: '#8e90a2',
        highLightColor: '#a1a297',
        value: 10,
        thickness: 38,
        showIndicate: false
      }
    ]
  };
  option4: ChartOption = {
    id: 'can-outer4',
    radius: [35],
    tooltipCLass: 'tool-tip',
    autoHide: false,
    series: [
      {
        color: '#00a758',
        highLightColor: '#00a758',
        value: 18,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00a758;">18%</span></div>',
        thickness: 45
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 20,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00a758;">20%</span></div>',
        thickness: 42
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 12,
        thickness: 40,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00a758;">12%</span></div>',
      },
      {
        color: '#8e90a2',
        highLightColor: '#8e90a2',
        value: 10,
        thickness: 38,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00a758;">10%</span></div>',
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 16,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00a758;">16%</span></div>',
        thickness: 42
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 10,
        thickness: 34,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00a758;">14%</span></div>',
      }
    ]
  };
  option5: ChartOption = {
    id: 'can-outer5',
    radius: [35],
    hoverScale: 1.1,
    series: [
      {
        color: '#00a758',
        highLightColor: '#00a758',
        value: 60,
        thickness: 45,
        showIndicate: false
      },
      {
        color: '#00009a',
        highLightColor: '#00009a',
        value: 20,
        thickness: 42,
        indicateTxt:
          '<div class="left-align"><span class="chart-label-text">Manulife MPF 2020<br/> ' +
          'Retirement Fund </span><br/><span class="chart-label-percent" style="color:#00a758;">60%</span></div>'
      },
      {
        color: '#ff7769',
        highLightColor: '#ff7769',
        value: 10,
        thickness: 40,
        showIndicate: false
      },
      {
        color: '#8e90a2',
        highLightColor: '#8e90a2',
        value: 10,
        thickness: 38,
        showIndicate: false
      }
    ]
  };
  rose: RoseChart;
  rose1: RoseChart;
  rose2: RoseChart;
  rose3: RoseChart;
  rose4: RoseChart;
  rose5: RoseChart;
  constructor() {}
  ngOnInit(): void {
    this.rose = new RoseChart(this.option);
    this.rose1 = new RoseChart(this.option1);
    this.rose2 = new RoseChart(this.option2);
    this.rose3 = new RoseChart(this.option3);
    this.rose4 = new RoseChart(this.option4);
    this.rose5 = new RoseChart(this.option5);
    this.rose.init();
    this.rose1.init();
    this.rose2.init();
    this.rose3.init();
    this.rose4.init();
    this.rose5.init();
  }
  ngAfterViewInit(): void {
  }
  update() {
    this.option1.series[0].indicateTxt = '<div class="left-align"><span class="chart-label-text">Manulife MPF Smart<br/> ' +
      'Retirement</span><br/><span class="chart-label-percent" style="color:#00a758;">40%</span></div>';
    this.option1.series[0].value = 40;
    this.option1.series[3] = {
      color: '#8e90a2',
      highLightColor: '#8e90a2',
      value: 20,
      indicateTxt:
        '<div class="left-align"><span class="chart-label-text">Manulife MPF 2045<br/> ' +
        'Retirement Fund</span><br/><span class="chart-label-percent" style="color:#00a758;">20%</span></div>',
      thickness: 40
    };
    this.rose1.update(this.option1);
  }
  destroy() {
    this.rose1.destroy();
  }
}
