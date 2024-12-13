
let Prices = {};

Prices.renderPrices = async function(ventes, location){
    const ventesContainer = document.querySelector("#ventesContainer");
    const locationContainer = document.querySelector("#locationContainer");

    if (ventesContainer && locationContainer) {
        ventesContainer.textContent = `${ventes} €`;
        locationContainer.textContent = `${location} €`;
    } else {
        console.error("Containers pour ventes ou location introuvables.");
    }
}



export { Prices };
