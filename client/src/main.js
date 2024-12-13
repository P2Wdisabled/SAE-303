
import { VentesData } from "./data/ventes.js";
import { LocationsData } from "./data/locations.js";
import { ClientData } from "./data/client.js";
import { EvolutionParGenre } from "./ui/evolutionParGenre/index.js";
import { FilmStats } from "./ui/filmStats/index.js";
import { FilmsData } from "./data/films.js";

/*
Si vous avez un fichier CSS personnalisé, vous pouvez l'importer ici :
import './index.css';
*/

// Objet principal de l'application
let App = {};
// Variable de contrôle du chargement
let isLoading = true;
// Fonction d'initialisation principale
App.init = async function(){
    try {
        console.log("Initialisation de l'application...");

        V.setLoading();
        
        // Récupération des données
        console.log("Récupération des données...");
        let [location, ventes, toplocations, topventes, soldEvolutions, rentEvolutions,
             rentEvolutionsPerGenre, soldEvolutionsPerGenre, rentUsesPerCountries,
             soldUsesPerCountries, fetchRentalFilmStats, fetchSoldFilmStats,
             rentalFilmList, soldFilmList, clientStats, clients, consumtion] = await Promise.all([
            LocationsData.fetchLocations(),
            VentesData.fetchVentes(),
            LocationsData.fetchMostLocations(),
            VentesData.fetchMostVentes(),
            VentesData.fetchSoldEvolutions(),
            LocationsData.fetchRentEvolutions(),
            LocationsData.fetchRentEvolutionsPerGenre(),
            VentesData.fetchSoldEvolutionsPerGenre(),
            LocationsData.fetchUsesPerCountries(),
            VentesData.fetchSoldUsesPerCountries(),
            LocationsData.fetchFilmStats(),
            VentesData.fetchFilmStats(),
            LocationsData.fetchAllFilms("rentalfilmlist"),
            VentesData.fetchAllFilms("soldfilmlist"),
            ClientData.fetchStats(),
            ClientData.fetchClients(),
            FilmsData.fetchConsumtion()
        ]);

        console.log("Données récupérées avec succès.");

        // Rendu des totaux des ventes et des locations
        V.renderPrices(ventes, location);

        // Rendu des meilleurs performeurs
        V.renderTopPerformers(toplocations, topventes);

        // Rendu des évolutions des ventes et des locations
        V.renderEvolutions(soldEvolutions, rentEvolutions);

        // Rendu des utilisations par pays
        V.renderUsesPerCountries("rentUsesPerCountries", rentUsesPerCountries);
        V.renderUsesPerCountries("SoldUsesPerCountries", soldUsesPerCountries);

        // Rendu des évolutions par genre
        EvolutionParGenre.render(rentEvolutionsPerGenre, soldEvolutionsPerGenre);

        // Rendu des statistiques des films
        FilmStats.render(fetchRentalFilmStats, fetchSoldFilmStats, rentalFilmList, soldFilmList);

        // Rendu des statistiques des clients
        V.renderClientList(clients);
        V.renderClientTreeMap(clientStats);
        V.renderFilmHeatmap(consumtion);
        V.loadCarousel();
        console.log("Rendu des graphiques terminé.");
        isLoading = false;
        V.setLoading();
    } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
    }
}

// Objet pour gérer les rendus généraux
let V = {
};


// Fonction pour rendre les totaux des ventes et des locations
V.renderPrices = function(ventes, location){
    const ventesContainer = document.querySelector("#ventesContainer");
    const locationContainer = document.querySelector("#locationContainer");

    if (ventesContainer && locationContainer) {
        ventesContainer.textContent = `${ventes} €`;
        locationContainer.textContent = `${location} €`;
    } else {
        console.error("Containers pour ventes ou location introuvables.");
    }
}

// Fonction pour rendre les meilleurs performeurs
V.renderTopPerformers = function(toplocations, topventes){
    const toplocationsContainer = document.querySelector("#toplocationsContainer");
    const topventesContainer = document.querySelector("#topventesContainer");

    if (toplocationsContainer && topventesContainer) {
        // Rendu des meilleures locations
        toplocationsContainer.innerHTML = "";
        toplocations.forEach(location => {
            let div = document.createElement("div");
            div.className = "mb-2 text-lg";
            div.textContent = `${location.movie_title} : ${location.nb}`;
            toplocationsContainer.appendChild(div);
        });

        // Rendu des meilleures ventes
        topventesContainer.innerHTML = "";
        topventes.forEach(vente => {
            let div = document.createElement("div");
            div.className = "mb-2 text-lg";
            div.textContent = `${vente.movie_title} : ${vente.nb}`;
            topventesContainer.appendChild(div);
        });
    } else {
        console.error("Containers pour top locations ou top ventes introuvables.");
    }
}

