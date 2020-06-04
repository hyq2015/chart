import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RoseChart} from '../../projects/my-lib/src/lib/chart/chart';
import {ChartOption} from '../../projects/my-lib/src/lib/chart/chart.interface';
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
    defaultOffset: false,
    polyline: true,
    triggerType: 'hover',
    // hoverScale: 1.1,
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
  svg: any;
  private linkNs = 'http://www.w3.org/1999/xlink';
  private svgOrg = 'http://www.w3.org/2000/svg';
  constructor() {}
  ngOnInit(): void {
    this.rose = new RoseChart(this.option4);
    // this.rose4 = new RoseChart(this.option4);
    // this.rose.init();
    console.log(this.option4);
    // this.rose4.init();
  }
  changeSty() {
    this.option4.series.splice(2, this.option4.series.length - 5);
    this.rose.update(this.option4);
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
  ngAfterViewInit(): void {
    this.svg = document.querySelector('#svgContainer');
    for (let i = 0; i < 10; i++) {
      const polyline = this.createSvgEl('polyline', {
        points: `${(i + 1) * 100},360 ${(i + 1) * 100},350`,
        stroke: '#000'
      });
      const text = this.createSvgEl('text', {
        x: (i + 1) * 100 - 15,
        y: 380
      });
      text.innerHTML = (i + 1) * 100;
      this.svg.appendChild(polyline);
      this.svg.appendChild(text);
    }
    for (let i = 0; i < 4; i++) {
      const polyline = this.createSvgEl('polyline', {
        points: `60 ${(4 - i) * 90},50 ${(4 - i) * 90}`,
        stroke: '#000'
      });
      const text = this.createSvgEl('text', {
        x: (i + 1) * 100 - 15,
        y: 380
      });
      text.innerHTML = (i + 1) * 100;
      this.svg.appendChild(polyline);
      this.svg.appendChild(text);
    }
  }
}
