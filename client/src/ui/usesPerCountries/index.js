// src/ui/usesPerCountries/index.js
const templateFile = await fetch("ui/usesPerCountries/template.html.inc");
const template = await templateFile.text();

import * as echarts from 'echarts'; // Assurez-vous d'avoir echarts installé ou inclus dans votre projet

let UsesPerCountriesView = {};

UsesPerCountriesView.render = async function(containerSelector, rentUsesPerCountries, SoldUsesPerCountries){
    const container = document.querySelector(containerSelector);
    container.innerHTML = template;
    this.render(rentUsesPerCountries, SoldUsesPerCountries);
}

UsesPerCountriesView.render = function(rentUsesPerCountries, SoldUsesPerCountries){
    this.renderAxisWithTicks("rentUsesPerCountries", rentUsesPerCountries);
    this.renderAxisWithTicks("SoldUsesPerCountries", SoldUsesPerCountries);
}

UsesPerCountriesView.renderAxisWithTicks = function(htmlId, data) {
    var dom = document.querySelector("#"+htmlId);
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: data.map(e => e.country),
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: data.map(e => e.value)
        }
      ]
    };

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);
}

export { UsesPerCountriesView };
