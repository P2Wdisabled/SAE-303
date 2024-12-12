// src/ui/prices/index.js

let PricesView = {};

PricesView.render = async function(containerSelector, ventes, location){
    try {
        console.log("Chargement du template Prices...");
        const response = await fetch("./template.html.inc");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const template = await response.text();
        const container = document.querySelector(containerSelector);
        container.innerHTML = template;
        this.update(container, ventes, location);
        console.log("Template Prices chargé et rendu.");
    } catch (error) {
        console.error("Erreur lors du chargement du template Prices:", error);
    }
}

PricesView.update = function(container, ventes, location){
    console.log("Mise à jour des prix...");
    const ventesContainer = container.querySelector("#ventesContainer");
    const locationContainer = container.querySelector("#locationContainer");
    
    if (ventesContainer) {
        ventesContainer.textContent = ventes + " €";
    } else {
        console.warn("Element #ventesContainer non trouvé dans le container.");
    }
    
    if (locationContainer) {
        locationContainer.textContent = location + " €";
    } else {
        console.warn("Element #locationContainer non trouvé dans le container.");
    }
}

export { PricesView };