// Fonction pour rendre les évolutions des ventes et des locations
V.renderEvolutions = function(soldEvolutions, rentEvolutions){
    V.renderGraphLineChart("soldEvolutions", soldEvolutions, "ventes");
    V.renderGraphLineChart("rentEvolutions", rentEvolutions, "location");
}

// Fonction pour rendre les utilisations par pays
V.renderUsesPerCountries = function(htmlId, data) {
    var dom = document.querySelector("#"+htmlId);
    if (!dom) {
        console.error(`Element avec l'ID ${htmlId} introuvable.`);
        return;
    }
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var option;

    // Vérifiez le format des données
    if (!Array.isArray(data) || data.length === 0) {
        console.error(`Données invalides pour ${htmlId}:`, data);
        return;
    }

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
          name: 'Utilisations',
          type: 'bar',
          barWidth: '60%',
          data: data.map(e => e.value),
          itemStyle: {
              color: '#4ADE80' // Vert clair pour les barres
          }
        }
      ]
    };

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    } else {
      console.error(`Option invalide pour ${htmlId}:`, option);
    }

    window.addEventListener('resize', myChart.resize);
}

// Fonction pour rendre un graphique en ligne
V.renderGraphLineChart = function(htmlId, data, type){
    var dom = document.getElementById(htmlId);
    if(!dom) {
        console.error(`Element avec l'ID ${htmlId} introuvable.`);
        return;
    }
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    let xData, yData;

    if(type === "location"){
        xData = data.map(e => e.mois);
        yData = data.map(e => e.location);
    } else if(type === "ventes"){
        xData = data.map(e => e.mois);
        yData = data.map(e => e.achat);
    } else {
        console.error(`Type inconnu pour renderGraphLineChart: ${type}`);
        return;
    }

    // Vérifiez que xData et yData sont valides
    if (!Array.isArray(xData) || xData.length === 0 || 
        !Array.isArray(yData) || yData.length === 0) {
        console.error(`xData ou yData invalides pour ${htmlId}:`, xData, yData);
        return;
    }

    var option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: xData
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
              data: yData,
              type: 'line',
              smooth: true,
              lineStyle: {
                  color: type === "ventes" ? '#3B82F6' : '#10B981' // Bleu pour ventes, vert pour locations
              },
              areaStyle: {
                  color: type === "ventes" ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)'
              }
            }
        ]
    };

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    } else {
      console.error(`Option invalide pour ${htmlId}:`, option);
    }

    window.addEventListener('resize', myChart.resize);
}

