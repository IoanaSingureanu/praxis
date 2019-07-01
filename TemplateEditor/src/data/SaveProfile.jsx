import { baseURL } from './properties';
import { infoMessage, errorMessage } from '../actions/notifications';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';


export const updateProfile = (dataItem) => {
    const id = dataItem.resource.id;
    const endpoint = baseURL + id + "?_format=json";
    const jsonObj = JSON.stringify(dataItem.resource);

    // showObject(endpoint, jsonObj);

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
            errorMessage("Failed to Update Profile: " + error + ", URL: " + endpoint);
        });
}

export const insertProfile = (dataItem) => {
    //POST http://hapi.fhir.org/baseR4/StructureDefinition?_format=json  
    const endpoint = baseURL + "?_format=json";
    const jsonObj = JSON.stringify(dataItem.resource);

    showObject(endpoint, jsonObj);
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
            errorMessage("Failed to Generate Profile: " + error + ", URL: " + endpoint);

        });
};

export const saveProfileToFile = (dataItem) => {
    // http://ocp-apps-elb-811293208.us-east-2.elb.amazonaws.com:8082/fhir/baseDstu3/StructureDefinition/2421
    const id = dataItem.resource.id;
    const endpoint = baseURL + id;
    const fileDest = "profile-" + id + ".txt";

    saveAs(endpoint, fileDest);
    
    console.log("Save AS " + endpoint + fileDest);
}

export const showObject = (endpoint, item) => {
    console.log("Profile Request URL:   " + endpoint);
    console.log("************ BEGIN JSON **********");
    console.log(item);
    console.log("********** END JSON ************");
};
