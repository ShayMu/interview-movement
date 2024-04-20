const BaseModel = require('./base.model');
const network = require('../services/network.service');

const schema = {
    id: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    avatar: String,
    token: String,
};

class UsersModel extends BaseModel {
    constructor() {
        super('users', schema, 'id');
    }

    async verifyUserPassword(username, password) {
        const userRecord = await this.findOne({email: username});
        if (!userRecord) return null;
        let res = await network.request('https://reqres.in/api/login', 'POST', {email: username, password});
        if (!res.fields || !res.fields.token) return null;

        await this.updateOne({email: username}, {password, token: res.fields.token});
        return res.fields.token;
    }

    async getUserByToken(token) {
        return await this.findOne({token});
    }
}

const usersModel = new UsersModel();
module.exports = usersModel;