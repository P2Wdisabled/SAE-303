
import { VentesData } from "./data/ventes.js";
import { LocationsData } from "./data/locations.js";
import { ClientData } from "./data/client.js";
import { Evolution } from "./ui/evolutions/index.js";
import { FilmStats } from "./ui/filmStats/index.js";
import { FilmsData } from "./data/films.js";
import { Prices } from "./ui/prices/index.js";
import { Performances } from "./ui/topPerformers/index.js";
import { Clients } from "./ui/clients/index.js";
import { Carousel } from "./ui/carousel/index.js";
import { Films } from "./ui/Films/index.js";
import { LoadingScreen } from "./ui/loadingScreen/index.js";

/*
Si vous avez un fichier CSS personnalisé, vous pouvez l'importer ici :
import './index.css';
*/
import * as echarts from 'echarts';
// Objet principal de l'application
let App = {};
// Variable de contrôle du chargement
let isLoading = true;
// Fonction d'initialisation principale
App.init = async function(){
    try {
        console.log("Initialisation de l'application...");

        LoadingScreen.setLoading(isLoading);
        
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
        Prices.renderPrices(ventes, location);

        // Rendu des meilleurs performeurs
        Performances.renderTopPerformers(toplocations, topventes);

        // Rendu des évolutions des ventes et des locations
        Evolution.renderEvolutions(soldEvolutions, rentEvolutions);

        // Rendu des utilisations par pays
        Evolution.renderUsesPerCountries("rentUsesPerCountries", rentUsesPerCountries);
        Evolution.renderUsesPerCountries("SoldUsesPerCountries", soldUsesPerCountries);

        // Rendu des évolutions par genre
        Evolution.renderGenres(rentEvolutionsPerGenre, soldEvolutionsPerGenre);

        // Rendu des statistiques des films
        FilmStats.render(fetchRentalFilmStats, fetchSoldFilmStats, rentalFilmList, soldFilmList);

        // Rendu des statistiques des clients
        Clients.renderClientList(clients);
        Clients.renderClientTreeMap(clientStats);
        Films.renderFilmHeatmap(consumtion);
        Carousel.loadCarousel();
        console.log("Rendu des graphiques terminé.");
        isLoading = false;
        LoadingScreen.setLoading(isLoading);
    } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
    }
}

// Initialisation de l'application
App.init();
