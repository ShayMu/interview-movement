import React from 'react';
import helperUtils from '../../utils/helpers.util';
import './Dialog.comp.css';

class Dialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            content: '',
        }

        helperUtils.bindMethods(this);
    }

    show(content) {
        if (this.state.visible) return;
        this.setState({visible: true, content: content});
    }

    hide() {
        this.setState({visible: false, content: ''});
    }

    render() {
        return <div className='dialogContainer' style={{display: this.state.visible?'flex':'none'}}>
            <div className='dialogOverlay'></div>
            <div className='dialogBox'>
                <div className='dialogContent'>
                    {this.state.content}
                </div>
                <div className='dialogFooter'>
                    <button onClick={this.hide}>OK</button>
                </div>
            </div>
            <div style={{flex: 1}}></div>
        </div>;
    }
}

export default Dialog;