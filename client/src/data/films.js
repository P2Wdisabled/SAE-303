import {getRequest} from '../lib/api-request.js';


let FilmsData = {};

FilmsData.fetchConsumtion = async function(){
    let data = await getRequest('Films?param=Consumation');
    return data;
}

export {FilmsData};