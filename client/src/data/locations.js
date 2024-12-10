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

export {LocationsData};