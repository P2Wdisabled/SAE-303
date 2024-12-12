// src/main.js
import { HeaderView } from "./ui/header/index.js";
import { PricesView } from "./ui/prices/index.js";
import { TopLocationsView } from "./ui/topLocations/index.js";
import { TopVentesView } from "./ui/topVentes/index.js";
import { EvolutionsView } from "./ui/evolutions/index.js";
import { EvolutionsPerGenreView } from "./ui/evolutionsPerGenre/index.js";
import { UsesPerCountriesView } from "./ui/usesPerCountries/index.js";
import { FilmStatsView } from "./ui/filmStats/index.js";
import { ClientStatsView } from "./ui/clientStats/index.js";

import { VentesData } from "./data/ventes.js";
import { LocationsData } from "./data/locations.js";
import { ClientData } from "./data/client.js";

/*
import './index.css';
*/

let C = {};

C.init = async function(){
    // Initialiser le Header
    await HeaderView.render("#header");

    // Initialiser les autres composants
    const [location, ventes, toplocations, topventes, soldEvolutions, rentEvolutions, 
           rentEvolutionsPerGenre, soldEvolutionsPerGenres, rentUsesPerCountries, 
           SoldUsesPerCountries, fetchRentalFilmStats, fetchSoldFilmStats, 
           RentalFilmList, SoldFilmList, clientStats, clients] = await Promise.all([
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
        ClientData.fetchClients()
    ]);

    // Rendre les composants avec les données
    await PricesView.render("#prices", ventes, location);
    await TopLocationsView.render("#topLocations", toplocations);
    await TopVentesView.render("#topVentes", topventes);
    await EvolutionsView.render("#evolutions", soldEvolutions, rentEvolutions);
    await EvolutionsPerGenreView.render("#evolutionsPerGenre", rentEvolutionsPerGenre, soldEvolutionsPerGenres);
    await UsesPerCountriesView.render("#usesPerCountries", rentUsesPerCountries, SoldUsesPerCountries);
    await FilmStatsView.render("#filmStats", fetchRentalFilmStats, fetchSoldFilmStats, RentalFilmList, SoldFilmList);
    await ClientStatsView.render("#clientStats", clients, clientStats);
}

C.init();
