import {getRequest} from '../lib/api-request.js';


let LocationsData = {};
LocationsData.fetchLocations = async function(){
    let data = await getRequest('location?param=lastmonth');
    return data;
}



LocationsData.fetchMostLocations = async function(){
    let data = await getRequest('location?param=top3');
    return data; 
}

LocationsData.fetchRentEvolutions = async function(){
    let data = await getRequest('location?param=evolution');
    return data;
}

LocationsData.fetchRentEvolutionsPerGenre = async function(){
    let data = await getRequest('location?param=evolutionPerGenre');
    return data;
}

LocationsData.fetchUsesPerCountries = async function(){
    let data = await getRequest('location?param=UsesPerCountries');
    return data;
}

LocationsData.fetchAllFilms = async function(){
    let data = await getRequest('location?param=AllFilms');
    return data;
}
LocationsData.fetchFilmStats = async function(film =1){
    let data = await getRequest('location?param=FilmStats&filmid='+film)
    return data;
}


export {LocationsData};