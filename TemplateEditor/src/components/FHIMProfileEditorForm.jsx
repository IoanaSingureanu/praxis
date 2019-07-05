import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridColumn as Column, Grid, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Popup } from '@progress/kendo-react-popup';
import { Input } from '@progress/kendo-react-inputs';


import { TableNameHeader, ColumnNameHeader, Renderers } from './renderers.jsx';
import { updateProfile, insertProfile, saveProfileToFile } from '../data/SaveProfile.jsx';
import { infoMessage, warnMessage, errorMessage, warnNotification } from '../actions/notifications';

let availableElements = [];
const pageSize = 6;


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
            value: '',
            skip: 0

        };

        this.pageChange = this.pageChange.bind(this);
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

        const gridScrollbar = {
            width: 1000,
            height: 400,
          };

        const profile = [this.state.profileInEdit];
        let structureName = "Structure";
        if (this.isObjectClassType(profile[0])) {
            structureName = "Class";
        }
        else if (this.isObjectTemplateType(profile[0])) {
            structureName = "Template";
        }
        const tableHeader = structureName + ": " + profile[0].resource.name;

        return (

            <div className="content-container">

                <Popup className="popup-content" anchor={this.anchor}
                    show={this.state.show}
                    onClose={this.props.cancel}
                    position="top center"
                    align={{
                        horizontal: "center",
                        vertical: "center"
                    }}
                    popupClass={'popup-content'} >
                    {this.initWidget(profile)}
                    <div className="k-form" align="center">
                   
                        <Grid
                            style={{ width: '950px'}}
                            rowHeight={pageSize}
                            data={availableElements.slice(this.state.skip, this.state.skip + pageSize)}
                            pageSize={pageSize}
                            total={availableElements.length}
                            skip={this.state.skip}
                            pageable={true}
                            onPageChange={this.pageChange}
                            resizable={true}
                            onItemChange={this.itemChange}
                            editField="inEdit" >
                            
                            <Column headerCell={ColumnNameHeader} title="Data Element" field="id" editable={false} />
                            <Column headerCell={ColumnNameHeader} title="Type" field="type" editable={true} cell={TypeCell} />
                            <Column headerCell={ColumnNameHeader} title="Usage" field="extensions" editable={true} cell={UsageDownCell} />
                           
                            <GridToolbar>
                                <div align="right">
                                    {this.listButtons(tableHeader)}
                                </div>
                            </GridToolbar>
                        </Grid>
                        <br/>
                       <div align="left">
                            {this.genProfieInputs(profile[0])}
                        </div>
                    </div>
                    <div style={{backgroundColor:"rgb(227, 231, 237)"}}>
                        <div
                         style={{"margin-left": "60px", color:"black", fontWeight: "bold", "font-size": "14px"}}>
                         {tableHeader}
                         </div>
                    </div>
                </Popup>
            </div>
        );
    }



    initWidget = (profile) => {
        
        
        if (profile[0] && profile[0].resource.snapshot && profile[0].resource.snapshot) {
            this.state.data = profile[0].resource.snapshot.element;
            const extension = this.state.data[0].extension;
            const len = this.state.data.length;

            if (extension && extension[0] && extension[0].valueString !== '') {

                availableElements = this.state.data.slice();
            }
            else {
                availableElements = this.state.data.slice(1, len);
            }
            console.log("INIT Widget Element Length: " + availableElements.length +
                "  From " + this.state.data.length + " Scroll Window Size: " + pageSize
                + " Skip: "+this.state.skip);
        }
        else {
            warnNotification("Missing Data Elements From the Structure: ");
        }
    };

    genProfieInputs = (profile) => (

        <div>

            <Input
                className="input-field"
                label="Organization Name"
                minLength={1}
                defaultValue={profile.resource.publisher}
                required={true}
                name="organizationName"
                disabled={!this.enableInputRestrictFields()}
                onChange={this.onOrganizationNameChange}>
            </Input>
            <br /><br />
            <Input
                className="input-field"
                label="Implementation Guide"
                minLength={1}
                defaultValue={profile.resource.implicitRules}
                required={true}
                name="implementationGuide"
                disabled={!this.enableInputRestrictFields()}
                onChange={this.onImplementationGuideChange}>
            </Input>
            <br /><br />
            <Input
                className="input-field"
                style={{ width: "55%" }}
                label="Template Name"
                minLength={1}
                defaultValue={profile.resource.name}
                required={true}
                name="templateName"
                disabled={!this.enableInputRestrictFields()}
                onChange={this.onTemplateNameChange}>
            </Input>
            <br /><br />
            <Input
                className="input-field"
                label="Template Version"
                minLength={1}
                defaultValue={this.getVersion(profile.resource.name)}
                required={true}
                name="templateVersion"
                disabled={!this.enableInputFields()}
                onChange={this.onTemplateVersionChange}>
            </Input>
        </div>

    );

    listButtons = (tableHeader) => (
        <div>
            
            <Button name="updateProfieButton"
                disabled={!this.enableSaveProfile()}
                onClick={this.updateProfile} className="k-button k-primary mt-1 mb-1">Save</Button>
            &nbsp;&nbsp;
           <Button name="genProfileButton"
                onClick={this.generateProfile}
                className="k-button k-primary mt-1 mb-1">Generate FHIR Profile</Button>
            &nbsp;&nbsp;
            <Button name="cancelButton" onClick={this.props.cancel} className="k-button k-primary mt-1 mb-1">Cancel</Button>

        </div>
    );

    generateProfile = (e) => {
        e.preventDefault();
        const profile = this.state.profileInEdit
        console.log("Executing Generate profile");
        //get profile from the server
        //save profile to disk
        saveProfileToFile(profile);
    }

    isObjectTemplateType = (profile) => {
        // resource type
        let resourceType = profile.resource.type;
        if (!resourceType) {
            console.log("Warning, Resource Name is not defined");
            return false;
        }
        if (resourceType.endsWith('template')) {
            return true;
        }
        return false;
    }

    isObjectClassType = (profile) => {
        // resource type
        let resourceType = profile.resource.type;
        if (!resourceType) {
            console.log("Warning, Resource Name is not defined");
            return false;
        }
        if (resourceType.endsWith('class')) {
            return true;
        }
        return false;
    }

    enableGenerateProfile = () => {

        if (this.enableInputFields()) {
            if (this.isObjectTemplateType(this.state.profileInEdit))
                return true;
        }
        return false;
    }

    enableSaveProfile = () => {

        if (this.enableInputFields()) {
            return this.validateSaveProfile(false);
        }
        return false;
    }


    enableInputFields = () => {

        if (this.isObjectTemplateType(this.state.profileInEdit) ||
            this.isObjectClassType(this.state.profileInEdit)) {
            return true;
        }
        return false;
    }
    enableInputRestrictFields = () => {

        return this.enableInputFields();
    }

    getVersion = (name) => {
        const res = name.split('.');

        if (res.length > 2) {
            return res[res.length - 1];
        }

        return '0';
    }

    getTemplateName = (name) => {

        const res = name.split('.');
        let newName = 'ClassName';

        if (res.length > 0) {
            newName = res[0];
        }
        console.log("Get Template: Name: Old Name: " + name + " New Name: " + newName);
        return newName;
    }

    validateSaveProfile = (showError) => {

        const profile = this.state.profileInEdit;

        let errList = '';
        let beginMessage = "Field: "
        let endMessage = " is required. "


        if (profile.resource.publisher === '') {
            errList += "'Organization Name'";
        }
        if (profile.resource.implicitRules === '') {
            if (errList !== '') {
                beginMessage = "Fieeds: "
                endMessage = " are required."
                errList += ", ";
            }
            errList += "'Implementation Guide'";
        }
        if (profile.resource.name.trim() === '') {
            if (errList !== '') {
                beginMessage = "Fields: "
                endMessage = " are required."
                errList += ", ";
            }
            errList += "'Template Name'";
        }
        if (this.state.templateVersion === '' &&
            this.getVersion(profile.resource.name) === '') {
            if (errList !== '') {
                beginMessage = "Fields: "
                endMessage = " are required."
                errList += ", ";
            }
            errList += "'Template Version'";
        }

        if (errList !== '') {
            const err = beginMessage + errList + endMessage;
            if (showError) {

                alert(err);
            }
            else {
                console.log(err);
            }

            return false;
        }

        return true;

    };

    buildTemplateName = (res, name, version) => {
        const newName = res.publisher +
            "." + res.implicitRules +
            "." + name +
            "." + version;

        console.log("PROFILE NAME: " + newName);
        return newName;


    }
    updateProfile = (e) => {

        e.preventDefault();
        const errorMessage =
            "A new template requires an implementation guide,  a responsible organization, a template name, and a template version.";
        let profile = this.state.profileInEdit;
        let res = profile.resource;

        if (!this.validateSaveProfile(true)) {
            return;
        }

        profile.resource.name =
            this.buildTemplateName(res,
                this.getTemplateName(res.name),
                this.state.templateVersion);

        if (this.isObjectClassType(profile)) {
            // Create template first          
            profile = this.createTemplate(profile);
        }
        else if (this.isObjectTemplateType(profile)) {
            // Update
            console.log("Update Tempate  Name: " + profile.resource.name);
            updateProfile(profile);
        }

        this.props.save();
    };


    createTemplate = (profile) => {

        console.log("Before: " + profile.resource.type);
        let clone = cloneProfile(profile);
        let res = clone.resource;
        clone.resource.type = clone.resource.type.replace('class', 'template');
        clone.resource.version = this.state.templateVersion;
        clone.resource.name =
            this.buildTemplateName(res,
                this.state.templateName,
                this.state.templateVersion);
        console.log("New Tempate  Name: " + clone.resource.name);

        profile = insertProfile(clone);


        this.setState({
            searchOn: true
        });
        return clone;

    };


    onChange(e) {
        this.setState({ value: e.target.value });
    };

    onOrganizationNameChange = (e) => {

        const organizationName = e.target.value;
        this.setState({ organizationName: organizationName });

        let profile = this.state.profileInEdit;
        profile.resource.publisher = organizationName;

    };

    onImplementationGuideChange = (e) => {

        const implementationGuide = e.target.value;
        this.setState({ implementationGuide: implementationGuide });
        let profile = this.state.profileInEdit;
        profile.resource.implicitRules = implementationGuide;

    };

    onTemplateNameChange = (e) => {

        const templateName = e.target.value;
        this.setState({ templateName: templateName });
        let profile = this.state.profileInEdit;
        profile.resource.name = templateName;

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

    pageChange(event) {
       console.log("Page Change Event: Skip: " +event.page.skip);
       
        this.setState({
            skip: event.page.skip
        });
    }

    itemChange(event) {
        console.log("Item Change Event");
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

