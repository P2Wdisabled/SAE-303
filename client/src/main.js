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
    /*
    [
    {
        "nb": 2,
        "movie_id": 824,
        "movie_title": "Neon Flesh (Carne de neón)"
    },
    {
        "nb": 1,
        "movie_id": 6,
        "movie_title": "Bride Came C.O.D., The"
    },
    {
        "nb": 1,
        "movie_id": 112,
        "movie_title": "Gentleman's Game, A"
    }
]
    */
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
V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}


C.init();