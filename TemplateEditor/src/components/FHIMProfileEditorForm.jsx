import React from 'react';
import { connect } from 'react-redux';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridColumn as Column, Grid} from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Popup } from '@progress/kendo-react-popup';
import { Input } from '@progress/kendo-react-inputs';

import { TableNameHeader, ColumnNameHeader, Renderers } from './renderers.jsx';
import { updateProfile, insertProfile } from '../data/SaveProfile.jsx';
import {infoMessage, warnMessage, errorMessage} from   '../actions/notifications';

export class FHIMProfileEditorForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            editItem: undefined,
            changes: false,
            profileInEdit: this.props.dataItem || null,
            show: true,
            organizationName: '',
            implementationGuide: '',
            templateName: '',
            templateVersion: '',
            value: ''
        };

        this.saveChanges = this.saveChanges.bind(this);
        this.cancelChanges = this.cancelChanges.bind(this);
        this.itemChange = this.itemChange.bind(this);
        this.renderers = new Renderers(this.enterEdit.bind(this), this.exitEdit.bind(this), 'inEdit');
        this.onChange = this.onChange.bind(this);
        this.onOrganizationNameChange = this.onOrganizationNameChange.bind(this);
        this.onImplementationGuideChange = this.onImplementationGuideChange.bind(this);
        this.onTemplateNameChange = this.onTemplateNameChange.bind(this);
        this.onTemplateVersionChange = this.onTemplateVersionChange.bind(this);
    }


    render() {

        const profile = [this.state.profileInEdit];
        this.initWidget(profile);
        {this.fromObjectToForm(profile[0])}
        const tableHeader = "Structure: " + profile[0].resource.name;

        return (
            <div className="content-container">

                <Popup className="popup-content" anchor={this.anchor}
                    show={this.state.show}
                    onClose={this.props.cancel}
                    position="top center"
                    align={{
                        horizontal: "center",
                        vertical:   "center"
                    }}
                    popupClass={'popup-content'} >

                    <form onSubmit={this.handleSubmit} className="k-form">

                        <Grid
                            style={{ backgroundColor: "rgb(227, 231, 237)" }}
                            data={this.state.data}
                            rowHeight={2}
                            onItemChange={this.itemChange}
                            filterable={false}
                            sortable={true}
                            resizable={true}
                            editField="inEdit">
                            <Column headerCell={TableNameHeader} title={tableHeader} >
                                <Column headerCell={ColumnNameHeader} title="Data Element" field="id" editable={false} />
                                <Column headerCell={ColumnNameHeader} title="Type" field="type" editable={true} cell={TypeCell} />
                                <Column headerCell={ColumnNameHeader} title="Usage" field="extensions" editable={true} cell={UsageDownCell} />
                            </Column>
                        </Grid>

                        <div align="left" className="k-form">
                            {this.genProfieInputs(profile[0])}
                         
                        </div>

                        <div align="center" className="k-form">
                            {this.listButtons()}
                        </div>
                    </form>
                </Popup>
            </div>
        );
    }

    initWidget = (profile) => {
         if(profile[0] && profile[0].resource.snapshot && profile[0].resource.snapshot )
         {
            this.state.data = profile[0].resource.snapshot.element;
         }
         else{
             warnMessage("Missing Data Elements From the Structure: "+profile );
         }
         
       
    };

    genProfieInputs = (profile) => (

        <table>
            <tr>
                <Input
                    className="input-field"
                    label="Organization Name"
                    minLength={1}
                    defaultValue={profile.resource.publisher}
                    required={false}
                    name="organizationName"
                    onChange={this.onOrganizationNameChange}>
                </Input>
            </tr>
            <tr>
                <Input
                    className="input-field"
                    label="Implementation Guide"
                    minLength={1}
                    defaultValue={profile.resource.implicitRules}
                    required={false}
                    name="implementationGuide"
                    onChange={this.onImplementationGuideChange}>
                </Input>
            </tr>
            <tr>
                <Input
                    className="input-field"
                    label="Template Name"
                    minLength={1}
                    defaultValue={profile.resource.name}
                    required={false}
                    name="templateName"
                    onChange={this.onTemplateNameChange}>
                </Input>
            </tr>
            <tr>
                <Input
                    className="input-field"
                    label="Template Version"
                    minLength={1}
                    defaultValue={profile.resource.version}
                    required={false}
                    name="templateVersion"
                    onChange={this.onTemplateVersionChange}>
                </Input>
            </tr>
        </table>

    );

    listButtons = () => (
        <table>
            <tr>
                <td>
                 <Button name="canceButton" onClick={this.props.cancel}>Cancel</Button>
                    &nbsp;&nbsp;
                <Button name="updateProfieButton" onClick={this.updateProfile} className="k-button k-primary mt-1 mb-1">Save</Button>
                    &nbsp;&nbsp;
                <Button name="genProfileButton"
                        disabled={!this.vaidateGenerateProfile()}
                        onClick={this.generateProfile}
                        className="k-button k-primary mt-1 mb-1">Generate FHIR Profile</Button>

                </td>
            </tr>
        </table>

    );


    vaidateGenerateProfile = () => {

        if (this.state.organizationName === '' || this.state.implementationGuide === '' ||
            this.state.templateName === '' || this.state.templateVersion === '') {
            return false;
        }
        return true;
    };


    updateProfile = (e) => {
        e.preventDefault();

        const profile = this.state.profileInEdit;
        //const profile = [this.state.profileInEdit];
        updateProfile(profile);
  
        this.props.save();
    };

    fromFormToObject = (profile) =>
    {
        profile.resource.publisher = this.state.organizationName;
        profile.resource.implicitRules = this.state.implementationGuide;
        profile.resource.name = this.state.templateName;
        profile.resource.version = this.state.templateVersion;

        console.log("From Form to Object: Publisher: "+
        profile.resource.publisher + " Rule: "+ 
        profile.resource.implicitRules + " Name: "
        +profile.resource.name + " Version: " + profile.resource.version );
    }

    fromObjectToForm = (profile) =>
    {
        if(this.vaidateGenerateProfile())
             return;
       
        if(!profile.resource)
        {
            console.log("Profile Resource Missing");
            return;
        }
        
        if(profile.resource.publisher && this.state.organizationName  === '')
            this.state.organizationName = profile.resource.publisher;
        if(profile.resource.publisher && this.state.implementationGuide === '')
             this.state.implementationGuide =  profile.resource.implicitRules;
        if(profile.resource.name &&   profile.resource.name === '')
          this.state.templateName = profile.resource.name;
        if(profile.resource.version && this.state.templateVersion === '')
            this.state.templateVersion =  profile.resource.version;
    
            console.log("From Object to Form:: Publisher: "+
            profile.resource.publisher + " Rule: "+ 
            profile.resource.implicitRules + " Name: "
            +profile.resource.name + " Version: " + profile.resource.version );
            
       
    }


    generateProfile = (e) => {

        e.preventDefault();
        const errorMessage = 
        "A new template requires an implementation guide,  a responsible organization, a template name, and a template version.";

        if(!this.vaidateGenerateProfile())
        {   
            alert(errorMessage);
            return;
        }
        let profile =  cloneProfile(this.state.profileInEdit);
        this.fromFormToObject(profile);
        this.setState({
            searchOn: true
        });
        
        insertProfile(profile);
        this.props.save();
    };

    onChange(e) {
        this.setState({ value: e.target.value });
    }

    onOrganizationNameChange = (e) => {

        const organizationName = e.target.value;
        this.setState({ organizationName: organizationName });

    };


    onImplementationGuideChange = (e) => {

        const implementationGuide = e.target.value;
        this.setState({ implementationGuide: implementationGuide });
    };

    onTemplateNameChange = (e) => {

        const templateName = e.target.value;
        this.setState({ templateName: templateName });
    };

    onTemplateVersionChange = (e) => {
        const templateVersion = e.target.value;
        this.setState({ templateVersion: templateVersion });
    };


    rowRender = (trElement, props) => {

        const dataItem = props.dataItem;
        const profiles = this.state.data.slice();
        const index = profiles.findIndex(p => p.id === dataItem.id);
        const evenRow = { backgroundColor: "rgb(237, 242, 247)" };
        const oddRow = { backgroundColor: "rgb(rgb(252, 253, 255))" };
        const trProps = { style: index % 2 ? evenRow : oddRow };
        return React.cloneElement(trElement, { ...trProps }, trElement.props.children);
    };

    enterEdit(dataItem, field) {
        if (dataItem.inEdit && field === this.state.editField) {
            return;
        }
        this.exitEdit();
        dataItem.inEdit = field;
        this.setState({
            editField: field,
            data: this.state.data
        });
    }

    exitEdit() {
        this.state.data.forEach((d) => { d.inEdit = undefined; });
        this.setState({
            data: this.state.data,
            editField: undefined
        });
    }

    saveChanges(e) {
        e.preventDefault();
        this.setState({
            editField: undefined,
            changes: false
        });
    }

    cancelChanges(e) {
        e.preventDefault();
        this.setState({
            changes: false
        });
    }

    itemChange(event) {
        event.dataItem[event.field] = event.value;
        this.setState({
            changes: true
        });
    }

}

