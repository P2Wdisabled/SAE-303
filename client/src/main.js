import { HeaderView } from "./ui/header/index.js";
import { PricesData } from "./data/prices.js";
/*
import './index.css';
*/

let C = {};

C.init = async function(){
    V.init();
    let location = await PricesData.fetchLocations();
    let ventes = await PricesData.fetchVentes();
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
V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}


C.init();