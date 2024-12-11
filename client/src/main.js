import { HeaderView } from "./ui/header/index.js";
import { VentesData } from "./data/ventes.js";
import { LocationsData } from "./data/locations.js";

/*
import './index.css';
*/


let C = {};

C.init = async function(){
    V.init();
    let location = await LocationsData.fetchLocations();
    let ventes = await VentesData.fetchVentes();
    let toplocations = await LocationsData.fetchMostLocations();
    let topventes = await VentesData.fetchMostVentes();
    let soldEvolutions = await VentesData.fetchSoldEvolutions();
    let rentEvolutions = await LocationsData.fetchRentEvolutions();
    let rentEvolutionsPerGenre = await LocationsData.fetchRentEvolutionsPerGenre();
    let soldEvolutionsPerGenres = await VentesData.fetchSoldEvolutionsPerGenre();
    let rentUsesPerCountries = await LocationsData.fetchUsesPerCountries();
    let SoldUsesPerCountries = await VentesData.fetchSoldUsesPerCountries();
    let fetchRentalFilmStats = await LocationsData.fetchFilmStats();
    let fetchSoldFilmStats = await VentesData.fetchFilmStats();
    let RentalFilmList = await LocationsData.fetchAllFilms("rentalfilmlist");
    let SoldFilmList = await VentesData.fetchAllFilms("soldfilmlist");
    await V.fetchAllFilms("rentalfilmlist", RentalFilmList);
    await V.fetchAllFilms("soldfilmlist", SoldFilmList);
    await V.renderFilmStatsAxisWithTicks("fetchRentalFilmStats", fetchRentalFilmStats);
    await V.renderFilmStatsAxisWithTicks("fetchSoldFilmStats", fetchSoldFilmStats);
    await V.renderAxisWithTicks("rentUsesPerCountries", rentUsesPerCountries);
    await V.renderAxisWithTicks("SoldUsesPerCountries", SoldUsesPerCountries);
    await V.renderEvolutionsPerGenre(rentEvolutionsPerGenre, soldEvolutionsPerGenres);
    await V.renderEvolutions(soldEvolutions, rentEvolutions);
    await V.renderToplocations(toplocations, topventes);
    await V.renderPrices(ventes, location);
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

V.fetchAllFilms = function(htmlElem, FilmList){
   FilmList.forEach(film => {
        let div = document.createElement("option");
        div.value = film.id;
        div.textContent = film.title;
        document.querySelector("#"+htmlElem).appendChild(div);
        if(htmlElem == "rentalfilmlist"){
          document.querySelector("#"+htmlElem).addEventListener("change", V.updateRentFilmStat);
        }
        if(htmlElem == "soldfilmlist"){
          document.querySelector("#"+htmlElem).addEventListener("change", V.updateSoldFilmStat);
        }
});
}

V.updateRentFilmStat = async function(event){
  let fetchFilmStats = await LocationsData.fetchFilmStats(event.target.value);
  await V.renderFilmStatsAxisWithTicks("fetchRentalFilmStats", fetchFilmStats);
}

V.updateSoldFilmStat = async function(event){
  let fetchFilmStats = await VentesData.fetchFilmStats(event.target.value);
  await V.renderFilmStatsAxisWithTicks("fetchSoldFilmStats", fetchFilmStats);
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

V.renderAxisWithTicks = function(htmlId, data) {
    var dom = document.querySelector("#"+htmlId);
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    
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

V.renderFilmStatsAxisWithTicks = function(htmlId, data) {
  data = data.evolution;
  var dom = document.querySelector("#"+htmlId);
  var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
  });
  var app = {};
  
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
                  data: data.map(e => e.achat),
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


V.renderEvolutionsPerGenre = function(rentEvolutionsPerGenre, soldEvolutionsPerGenre){
    let html = document.querySelector('#iteration6Rent');
    rentEvolutionsPerGenre.forEach(genre => {
        let container = document.createElement("div");
        container.style.height = "50vh";
        container.id = genre["genre"]+"evolutionrent";
        let type = document.createElement("h2");
        type.textContent = genre["genre"];
        html.appendChild(type);
        html.appendChild(container);
        html.appendChild(document.createElement("br"));
        V.renderGraphLineChart(genre["genre"]+"evolutionrent", genre["evolution"], "location");
    }
    )

    
    html = document.querySelector('#iteration6Sold');
    soldEvolutionsPerGenre.forEach(genre => {
        let container = document.createElement("div");
        container.style.height = "50vh";
        container.id = genre["genre"]+"evolutionsold";
        let type = document.createElement("h2");
        type.textContent = genre["genre"];
        html.appendChild(type);
        html.appendChild(container);
        html.appendChild(document.createElement("br"));
        V.renderGraphLineChart(genre["genre"]+"evolutionsold", genre["evolution"], "ventes");
    }
    )

}
V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}


C.init();