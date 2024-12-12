// src/ui/prices/index.js
const templateFile = await fetch("ui/prices/template.html.inc");
const template = await templateFile.text();

let PricesView = {};

PricesView.render = async function(containerSelector, ventes, location){
    const container = document.querySelector(containerSelector);
    container.innerHTML = template;
    this.update(ventes, location);
}

PricesView.update = function(ventes, location){
    document.querySelector("#ventesContainer").textContent = ventes + " €";
    document.querySelector("#locationContainer").textContent = location + " €";
}

export { PricesView };