V.renderFilmHeatmap = function(consumtion){
    var dom = document.getElementById('FilmsConsumtion');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        // Fonction pour extraire les catégories uniques et trier les mois
        function extractCategories(data) {
            const paysSet = new Set();
            const moisSet = new Set();

            data.forEach(item => {
                paysSet.add(item.Pays);
                moisSet.add(item.Mois);
            });

            // Convertir les ensembles en tableaux et trier les mois
            const pays = Array.from(paysSet).sort();
            const mois = Array.from(moisSet).sort((a, b) => new Date(a) - new Date(b));

            return { pays, mois };
        }

        // Extraire les catégories
        const { pays, mois } = extractCategories(consumtion);

        // Préparer les données pour ECharts
        const data = consumtion.map(item => {
            return [item.Mois, item.Pays, parseFloat(item.Consommation_GB)];
        });

        // Définir l'option de la heatmap
        option = {
            tooltip: {
                position: 'top',
                formatter: function (params) {
                    return `${params.data[1]} - ${params.data[0]} : ${params.data[2]} Go`;
                }
            },
            grid: {
                height: '80%',
                top: '10%'
            },
            xAxis: {
                type: 'category',
                data: mois,
                axisLabel: {
                    rotate: 45,
                    formatter: function (value) {
                        // Optionnel : formater les labels des mois pour plus de lisibilité
                        return value;
                    }
                },
                splitArea: {
                    show: true
                }
            },
            yAxis: {
                type: 'category',
                data: pays,
                splitArea: {
                    show: true
                }
            },
            visualMap: {
                min: 0,
                max: Math.max(...consumtion.map(item => parseFloat(item.Consommation_GB))),
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '5%',
            },
            series: [
                {
                    name: 'Consommation (GB)',
                    type: 'heatmap',
                    data: data,
                    label: {
                        show: false
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        // Appliquer l'option à ECharts
        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }
}

// Fonction pour rendre les statistiques des clients (Treemap)
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
            value: parseFloat(tx.price)
        });
    });

    const treemapData = Object.keys(genreMap).map(genre => ({
        name: genre,
        itemStyle: {
            color: genreColors[genre] || '#000000'
        },
        children: Object.keys(genreMap[genre]).map(type => ({
            name: type,
            children: genreMap[genre][type],
            itemStyle: {
                color: genreColors[genre]
            }
        }))
    }));

    const dom = document.getElementById('ClientStats');
    if (!dom) {
        console.error("Element avec l'ID ClientStats introuvable.");
        return;
    }

    let myChart = echarts.getInstanceByDom(dom);
    if (myChart) {
        myChart.dispose();
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
                    <div class="tooltip-title font-bold">${echarts.format.encodeHTML(treePath)}</div>
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
                    formatter: '{b}',
                    color: '#000',
                    fontSize: 12
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

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    } else {
        console.error("Option invalide pour le treemap ClientStats:", option);
    }

    window.addEventListener('resize', myChart.resize);
}

// Fonction pour rendre la liste des clients et initialiser les événements
V.renderClientList = function(clients){
    const clientList = document.querySelector("#clientList");
    if (!clientList) {
        console.error("Element avec l'ID clientList introuvable.");
        return;
    }

    clientList.innerHTML = ""; // Reset the list
    clients.forEach(client => {
        let option = document.createElement("option");
        option.textContent = `${client.first_name} ${client.last_name}`;
        option.value = client.id;
        clientList.appendChild(option);
    });

    clientList.addEventListener("change", V.updateClientStats);

    // Déclencher la mise à jour pour le premier client par défaut
    if(clients.length > 0){
        clientList.value = clients[0].id;
        V.updateClientStats({ target: clientList });
    }
}

// Fonction pour mettre à jour les statistiques d'un client sélectionné
V.updateClientStats = async function(event){
    const selectedClientId = event.target.value;
    try {
        const clientStats = await ClientData.fetchStats(selectedClientId);
        V.renderClientTreeMap(clientStats);
    } catch (error) {
        console.error("Erreur lors de la mise à jour des stats du client :", error);
    }
}

V.loadCarousel = async function() {
            V.RentCarousel();
            V.SoldCarousel();
    
};

V.RentCarousel = async function(){
// Sélection des éléments
const scrollContainer = document.getElementById('iteration6Rent');
const scrollLeftBtn = document.getElementById('scrollLeft-Rent');
const scrollRightBtn = document.getElementById('scrollRight-Rent');

// Quantité de défilement en pixels
const scrollAmount = 408;

// Fonction pour défiler à gauche
scrollLeftBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({
        top: 0,
        left: -scrollAmount,
        behavior: 'smooth'
    });
});

// Fonction pour défiler à droite
scrollRightBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({
        top: 0,
        left: scrollAmount,
        behavior: 'smooth'
    });
});
};

V.SoldCarousel = async function(){
    
// Sélection des éléments
const scrollContainer = document.getElementById('iteration6Sold');
const scrollLeftBtn = document.getElementById('scrollLeft-Sold');
const scrollRightBtn = document.getElementById('scrollRight-Sold');

// Quantité de défilement en pixels
const scrollAmount = 408;

// Fonction pour défiler à gauche
scrollLeftBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({
        top: 0,
        left: -scrollAmount,
        behavior: 'smooth'
    });
});

// Fonction pour défiler à droite
scrollRightBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({
        top: 0,
        left: scrollAmount,
        behavior: 'smooth'
    });
});

};

V.setLoading = function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
      if (isLoading) {
        loadingScreen.classList.remove('hidden');
        loadingScreen.classList.add('flex');
      } else {
        loadingScreen.classList.remove('flex');
        loadingScreen.classList.add('hidden');
      }
}

// Initialisation de l'application
App.init();
