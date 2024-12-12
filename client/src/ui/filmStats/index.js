import { LocationsData } from "../../data/locations.js";
import { VentesData } from "../../data/ventes.js";

const templateFile = await fetch("src/ui/filmStats/template.html.inc");
const template = await templateFile.text();

let FilmStats = {};

FilmStats.render = function(fetchRentalFilmStats, fetchSoldFilmStats, rentalFilmList, soldFilmList){
    // Rendu pour les films de location
    const rentalStatsContainer = document.querySelector("#fetchRentalFilmStats");
    if (!rentalStatsContainer) {
        console.error("Element avec l'ID fetchRentalFilmStats introuvable.");
        return;
    }
    rentalStatsContainer.innerHTML = template;

    // Rendu pour les films vendus
    const soldStatsContainer = document.querySelector("#fetchSoldFilmStats");
    if (!soldStatsContainer) {
        console.error("Element avec l'ID fetchSoldFilmStats introuvable.");
        return;
    }
    soldStatsContainer.innerHTML = template;

    // Remplir les listes de films
    populateFilmList("rentalfilmlist", rentalFilmList, "rental");
    populateFilmList("soldfilmlist", soldFilmList, "sold");

    // Rendu initial des stats
    renderFilmStatsAxisWithTicks("fetchRentalFilmStats", fetchRentalFilmStats);
    renderFilmStatsAxisWithTicks("fetchSoldFilmStats", fetchSoldFilmStats);
}

function populateFilmList(elementId, filmList, type){
    const selectElem = document.getElementById(elementId);
    if (!selectElem) {
        console.error(`FilmStats: Element avec l'ID ${elementId} introuvable.`);
        return;
    }
    filmList.forEach(film => {
        let option = document.createElement("option");
        option.value = film.id;
        option.textContent = film.title;
        selectElem.appendChild(option);
    });

    if(type === "rental"){
        selectElem.addEventListener("change", updateRentFilmStat);
    } else if(type === "sold"){
        selectElem.addEventListener("change", updateSoldFilmStat);
    }
}

async function updateRentFilmStat(event){
    let filmId = event.target.value;
    try {
        let fetchFilmStats = await LocationsData.fetchFilmStats(filmId);
        renderFilmStatsAxisWithTicks("fetchRentalFilmStats", fetchFilmStats);
    } catch (error) {
        console.error("Erreur lors de la mise à jour des stats de location :", error);
    }
}

async function updateSoldFilmStat(event){
    let filmId = event.target.value;
    try {
        let fetchFilmStats = await VentesData.fetchFilmStats(filmId);
        renderFilmStatsAxisWithTicks("fetchSoldFilmStats", fetchFilmStats);
    } catch (error) {
        console.error("Erreur lors de la mise à jour des stats de vente :", error);
    }
}

function renderFilmStatsAxisWithTicks(htmlId, data) {
    if(!data || !data.evolution) {
        console.error("FilmStats: Données d'évolution manquantes.", data);
        return;
    }
    data = data.evolution;
    var dom = document.querySelector("#"+htmlId);
    if (!dom) {
        console.error(`FilmStats: Element avec l'ID ${htmlId} introuvable.`);
        return;
    }
    var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var option;

    // Vérifiez le format des données
    if (!Array.isArray(data) || data.length === 0) {
        console.error(`FilmStats: Données invalides pour ${htmlId}:`, data);
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
    } else {
        console.error(`FilmStats: Option invalide pour ${htmlId}:`, option);
    }

    window.addEventListener('resize', myChart.resize);
}

export { FilmStats };
