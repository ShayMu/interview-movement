import React from 'react';
import helperUtils from '../../utils/helpers.util';
import api from '../../controllers/api.controller';
import _ from 'lodash';
import './User.panel.css';

class UserPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            user: null
        }

        helperUtils.bindMethods(this);
    }

    show(userData) {
        if (this.state.visible) return;
        this.setState({visible: true, user: _.cloneDeep(userData)});
    }

    hide() {
        this.setState({visible: false, user: null});
    }

    save() {
        console.log(this.state.user);
        let isNewUser = this.state.user.id === undefined;
        if (isNewUser) {
            api.request('user/createUser', 'POST', this.state.user).then(res=>{
                if (res.fields) {
                    this.hide();
                    if (this.props.onUserUpdate) this.props.onUserUpdate(res.fields.user, isNewUser);
                }
            });
        }
        else {
            api.request('user/updateUser/'+this.state.user.id, 'PUT', this.state.user).then(res=>{
                if (res.fields) {
                    this.hide();
                    if (this.props.onUserUpdate) this.props.onUserUpdate(res.fields.user, isNewUser);
                }
            });
        }

    }

    updateUserField(path, value) {
        let user = {...this.state.user};
        _.set(user, path, value);
        this.setState({user});
    }

    renderField(title, path, type='text') {
        return <div className='formField'>
            <div className='formFieldTitle'>{title}</div>
            <input type={type} onChange={e=>this.updateUserField(path, e.target.value)} value={_.get(this.state, ['user', path], '')}/>
        </div>
    }

    render() {
        let title = this.state.user && this.state.user.id?this.state.user.email:'New User';
        return <div className='userPanelContainer' style={{display: this.state.visible?'flex':'none'}}>
            <div className='userPanelOverlay'></div>
            <div className='userPanelBox'>
                <div className='userPanelHeadline'>
                    {title}
                </div>
                <div className='userPanelContent'>
                    {this.renderField('Email', 'email')}
                    {this.renderField('First Name', 'firstName')}
                    {this.renderField('Last Name', 'lastName')}
                </div>
                <div className='userPanelFooter'>
                    <button onClick={this.hide}>Close</button>
                    <button className='primaryButton' onClick={this.save}>Save</button>
                </div>
            </div>
            <div style={{flex: 1}}></div>
        </div>;
    }
}

export default UserPanel;