import React from 'react';
import helperUtils from '../../utils/helpers.util';
import './Table.comp.css';
import _ from 'lodash';

class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: []
        }

        this.headerSpacing = '';

        for (let hData of this.props.headers) {
            this.headerSpacing += (hData.width || '1fr') + ' ';
        }

        helperUtils.bindMethods(this);
    }

    setRows(rows) {
        this.setState({rows});
    }

    appendRow(rowData) {
        let rows = [...this.state.rows, rowData];
        this.setState({rows});
    }

    updateRow(query, newRowData) {
        let rows = [...this.state.rows];
        for (let rIdx in rows) {
            let rData = rows[rIdx];
            let isValid = true;
            for (let qField in query) {
                if (query[qField] != rData[qField]) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                rows[rIdx] = newRowData;
                break;
            }
        }

        this.setState({rows});
    }

    onRowClick(data) {
        if (!this.props.onRowClick) return;
        if (data) this.props.onRowClick(data);
    }

    renderHeaders() {
        return <div className='TableHeaderRow' style={{gridTemplateColumns: this.headerSpacing}}>
            {this.props.headers.map(h=><div key={h.title} className="TableHeaderCell">{h.title}</div>)}
        </div>
    }

    renderSingleRow(data, idx) {
        let cells = [];
        for (let hData of this.props.headers) {
            let cellValue = _.get(data, hData.path, '');
            if (this.props.onCellRender) cellValue = this.props.onCellRender(hData.path, data, idx);
            cells.push(<div key={idx+'-'+hData.title} className='TableCell'>{cellValue}</div>)
        }
        return <div className='TableRow' key={idx} onClick={()=>this.onRowClick(data)} style={{gridTemplateColumns: this.headerSpacing}}>
            {cells}
        </div>
    }

    renderRows() {
        let rows = [];
        for (let rIdx in this.state.rows) rows.push(this.renderSingleRow(this.state.rows[rIdx], rIdx));
        return <React.Fragment>{rows}</React.Fragment>
    }

    render() {
        return <div className='TableContainer'>
            {this.renderHeaders()}
            {this.renderRows()}
        </div>;
    }
}

export default Table;