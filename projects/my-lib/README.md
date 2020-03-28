## Usage

### 1. template
```html
<div id="can-outer" style="width: 650px;height: 100%;display: inline-block;">
    
</div>
```
### 2. pass the option to rose-circle
```javascript
import { RoseChart, ChartOption } from 'canvas-rose-chart';

option: ChartOption = {
    id: 'can-outer',
    triggerType: 'click',
    hoverScale: 1.1,
    radius: [60],
    initAngle: 0,
    defaultOffset: false,
    circleTxt: '<div style="text-align: center;font-size: 13px;">' +
      'Total<br/>balance (HKD)<br/><span style="font-size: 16px;font-weight: 600;">570,000.00</span></div>',
    series: [{
      color: '#17a75b',
      highLightColor: '#17a75b',
      value: 43,
      indicateTxt: '<div><span style="font-size: 12px;color: #282b3e;">Manulife MPF A Fund</span>' +
        '<br/><span style="color:#17a75b;font-size: 18px;font-weight: bold;">43.54%</span></div>',
      thickness: 50,
      // indicateOffsetY: -5,
      indicatorPercent: 0.5,
      indicatorOffsetAngle: Math.PI / 6
    }, {
      color: '#020280',
      highLightColor: '#020280',
      value: 36,
      indicateTxt: '<div><span style="font-size: 12px;color: #282b3e;">Manulife MPF C Fund</span>' +
        '<br/><span style="color:#020280;font-size: 18px;font-weight: bold;">36.32%</span></div>',
      thickness: 45,
      // indicateOffsetX: 4,
      // indicateOffsetY: 5,
      indicatorOffsetAngle: -Math.PI / 6
    }, {
      color: '#fd756c',
      highLightColor: '#fd756c',
      value: 21,
      indicateTxt: '<div><span style="font-size: 12px;color: #282b3e;">Manulife MPF Stable Fund</span>' +
        '<br/><span style="color:#fd756c;font-size: 18px;font-weight: bold;">21.14%</span></div>',
      thickness: 40,
      // indicateOffsetY: -10,
      // indicatorOffsetAngle: -Math.PI / 4
    }]
  };
this.rose = new RoseChart(this.option);
this.rose.init();
// update 
// this.rose.update(this.option);

// destroy
// this.rose.destroy();
```
