import React from 'react';
import { connect } from 'react-redux';
import { Input} from '@progress/kendo-react-inputs';
import { GridColumn as Column, Grid} from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import uuid from 'uuid';

import { StructureDefinitionsLoader} from '../data/StructureDefinitionsLoader.jsx';
import { FHIMProfileEditorForm }      from './FHIMProfileEditorForm.jsx';
import { ColumnNameHeader} from './renderers.jsx';

export class FHIMStructureDefinitionPage extends React.Component {

    offset = { left: 500, top: 50 };
    constructor(props) {
        super(props);
        this.state = {
            structureDefinitions: { data: [], total: 0 },
            dataState: { take: 10, skip: 0 },
            calendarFocused: null,
            searchOn: false,
            searchBy: '',
            profileInEdit: undefined,
            profiles: undefined,
            rowCount:0,
            show: 1
        };
    }
       
    render() {
        return (
            <div className="content-container">
              
              <div align="right" className="k-form">
                 {this.searchInput()}
             </div>
               {this.searchResults()}                    
            </div>

        );
    }

    searchInput=() => (
       
        <div>
           
        <Input
                   style={{ width: '260px', height: '50px', valign: "bottom", backgroundColor:"white"} }   
                 
                    label="Structure Name"              
                    minLength={1}
                    defaultValue =''
                    required={false}         
                    name="serchFilter"
                    onChange={this.onSearchChanged}>
    
           </Input>
    
                &nbsp;&nbsp;
                
           
            <Button icon="search" onClick={this.onClick} 
                     style={{ height: '32px', valign: "bottom", weight: "bold" } }
                     primary={true}>Search</Button>
           
        
        </div>
    );
    
    searchResults=() => (
       
        <div>
               
        <Grid       
                    filterable={false}
                    sortable={true}
                    pageable={true}
                    resizable={true}
                    {...this.state.dataState}
                    {...this.state.structureDefinitions}
                    onDataStateChange={this.dataStateChange}
                    rowHeight={10}
                    skip={this.state.skip}
                    style={{backgroundColor:"rgb(227, 231, 237)"}}
                                    
                    selectedField="selected"
                    onRowClick={(e) => {
                        this.setState({ profileInEdit: this.cloneProfile(e.dataItem) })
                    }} 
                    >
                    
                    <Column field="resource.name" filter="text" title="Structure Name"    
                           headerCell={ColumnNameHeader} cell={StructureNameCell}/>
                    <Column field="resource.type" filter="text" title="Type" 
                         headerCell={ColumnNameHeader}  cell={StructureTypeCell}/>

                </Grid>

                {this.state.searchOn ? (
                    
                    <StructureDefinitionsLoader
                        dataState={this.state.dataState}
                        onDataRecieved={this.dataRecieved}
                        searchBy={this.state.searchBy}/>) : (<p></p>)}
                      

                <br /><br />
                 
                {this.clearState()}
                {this.state.profileInEdit &&
                    <FHIMProfileEditorForm dataItem={this.state.profileInEdit} save={this.save} cancel={this.cancel} />}
           
        
        </div>
    );
    

    dataStateChange = (e) => {
        this.setState({
            ...this.state,
            dataState: e.data
        });

    }

    dataRecieved = (structureDefinitions) => {
        this.setState({
            ...this.state,
            structureDefinitions: structureDefinitions
        });
    }

    pageChange(event) {

        this.setState({
            data: this.state.data,
            skip: event.page.skip
        });
    }


    onCalendarFocusChange = (calendarFocused) => {
        this.setState(() => ({ calendarFocused }));
    }

    onRowFocusChange = (e) => {
       console.log("Focus Canged: "+e);
    };

    onTextChange = (e) => {
        this.props.setTextFilter(e.target.value);
    };


    onSearchChanged = (e) => {

        const searchBy = e.target.value;
        this.setState({ searchBy: searchBy });
    };

    onClick = (e) => {
        this.setState({ searchOn: true });
        this.setState({ structureDefinitions: { data: [], total: 0 } });

    };

    clearState = () => {

        this.state.searchOn = false;
    };

    edit = (dataItem) => {


        this.setState({ profileInEdit: this.cloneProfile(dataItem) });
    }

    remove = (dataItem) => {


        const profiles = this.state.structureDefinitions.data.slice();

        const index = profiles.findIndex(p => p.resource.id === dataItem.resource.id);

        if (index < 0) {
            console.log("Remove Profile: " + dataItem.resource.id + " Not Found");
            return;
        }
        // Udate server
        console.log("Removing profile record: " + dataItem.resource.id);

        profiles.splice(index, 1);

        this.setState({
            profiles: profiles,
            profileInEdit: undefined
        });
        
    }

    save_ = () => {

        const dataItem = this.state.profileInEdit;
        const profiles = this.state.structureDefinitions.data;

      
        if (dataItem.resource.id === undefined) {
            profiles.unshift(this.newProfie(dataItem));
            console.log("NOT DEFINED: Saving Profile: ClassName: " + dataItem.resource.name);
        }
        else {

            const index = profiles.findIndex(p => p.resource.id === dataItem.resource.id);
           // TODO
            console.log("SVAE HERE PROFILE TO SERVER ID: "+index)
            profiles.splice(index, 1, dataItem);


        }
        this.setState({
            profiles: profiles,
            profileInEdit: undefined
        });
    }

    save = () => {

        const profiles = this.state.structureDefinitions.data;
        this.setState({
            profiles: profiles,
            dataItem: this.state.profileInEdit,
            profileInEdit: undefined
        });
    }

    cancel = () => {
        this.setState({ profileInEdit: undefined });
    }

    insert = () => {
        this.setState({ profileInEdit: {} });
    }


    cloneProfile(profileRecord) {

        const profiles = this.state.structureDefinitions.data;
        let profileRef =
            profiles.find(p => p.resource.id === profileRecord.resource.id);


        if (!profileRef) {
            console.log("PROFILE: " + profileRef + " Not Found.");

        }
        return Object.assign({}, profileRecord);
    }

    newProfie(source) {

        const id = uuid.v4();
        const profile = {
            resource: { id: id, name: '', url: '' }
        };


        console.log("NEW Profile: " + profile);

        return Object.assign(profile, source);
    }
       
}

class StructureNameCell extends React.Component {
    
    render() {
        let msg = "Click on the Row in order to load profile.";
        return (
            <td  
                
                style={{color:"rgb(4, 66, 165)"}}
                title={msg}>
                {this.props.dataItem.resource.name}
            </td>
        );
    }
}

class StructureTypeCell extends React.Component {
    
    render() {
        let msg = "Click on the Row in order to load profile.";
        return (
            <td 
                style={{color:"rgb(4, 66, 165)"}}
                title={msg} >
                {this.props.dataItem.resource.type} 
            </td>
        );
    }
}

const mapStateToProps = (state, props) => ({
   
  });
  
  const mapDispatchToProps = (dispatch, props) => ({
   
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(FHIMStructureDefinitionPage);
  