
import React from 'react';
import { GridCell } from '@progress/kendo-react-grid';
import selectFHIMProfileList from '../selectors/fhimProfileList';

export default function CellWithEditing(edit, remove) {
    return class extends GridCell {
        render() {
           
            return (
                <td>
                    <button
                        className="k-button k-grid-edit-command"

                        onClick={() => { edit(this.props.dataItem); }}>

                        Edit
                    </button>
                    &nbsp;
                  
                </td>
            );
        }
    };
}

const mapStateToProps = (state) => {
  return {
    fhimProfileList: selectFHIMProfileList(state.fhimProfileList, state.filters)
  };
};