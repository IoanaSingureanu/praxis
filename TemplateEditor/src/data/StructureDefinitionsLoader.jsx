import React from 'react';
import ReactDOM from 'react-dom';
import { toODataString } from '@progress/kendo-data-query';


import {baseURL} from './properties';
import {errorMessage} from   '../actions/notifications';

export class StructureDefinitionsLoader extends React.Component {
    endpoint = baseURL+'?name:contains=';
    init = { method: 'GET', accept: 'application/fhir+xml;charset=utf-8', headers: {} };

    lastSuccess = '';
    pending = '';
    filter = '';

  
    requestDataIfNeeded = () => {

       
        if (this.props.searchBy === '' || this.pending 
            || toODataString(this.props.dataState) === this.lastSuccess) {
            
            return;
        }
        const  url = this.endpoint+this.props.searchBy;
        this.pending = toODataString(this.props.dataState);
     
        fetch(url, this.init)  
            .then(response => response.json())
            .then(json => {
               

                this.lastSuccess = this.pending;
                this.pending = '';
             
                if (toODataString(this.props.dataState) === this.lastSuccess) {
                    this.props.onDataRecieved.call(undefined, {
                        data: json.entry,
                        total: json['total']
                        
                    });
                   
                } 
                else {
                    this.pending = '';
                    errorMessage("Structure Definition Query Failed: URL: "+this.endpoint);
                    this.requestDataIfNeeded();
                }

            })
            .catch(function (error) {
                errorMessage("Structure Definition Query Failed: "+error + ", URL: "+this.endpoint);
      
            })
    }

    render() {
        this.requestDataIfNeeded();   
          
        return this.pending && <LoadingPanel />;
    }
}


class LoadingPanel extends React.Component {
    render() {
       
        const loadingPanel = (
            <div >
                <span>Loading</span>
                <div></div>
                <div></div>
            </div>
        );

        const gridContent = document && document.querySelector('.k-grid-content');
        return gridContent ? ReactDOM.createPortal(loadingPanel, gridContent) : loadingPanel;
    }
}

