const network = require('./network.service');
const usersModel = require('../models/users.model');

class App {
    constructor() {
        this.config = {};
    }

    async init() {
        await this.loadData();
        await this.loadConfigData();
    }

    async loadConfigData() {
        // can be loaded from an external source so it won't be hard coded
        this.config.authTokenSecret = 'Shhh...';
    }

    // loading the main data from the test api
    async loadData() {
        let page1 = await network.request('https://reqres.in/api/users?page=1'); 
        for (let userData of page1.fields.data) {
            await usersModel.insert(this.mapTestUserToAppUser(userData));
        }

        let page2 = await network.request('https://reqres.in/api/users?page=2'); 
        for (let userData of page2.fields.data) await usersModel.insert(this.mapTestUserToAppUser(userData));

        await usersModel.insert({
            email: 'eve.holt@reqres.in',
            password: 'cityslicka',
            firstName: 'admin',
            lastName: 'admin'
        });
    }

    mapTestUserToAppUser(testUser) {
        return {
            id: testUser.id,
            firstName: testUser.first_name,
            lastName: testUser.last_name,
            email: testUser.email,
            avatar: testUser.avatar
        }
    }
}

const app = new App();
module.exports = app;