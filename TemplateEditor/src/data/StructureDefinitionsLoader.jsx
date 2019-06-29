import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { toODataString } from '@progress/kendo-data-query';


import { baseURL } from './properties';
import { errorMessage } from '../actions/notifications';
import { infoNotification, warnNotification, errorNotification } from '../actions/notifications';

export class StructureDefinitionsLoader extends React.Component {
    
   
    init = { method: 'GET', accept: 'application/fhir+xml;charset=utf-8', headers: {} };
    lastSuccess = '';
    pending = '';
    filter = '';
    searchBy = '';
    transactionId = '';

    initData = (searchBy) =>
    {
        this.lastSuccess = '';
        this.pending = '';
        this.filter = '';
        this.searchBy = searchBy;
    }

    buildQuery = (searchBy) =>
    {
        return  baseURL + '?name:contains='+searchBy;
    }
/*
        
          "url": "http://ocp-apps-elb-811293208.us-east-2.elb.amazonaws.com:8082/fhir/baseDstu3?

           _getpages=0aa788b3-e299-4bc8-a540-efd2c653e9da
            &_getpagesoffset=10
            &_count=10
            &_pretty=true
            &_bundletype=searchset"
    
*/

    getChunck = (queryDefinition, dataState) =>
    {
        const endpoint =
          baseURL + '?_getpages='+queryDefinition.transactionId+
                    '&_getpagesoffset=' + dataState.skip+
                    '&_count='+dataState.take+
                    '&_pretty=true'+
                    '&_bundletype=searchset';
        return endpoint;
    }

    requestDataIfNeeded = () => {

        let searchBy = this.props.queryDefinition.searchBy;
        let transactionId = this.props.queryDefinition.transactionId;
      
      //  console.log("Data Request If Needed, Data State: "+toODataString(this.props.dataState) );
      //  console.log("Data Request If Needed, Query Definition: "+toODataString(this.props.queryDefinition));


        if(!searchBy)
        {
            console.log("Data Request If Needed SearchBy not Defined, local: "+this.searchBy);
            searchBy = this.searchBy;
        }
       
        let url = this.buildQuery(searchBy);
        
        if(searchBy != '' && searchBy != this.searchBy)
        {
            this.initData(searchBy);
           
            console.log("New Query: "+url);
        }
        else if (this.pending || toODataString(this.props.dataState) === this.lastSuccess) {
            
              /*   console.log("No Query: " +
                  this.pending + " Last Success: "+this.lastSuccess + " TransactionId: "
                 + transactionId + " Serach By: "+searchBy);
              */
                 return;
        }
        else {
            url = this.getChunck(this.props.queryDefinition, this.props.dataState);
            console.log("Chunck Query: "+url);
        }
        
        this.pending = toODataString(this.props.dataState);
        
        
        fetch(url, this.init)
            .then(response => response.json())
            .then(json => {

                this.lastSuccess = this.pending;
                this.pending = '';
               
                if (toODataString(this.props.dataState) === this.lastSuccess) {
                 
                    this.props.onDataRecieved.call(undefined, {
                        data: json.entry,
                        total: json['total'],
                        transactionId: json['id']
                    });
                    this.transactionId = json['id'];
                }
                else {
                  
                    console.log("CALL requestDataIfNeeded");
                    this.requestDataIfNeeded();
                }
            })
            .catch(function (error) {
                errorMessage("Structure Definition Query Failed: " + error + ", URL: " +  url);

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
            <div class="k-loading-mask">
                <span class="k-loading-text">Loading</span>
                <div class="k-loading-image"></div>
                <div class="k-loading-color"></div>
            </div>
        );

        const gridContent = document && document.querySelector('.k-grid-content');
        return gridContent ? ReactDOM.createPortal(loadingPanel, gridContent) : loadingPanel;
    }
}


const mapStateToProps = (state, props) => ({
   
});

const mapDispatchToProps = (dispatch, props) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(StructureDefinitionsLoader);