class TypeCell extends React.Component {

    handleChange = (e) => {
        this.props.onChange({
            dataItem: this.props.dataItem,
            field: this.props.field,
            syntheticEvent: e.syntheticEvent,
            value: e.target.value.value
        });
    }

    render() {

        let typeValue = "Not Set";


        if (this.props.dataItem.type) {
            typeValue = this.props.dataItem.type[0].code;
            return (
                <td>
                    {typeValue}
                </td>

            );
        }
        else {
            console.log("TYPE NOT DEFINED");
        }

        console.log("Type Code: " + typeValue + " ");


    }
}

class UsageDownCell extends React.Component {

    localizedData = [
        { text: "Supported", value: "supported" },
        { text: 'Mandatory', value: "mandatory" },
        { text: "Not supported", value: "not supported" }
    ];


    handleChange = (e) => {

        let extension = this.props.dataItem.extension;


        if (extension && extension[0] && extension[0].valueString) {

            /* console.log("Handle Usage Cell"); console.log("--->Handle Change: ''" +
                 this.props.field + "'" + " ''" +
                 extension[0].valueString + "'  New Vaue: ''" + e.target.value.value + "'");
                 */

            extension[0].valueString = e.target.value.value;
        }
        else {
            console.log("Handle Usage Cell"); console.log("--->Handle Change: ''" +

                this.props.field + " " + this.props.dataItem);
        }

        this.props.onChange({
            dataItem: this.props.dataItem,
            field: this.props.field,
            syntheticEvent: e.syntheticEvent,
            value: e.target.value.value
        });
    }

    render() {

        let extension = this.props.dataItem.extension;

        let extensionValue = "not supported";
        if (extension) {
            extensionValue = extension[0].valueString;
        }
        else {
            return (
                <td>
                </td>

            );
        }

        return (
            <td>
                <DropDownList
                    style={{ width: "140px", fontSize: '12pt' }}
                    onChange={this.handleChange}
                    data={this.localizedData}
                    defaultValue={this.localizedData.find(c => c.value === extensionValue)}
                    textField="text"
                />
            </td>

        );
    }
}


function cloneProfile(profile) {
    return Object.assign({}, profile);
}

const mapStateToProps = (state, props) => ({

});

const mapDispatchToProps = (dispatch, props) => ({
    updateProfile: (profile) => dispatch(updateProfile(profile)),
    insertProfile: (profile) => dispatch(insertProfile(profile))
});

export default connect(mapStateToProps, mapDispatchToProps)(FHIMProfileEditorForm);

