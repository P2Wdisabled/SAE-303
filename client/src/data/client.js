import {getRequest} from '../lib/api-request.js';


let ClientData = {};

ClientData.fetchStats = async function(clientid = 1){
    let data = await getRequest('client?param=Stats&clientid='+clientid);
    return data;
}

ClientData.fetchClients = async function(){
    let data = await getRequest('client?param=List');
    return data;
}

export {ClientData};