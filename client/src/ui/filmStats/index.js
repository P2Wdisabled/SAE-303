// src/ui/filmStats/index.js
const templateFile = await fetch("ui/filmStats/template.html.inc");
const template = await templateFile.text();

import * as echarts from 'echarts'; // Assurez-vous d'avoir echarts installé ou inclus dans votre projet
import { LocationsData } from "../../data/locations.js";
import { VentesData } from "../../data/ventes.js";

let FilmStatsView = {};

FilmStatsView.render = async function(containerSelector, fetchRentalFilmStats, fetchSoldFilmStats, RentalFilmList, SoldFilmList){
    const container = document.querySelector(containerSelector);
    container.innerHTML = template;
    this.renderFilmStats(fetchRentalFilmStats, fetchSoldFilmStats, RentalFilmList, SoldFilmList);
}

FilmStatsView.renderFilmStats = async function(fetchRentalFilmStats, fetchSoldFilmStats, RentalFilmList, SoldFilmList){
    // Rendre les statistiques initiales
    this.renderFilmStatsAxisWithTicks("fetchRentalFilmStats", fetchRentalFilmStats);
    this.renderFilmStatsAxisWithTicks("fetchSoldFilmStats", fetchSoldFilmStats);
    
    // Remplir les listes de films
    this.populateFilmLists(RentalFilmList, SoldFilmList);
}

FilmStatsView.populateFilmLists = function(RentalFilmList, SoldFilmList){
    // Location Film List
    RentalFilmList.forEach(film => {
        let option = document.createElement("option");
        option.value = film.id;
        option.textContent = film.title;
        document.querySelector("#rentalfilmlist").appendChild(option);
    });
    
    // Vente Film List
    SoldFilmList.forEach(film => {
        let option = document.createElement("option");
        option.value = film.id;
        option.textContent = film.title;
        document.querySelector("#soldfilmlist").appendChild(option);
    });

    // Ajouter les écouteurs d'événements
    document.querySelector("#rentalfilmlist").addEventListener("change", this.updateRentFilmStat.bind(this));
    document.querySelector("#soldfilmlist").addEventListener("change", this.updateSoldFilmStat.bind(this));
}

FilmStatsView.renderFilmStatsAxisWithTicks = function(htmlId, data) {
    var dom = document.querySelector("#"+htmlId);
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var option;

    data = data.evolution;

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
          data: data.map(e => e.mois),
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

FilmStatsView.updateRentFilmStat = async function(event){
    let fetchFilmStats = await LocationsData.fetchFilmStats(event.target.value);
    this.renderFilmStatsAxisWithTicks("fetchRentalFilmStats", fetchFilmStats);
}

FilmStatsView.updateSoldFilmStat = async function(event){
    let fetchFilmStats = await VentesData.fetchFilmStats(event.target.value);
    this.renderFilmStatsAxisWithTicks("fetchSoldFilmStats", fetchFilmStats);
}

export { FilmStatsView };
