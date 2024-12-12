// src/ui/evolutionsPerGenre/index.js
const templateFile = await fetch("ui/evolutionsPerGenre/template.html.inc");
const template = await templateFile.text();

import * as echarts from 'echarts'; // Assurez-vous d'avoir echarts installé ou inclus dans votre projet

let EvolutionsPerGenreView = {};

EvolutionsPerGenreView.render = async function(containerSelector, rentEvolutionsPerGenre, soldEvolutionsPerGenre){
    const container = document.querySelector(containerSelector);
    container.innerHTML = template;
    this.renderEvolutionsPerGenre(rentEvolutionsPerGenre, soldEvolutionsPerGenre);
}

EvolutionsPerGenreView.renderGraphLineChart = function(htmlId, data, type){
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
                    data: data.map(e => e.value),
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
                    data: data.map(e => e.value),
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

EvolutionsPerGenreView.renderEvolutionsPerGenre = function(rentEvolutionsPerGenre, soldEvolutionsPerGenre){
    // Locations par Genre
    let htmlRent = document.querySelector('#iteration6Rent');
    rentEvolutionsPerGenre.forEach(genre => {
        let container = document.createElement("div");
        container.style.height = "50vh";
        container.id = `${genre.genre}evolutionrent`;
        let type = document.createElement("h3");
        type.textContent = genre.genre;
        htmlRent.appendChild(type);
        htmlRent.appendChild(container);
        htmlRent.appendChild(document.createElement("br"));
        this.renderGraphLineChart(`${genre.genre}evolutionrent`, genre.evolution, "location");
    });

    // Ventes par Genre
    let htmlSold = document.querySelector('#iteration6Sold');
    soldEvolutionsPerGenre.forEach(genre => {
        let container = document.createElement("div");
        container.style.height = "50vh";
        container.id = `${genre.genre}evolutionsold`;
        let type = document.createElement("h3");
        type.textContent = genre.genre;
        htmlSold.appendChild(type);
        htmlSold.appendChild(container);
        htmlSold.appendChild(document.createElement("br"));
        this.renderGraphLineChart(`${genre.genre}evolutionsold`, genre.evolution, "ventes");
    });
}

export { EvolutionsPerGenreView };
