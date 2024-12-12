import { HeaderView } from "./ui/header/index.js";
import { VentesData } from "./data/ventes.js";
import { LocationsData } from "./data/locations.js";
import { ClientData } from "./data/client.js";

/*
import './index.css';
*/


let C = {};

C.init = async function(){
    V.init();
    //let location = await LocationsData.fetchLocations();
    //let ventes = await VentesData.fetchVentes();
    //let toplocations = await LocationsData.fetchMostLocations();
    //let topventes = await VentesData.fetchMostVentes();
    //let soldEvolutions = await VentesData.fetchSoldEvolutions();
    //let rentEvolutions = await LocationsData.fetchRentEvolutions();
    //let rentEvolutionsPerGenre = await LocationsData.fetchRentEvolutionsPerGenre();
    //let soldEvolutionsPerGenres = await VentesData.fetchSoldEvolutionsPerGenre();
    //let rentUsesPerCountries = await LocationsData.fetchUsesPerCountries();
    //let SoldUsesPerCountries = await VentesData.fetchSoldUsesPerCountries();
    //let fetchRentalFilmStats = await LocationsData.fetchFilmStats();
    //let fetchSoldFilmStats = await VentesData.fetchFilmStats();
    //let RentalFilmList = await LocationsData.fetchAllFilms("rentalfilmlist");
    //let SoldFilmList = await VentesData.fetchAllFilms("soldfilmlist");


    let clientStats = await ClientData.fetchStats();
    let clients = await ClientData.fetchClients();
    await V.renderClientList(clients);
    await V.renderClientTreeMap(clientStats);


    //await V.fetchAllFilms("rentalfilmlist", RentalFilmList);
    //await V.fetchAllFilms("soldfilmlist", SoldFilmList);
    //await V.renderFilmStatsAxisWithTicks("fetchRentalFilmStats", fetchRentalFilmStats);
    //await V.renderFilmStatsAxisWithTicks("fetchSoldFilmStats", fetchSoldFilmStats);
    //await V.renderAxisWithTicks("rentUsesPerCountries", rentUsesPerCountries);
    //await V.renderAxisWithTicks("SoldUsesPerCountries", SoldUsesPerCountries);
    //await V.renderEvolutionsPerGenre(rentEvolutionsPerGenre, soldEvolutionsPerGenres);
    //await V.renderEvolutions(soldEvolutions, rentEvolutions);
    //await V.renderToplocations(toplocations, topventes);
    //await V.renderPrices(ventes, location);
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

V.renderClientTreeMap = function(transactions) {
  const genreColors = {
    "Action": "#c23531",
    "Animation": "#2f4554",
    "Comedy": "#61a0a8",
    "Drama": "#d48265",
    "Horror": "#91c7ae",
    "Romance": "#749f83",
    "Sci-Fi": "#ca8622",
    "Thriller": "#bda29a"
  };

  // Suppression du filtre fixe pour customer_id
  // Utilisation directe des transactions passées en paramètre

  // Grouper les transactions par genre, puis par type de transaction
  const genreMap = {};

  transactions.forEach(tx => {
    const genre = tx.genre;
    const type = tx.transaction_type; // "Sale" ou "Rental"

    if (!genreMap[genre]) {
      genreMap[genre] = {};
    }

    if (!genreMap[genre][type]) {
      genreMap[genre][type] = [];
    }

    genreMap[genre][type].push({
      name: tx.movie_title,
      value: parseFloat(tx.price) // Vous pouvez choisir une autre métrique, comme la durée ou la note
    });
  });

  // Transformer les données en format treemap avec hiérarchie : Genre > Type de Transaction > Films
  const treemapData = Object.keys(genreMap).map(genre => ({
    name: genre,
    itemStyle: {
      color: genreColors[genre] || '#000000' // Assignation de la couleur par genre
    },
    children: Object.keys(genreMap[genre]).map(type => ({
      name: type,
      children: genreMap[genre][type],
      itemStyle: {
        color: genreColors[genre] // Assurer que les sous-catégories héritent de la couleur du genre
      }
    }))
  }));

  // Initialiser ECharts
  const dom = document.getElementById('ClientStats');
  let myChart = echarts.getInstanceByDom(dom);
  if (myChart) {
    myChart.dispose(); // Détruire l'instance existante avant d'en créer une nouvelle
  }
  myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
  });

  const option = {
    title: {
      text: 'Films Regardés par Genre et Type de Transaction',
      left: 'center'
    },
    tooltip: {
      formatter: function (info) {
        const value = info.value;
        const treePathInfo = info.treePathInfo;
        const treePath = treePathInfo.map(item => item.name).join(' / ');
        return `
          <div class="tooltip-title">${echarts.format.encodeHTML(treePath)}</div>
          <div>Prix: ${echarts.format.addCommas(value)} €</div>
        `;
      }
    },
    series: [
      {
        name: 'Transactions',
        type: 'treemap',
        visibleMin: 300,
        label: {
          show: true,
          formatter: '{b}'
        },
        itemStyle: {
          borderColor: '#fff'
        },
        data: treemapData,
        levels: [
          {
            // Niveau pour le genre
            colorSaturation: [0.35, 0.5],
            itemStyle: {
              borderColor: '#000',
              borderWidth: 2,
              gapWidth: 5
            },
            upperLabel: {
              show: true,
              formatter: '{b}',
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          {
            // Niveau pour le type de transaction
            itemStyle: {
              gapWidth: 1,
              borderColorSaturation: 0.6
            },
            upperLabel: {
              show: true,
              formatter: '{b}',
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          {
            // Niveau pour les films
            itemStyle: {
              gapWidth: 1
            },
            label: {
              show: true,
              formatter: '{b}',
              fontSize: 12
            }
          }
        ]
      }
    ]
  };

  // Appliquer l'option au graphique
  myChart.setOption(option);
}



V.renderClientList = function(clients){
  let clientList = document.querySelector("#clientList");
  clients.forEach(client => {
      let optionv = document.createElement("option");
      optionv.textContent = client.first_name + " " + client.last_name;
      optionv.value = client.id;
      clientList.appendChild(optionv);
  });
  
  clientList.addEventListener("change", V.updateClientStats);

  // Déclencher la mise à jour pour le premier client par défaut
  if(clients.length > 0){
      clientList.value = clients[0].id;
      V.updateClientStats({ target: clientList });
  }
}


V.updateClientStats = async function(event){
  let selectedClientId = event.target.value;
  let clientStats = await ClientData.fetchStats(selectedClientId);
  
  // Réutiliser le conteneur existant sans le supprimer
  // S'assurer que le conteneur a bien l'ID 'ClientStats' et une hauteur définie
  let clientStatsDiv = document.getElementById("ClientStats");
  if (!clientStatsDiv) {
      clientStatsDiv = document.createElement("div");
      clientStatsDiv.id = "ClientStats";
      clientStatsDiv.style.height = "50vh";
      document.querySelector("#ClientStatsContainer").appendChild(clientStatsDiv);
  }

  // Appeler la fonction pour rendre le treemap avec les nouvelles données
  V.renderClientTreeMap(clientStats);
}



V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}


C.init();