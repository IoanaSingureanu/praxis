import {baseURL} from './properties';
import {errorMessage} from   '../actions/notifications';

export const updateProfile = (dataItem) => {
    const id = dataItem.resource.id;
    const endpoint = baseURL + id + "?_format=json";
    const jsonObj = JSON.stringify(dataItem.resource);
    
    // showObject(endPoint, jsonObj);
   
    fetch(endpoint, {
        method: 'PUT',
         headers: {
            'Accept-Charset': 'utf-8',
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: jsonObj
    })  
    .then((response) => response.text())
    .then((responseText) => {
         console.log(JSON.parse(responseText));
    })
    .catch((error) => {
        errorMessage("Failed to Update Profile: "+error + ", URL: "+endpoint);
    });
}

export const insertProfile = (dataItem) => {
    //POST http://hapi.fhir.org/baseR4/StructureDefinition?_format=json  
    const endpoint = baseURL+"?_format=json";
    const jsonObj = JSON.stringify(dataItem.resource);
    
   // showObject(endPoint, jsonObj);
    fetch(endpoint, {
        method: 'POST',
         headers: {
            'Accept-Charset': 'utf-8',
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: jsonObj
    })  
    .then((response) => response.text())
    .then((responseText) => {
         console.log(JSON.parse(responseText));
    })
    .catch((error) => {
         errorMessage("Failed to Generate Profile: "+error + ", URL: "+endpoint);
   
    });
};

export const showObject = (endpoint, item) =>
{
    console.log("Profile Request URL:   " + endpoint);
    console.log("************ BEGIN JSON **********");
    console.log(item);
    console.log("********** END JSON ************");
};
