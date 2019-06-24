import React from 'react';
import { connect } from 'react-redux';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridColumn as Column, Grid, GridToolbar } from '@progress/kendo-react-grid';
import { Button, ButtonGroup, ToolbarItem, Toolbar } from '@progress/kendo-react-buttons';
import { Popup } from '@progress/kendo-react-popup';
import { Input } from '@progress/kendo-react-inputs';

import { TableNameHeader, ColumnNameHeader, Renderers } from './renderers.jsx';
import { updateProfile, insertProfile } from '../data/SaveProfile.jsx';



function cloneProfile(product) {
    return Object.assign({}, product);
}

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
        const enterEdit = this.enterEdit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onOrganizationNameChange = this.onOrganizationNameChange.bind(this);
        this.onImplementationGuideChange = this.onImplementationGuideChange.bind(this);
        this.onTemplateNameChange = this.onTemplateNameChange.bind(this);
        this.onTemplateVersionChange = this.onTemplateVersionChange.bind(this);
    }


    render() {

        const profile = [this.state.profileInEdit];
        this.initWidget(profile);
        const tableHeader = "Structure: " + profile[0].resource.name;

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

                    <form onSubmit={this.handleSubmit}>

                        <Grid
                            style={{ backgroundColor: "rgb(227, 231, 237)" }}
                            data={this.state.data}
                            rowHeight={15}
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
                            {this.listInputs()}
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
         this.state.data = profile[0].resource.snapshot.element;
    };

    listInputs = () => (

        <table>
            <tr>
                <Input
                    className="input-field"
                    label="Organization Name"
                    minLength={1}
                    defaultValue=''
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
                    defaultValue=''
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
                    defaultValue=''
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
                    defaultValue=''
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
                <Button name="updateProfieButton" onClick={this.updateProfile} primary={true}>Save</Button>
                    &nbsp;&nbsp;
                <Button name="genProfileButton"
                        disabled={!this.vaidateGenerateProfile()}
                        onClick={this.generateProfile}
                        primary={true}>Generate FHIR Profile</Button>

                </td>
            </tr>
        </table>

    );


    vaidateGenerateProfile = () => {

        if (this.state.organizationName == '' || this.state.implementationGuide == '' ||
            this.state.templateName == '' || this.state.templateVersion == '') {
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


    generateProfile = (e) => {
        e.preventDefault();
        const errorMessage = 
        "A new template requires an implementation guide,  a responsible organization, a template name, and a template version.";

        if(!this.vaidateGenerateProfile())
        {   
            alert(errorMessage);
            return;
        }

        this.setState({
            searchOn: true
        });

        const dataItem = this.state.profileInEdit;
        insertProfile(dataItem);
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


    itemChange(event) {
        const value = event.value;
        const name = event.field;
        if (!name) {
            return;
        }
        const updatedData = this.state.data.slice();
        const item = this.update(updatedData, event.dataItem);
        item[name] = value;
        this.setState({
            data: updatedData
        });
    }

    update(data, item, remove) {
        let updated;
        let index = data.findIndex(p => p === item || item.id && p.id === item.id);
        if (index >= 0) {
            updated = Object.assign({}, item);
            data[index] = updated;
        } else {
            let id = 1;
            data.forEach(p => { id = Math.max(p.id + 1, id); });
            updated = Object.assign({}, item, { id: id });
            data.unshift(updated);
            index = 0;
        }

        if (remove) {
            return data.splice(index, 1)[0];
        }

        return data[index];
    }

    rowRender = (trElement, props) => {

        const dataItem = props.dataItem;
        const profiles = this.state.data.slice()

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
            console.log("XXXX Handle Usage Cell"); console.log("--->Handle Change: ''" +

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

        let dataValue = 'supported';
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

const mapStateToProps = (state, props) => ({

});

const mapDispatchToProps = (dispatch, props) => ({
    updateProfile: (profile) => dispatch(updateProfile(profile)),
    insertProfile: (profile) => dispatch(insertProfile(profile))
});

export default connect(mapStateToProps, mapDispatchToProps)(FHIMProfileEditorForm);

