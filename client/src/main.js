import { HeaderView } from "./ui/header/index.js";
import { VentesData } from "./data/ventes.js";
import { LocationsData } from "./data/locations.js";

/*
import './index.css';
*/


let C = {};


//Visualiser l’évolution des ventes et des locations sur les 6 derniers mois.

C.init = async function(){
    V.init();
    let location = await LocationsData.fetchLocations();
    let ventes = await VentesData.fetchVentes();
    let toplocations = await LocationsData.fetchMostLocations();
    let topventes = await VentesData.fetchMostVentes();
    let soldEvolutions = await VentesData.fetchSoldEvolutions();
    let rentEvolutions = await LocationsData.fetchRentEvolutions();
    V.renderEvolutions(soldEvolutions, rentEvolutions);
    V.renderToplocations(toplocations, topventes);
    V.renderPrices(ventes, location);
}

let V = {
    header: document.querySelector("#header")
};

V.init = function(){
    V.renderHeader();
}


V.renderPrices = function(ventes, location){
    document.querySelector("#ventesContainer").textContent = ventes+" €";
    document.querySelector("#locationContainer").textContent = location+" €";
}

V.renderToplocations = function(toplocations, topventes){
    let toplocationsContainer = document.querySelector("#toplocationsContainer");
    toplocationsContainer.innerHTML = "";
    toplocations.forEach(location => {
        let div = document.createElement("div");
        div.textContent = location.movie_title + " : " + location.nb;
        toplocationsContainer.appendChild(div);
    });
    let topventesContainer = document.querySelector("#topventesContainer");
    topventesContainer.innerHTML = "";
    topventes.forEach(vente => {
        let div = document.createElement("div");
        div.textContent = vente.movie_title + " : " + vente.nb;
        topventesContainer.appendChild(div);
    });
}


V.renderGraphLineChart = function(htmlId, data, type){
    if(type == "location"){
        var dom = document.getElementById(htmlId);
        var myChart = echarts.init(dom, null, {
          renderer: 'canvas',
          useDirtyRect: false
        });
        var app = {};

        var option;

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

        if (option && typeof option === 'object') {
          myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }else if(type == "ventes"){
        var dom = document.getElementById(htmlId);
        var myChart = echarts.init(dom, null, {
          renderer: 'canvas',
          useDirtyRect: false
        });
        var app = {};

        var option;

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
                  data: data.map(e => e.vente),
                  type: 'line',
                  smooth: true
                }
            ]
        };

        if (option && typeof option === 'object') {
          myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }
}
V.renderEvolutions = function(soldEvolutions, rentEvolutions){
// adapter le code au dessus pour afficher les données de soldEvolutions et rentEvolutions dans un graphique chacun pour Visualiser l’évolution des ventes et des locations sur les 6 derniers mois.
    V.renderGraphLineChart("soldEvolutions", soldEvolutions, "ventes");
    V.renderGraphLineChart("rentEvolutions", rentEvolutions, "location");
}

V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}


C.init();