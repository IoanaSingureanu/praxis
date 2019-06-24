import React from 'react';

export class Renderers {
    constructor(enterEdit, exitEdit, editFieldName) {
        this.enterEdit = enterEdit;
        this.exitEdit = exitEdit;
        this.editFieldName = editFieldName;

        this.cellRender = this.cellRender.bind(this);
        this.rowRender = this.rowRender.bind(this);
    }

    cellRender(tdElement, cellProps) {
        const dataItem = cellProps.dataItem;
        const field = cellProps.field;
        const additionalProps = (cellProps.dataItem[this.editFieldName] && (cellProps.field === cellProps.dataItem[this.editFieldName])) ?
            {
                ref: (td) => {
                    const input = td && td.querySelector('input');
                    if (!input || (input === document.activeElement)) { return; }
                    if (input.type === 'checkbox') {
                        input.focus();
                    } else {
                        input.select();
                    }
                }
            } : {
                onClick: () => { this.enterEdit(dataItem, field); }
            };
        return React.cloneElement(tdElement, { ...tdElement.props, ...additionalProps }, tdElement.props.children);
    }

    rowRender(trElement, dataItem) {
        const trProps = {
            ...trElement.props,
            onMouseDown: () => {
                this.preventExit = true;
                clearTimeout(this.preventExitTimeout);
                this.preventExitTimeout = setTimeout(() => { this.preventExit = undefined; });
            },
            onBlur: () => {
                clearTimeout(this.blurTimeout);
                if (!this.preventExit) {
                    this.blurTimeout = setTimeout(() => { this.exitEdit(); });
                }
            },
            onFocus: () => { clearTimeout(this.blurTimeout); }
        };
        return React.cloneElement(trElement, { ...trProps }, trElement.props.children);
    }
}



export class ColumnNameHeader extends React.Component {
    render() {
        return (
            <a className="k-link" onClick={this.props.onClick}>
                 <span style={{ color: "black", fontsize: "20px" }}>{this.props.title}</span>               
                {this.props.children}
            </a>
        );
    }
}

export class TableNameHeader extends React.Component {
    render() {
        return (
            <a className="k-link" onClick={this.props.onClick}>
                <span style={{ color: "black",  fontsize: "30px", fontweight: "bold",
                               fontfamily: "'Open Sans', 'Helvetica', 'sans-serif'"                
                }}>{this.props.title}</span>
                {this.props.children}
            </a>
        );
    }
}

