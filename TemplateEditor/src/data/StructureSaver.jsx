import { baseURL } from './properties';
import { infoMessage, errorMessage } from '../actions/notifications';



export const updateTemplate = (dataItem) => {
    const id = dataItem.resource.id;
    const endpoint = baseURL + id + "?_format=json";
    const jsonObj = JSON.stringify(dataItem.resource);

    showObject("Update",endpoint, jsonObj);

    fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Accept-Charset': 'utf-8',
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: jsonObj
    })
        .then((response) => {
            console.log("Update Operation Successed.");
        })
        .catch((error) => {
            errorMessage("Failed to Update Structure: " + error + ", URL: " + endpoint);
        });
}

export const insertTemplate = (dataItem) => {
    //POST http://hapi.fhir.org/baseR4/Structure?_format=json  
    const endpoint = baseURL + "?_format=json";
    const jsonObj = JSON.stringify(dataItem.resource);

    showObject("Insert", endpoint, jsonObj);
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Accept-Charset': 'utf-8',
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: jsonObj
    })
        .then((response) => {
            console.log("Create Operation Successed.");
        })
        .catch((error) => {
            errorMessage("Failed to Generate Structure: " + error + ", URL: " + endpoint);

        });
};

export const saveStructureToFile = (dataItem) => {
    // http://ocp-apps-elb-811293208.us-east-2.elb.amazonaws.com:8082/fhir/baseDstu3/Structure/2421
    const id = dataItem.resource.id;
    const endpoint = baseURL + id;
    const fileDest = "resource-" + id + ".txt";

   // saveAs(endpoint, fileDest);
    
    console.log("Save AS " + endpoint + fileDest);
    let win = window.open(endpoint, '_blank');
    win.focus();
}

export const showObject = (id, endpoint, item) => {
    console.log("Id: "+id+ " Structure Request URL:   " + endpoint);
    console.log("************ BEGIN JSON **********");
    console.log(item);
    console.log("********** END JSON ************");
};
