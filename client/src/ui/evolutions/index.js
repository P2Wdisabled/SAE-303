// src/ui/evolutions/index.js
const templateFile = await fetch("ui/evolutions/template.html.inc");
const template = await templateFile.text();

import * as echarts from 'echarts'; // Assurez-vous d'avoir echarts installé ou inclus dans votre projet

let EvolutionsView = {};

EvolutionsView.render = async function(containerSelector, soldEvolutions, rentEvolutions){
    const container = document.querySelector(containerSelector);
    container.innerHTML = template;
    this.renderEvolutions(soldEvolutions, rentEvolutions);
}

EvolutionsView.renderEvolutions = function(soldEvolutions, rentEvolutions){
    this.renderGraphLineChart("soldEvolutions", soldEvolutions, "ventes");
    this.renderGraphLineChart("rentEvolutions", rentEvolutions, "location");
}

EvolutionsView.renderGraphLineChart = function(htmlId, data, type){
    var dom = document.getElementById(htmlId);
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var option;

    if(type === "location"){
        option = {
            xAxis: {
                type: 'category',
                data: data.map(e => e.mois)
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: data.map(e => e.location),
                    type: 'line',
                    smooth: true
                }
            ]
        };
    } else if(type === "ventes"){
        option = {
            xAxis: {
                type: 'category',
                data: data.map(e => e.mois)
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: data.map(e => e.achat),
                    type: 'line',
                    smooth: true
                }
            ]
        };
    }

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);
}

export { EvolutionsView };
