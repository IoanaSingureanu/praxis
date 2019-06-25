import {baseURL} from './properties';
import {infoMessage, errorMessage} from   '../actions/notifications';

export const updateProfile = (dataItem) => {
    const id = dataItem.resource.id;
    const endpoint = baseURL + id + "?_format=json";
    const jsonObj = JSON.stringify(dataItem.resource);

    /*console.log("Profile UPDATE Request URL:   " + endpoint);
    console.log("************ BEGIN JSON **********");
    console.log(jsonObj);
    console.log("********** END JSON ************");
    */
   
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
         console.log("Update Error-------",error);
         errorMessage("Element Update: "+error + ", URL: "+baseURL);
    });
}

export const insertProfile = (dataItem) => {
    //POST http://hapi.fhir.org/baseR4/StructureDefinition?_format=json  
    const endpoint = baseURL+"?_format=json";
    const jsonObj = JSON.stringify(dataItem.resource);
    
    console.log("Profile GENERATE Request URL:   " + endpoint);
    console.log("************ BEGIN JSON **********");
    console.log(jsonObj);
    console.log("********** END JSON ************");

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
         console.log("Update Error-------",error);
         errorMessage("Element Insert: "+error + ", URL: "+baseURL);
   
    });
};
