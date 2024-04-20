import React from 'react';
import api from '../../controllers/api.controller';
import Table from '../../components/Table/Table.comp';
import helperUtils from '../../utils/helpers.util';
import UserPanel from '../../panels/UserPanel/User.panel';
import _ from 'lodash';
import './Users.page.css';

class UsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageNumber: 1,
            totalPages: 1,
            totalUsers: 0
        }

        this.headers = [
            {title: ' ', path: 'deleteBtn', width: '50px'},
            {title: 'Email', path: 'email', width: '400px'},
            {title: 'First Name', path: 'firstName', width: '200px'},
            {title: 'Last Name', path: 'lastName'}
        ];

        helperUtils.bindMethods(this);
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList() {
        api.request('user/getUsers/'+this.state.pageNumber, 'GET').then(res=>{
            if (res.fields && res.fields.list) {
                if (this.usersTable) this.usersTable.setRows(res.fields.list);
                this.setState({pageNumber: Number(res.fields.page), totalPages: Number(res.fields.totalPages), totalUsers: Number(res.fields.totalUsers)});
            }
        });
    }

    onDeleteUserClick(data) {
        api.request('user/deleteUser/'+data.id, 'DELETE').then(res=>{
            if (!res.err) this.refreshList();
        });
    }

    onUserCellRender(path, data, idx) {
        let cellValue = '';
        switch (path) {
            case 'deleteBtn': {
                cellValue = <button className='speedButton UserActionDeleteButton' onClick={e=>{e.stopPropagation(); this.onDeleteUserClick(data)}} title='Delete user'>&#10007;</button>;
            } break;
            default: cellValue = _.get(data, path, '');
        }

        return cellValue;
    }

    onNewUserClick() {
        if (this.userPanel) this.userPanel.show({});
    }

    onUserRowClick(rowData={}) {
        if (this.userPanel) this.userPanel.show(rowData);
    }

    onUserUpdate(userData, isNewUser) {
        if (!this.usersTable) return;
        if (isNewUser) this.usersTable.appendRow(userData);
        else this.usersTable.updateRow({id: userData.id}, userData);
    }

    changePage(pageNumber) {
        if (pageNumber > this.state.totalPages) pageNumber = this.state.totalPages;
        if (pageNumber < 1) pageNumber = 1;
        this.setState({pageNumber}, this.refreshList);
    }

    renderPagingAction() {
        return <div className='UsersPagePagingAction'>
            <div onClick={()=>this.changePage(this.state.pageNumber-1)}>&#10094;</div>
            Page {this.state.pageNumber} of {this.state.totalPages}
            <div onClick={()=>this.changePage(this.state.pageNumber+1)}>&#10095;</div>
        </div>;
    }

    render() {
        return <div className='UsersPage'>
            <div className='pageHeadline'>Users</div>
            <div className='UsersPageActionRow'>
                <button className='primaryButton actionButton' onClick={this.onNewUserClick}>+ Add User</button>
                <div style={{flex: 1}}></div>
                {this.renderPagingAction()}
            </div>
            <div className='UsersTableContainer'>
                <Table ref={r=>this.usersTable = r} headers={this.headers} onRowClick={this.onUserRowClick} onCellRender={this.onUserCellRender}/>
            </div>
            <UserPanel ref={r=>this.userPanel=r} onUserUpdate={this.onUserUpdate}/>
        </div>;
    }
}

export default UsersPage;