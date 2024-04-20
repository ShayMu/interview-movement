const usersModel = require('../models/users.model');
const routeErrors = require('../utils/errors').routeErrors;


class UsersController {
    constructor() {
    }

    async getUsers(req, res, next) {
        let page = req.params.page;
        if (!page) page = 1;

        let pageLimit = 10;

        let options = {
            skip: pageLimit * (page-1),
            limit: pageLimit
        };

        let userList = await usersModel.find({}, options);
        let totalUsers = await usersModel.count();
        res.json({ok:1, list: userList, page, totalUsers, totalPages: Math.ceil(totalUsers/pageLimit) || 1});
    }

    async getUser(req, res, next) {
        let id = req.params.id;
        if (!id) return next(routeErrors.INVALID_DATA);

        let result = await usersModel.findOne({id});
        if (!result) return next(routeErrors.NOT_EXISTS);

        res.json({ok:1, user: result});
    }

    async createUser(req, res, next) {
        let userData = req.body;
        if (!userData) return next(routeErrors.INVALID_DATA);
        if (!userData.email || !userData.firstName || !userData.lastName) return next(routeErrors.users.MISSING_PARAMS);
        delete userData.id;

        let result = await usersModel.insert(userData);
        if (result.errorType) return next(result);
        res.json({ok:1, user: result});
    }

    async updateUser(req, res, next) {
        let userData = req.body;
        let userId = req.params.id;
        if (!userData || !userId) return next(routeErrors.INVALID_DATA);
        if (!userData.email || !userData.firstName || !userData.lastName) return next(routeErrors.users.MISSING_PARAMS);
        userData.id = userId;

        let result = await usersModel.updateOne({id: userId}, userData);
        if (result.errorType) return next(result);
        res.json({ok:1, user: result});
    }

    async deleteUser(req, res, next) {
        let userId = req.params.id;
        if (!userId) return next(routeErrors.INVALID_DATA);
        
        let result = await usersModel.deleteOne({id: userId});
        if (result && result.errorType) return next(result);
        res.json({ok:1});
    }
}

const usersController = new UsersController();
module.exports = usersController;