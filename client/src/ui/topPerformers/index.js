
let Performances = {};

Performances.renderTopPerformers = async function(toplocations, topventes){
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


export { Performances };