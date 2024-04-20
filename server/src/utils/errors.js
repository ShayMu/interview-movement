module.exports = {
    routeErrors: {
        GENERAL: {errorType: 'route', msg: 'Internal Server Error'},
        INVALID_DATA: {errorType: 'route', msg: 'Invalid Data'},
        NOT_EXISTS: {errorType: 'route', msg: 'Not Exists'},
        auth: {
            MISSING_TOKEN: {errorType: 'invalidToken', msg: 'Invalid auth token'},
            INVALID_CRED: {errorType: 'invalidCred', msg: 'Invalid credentials'},
        },
        users: {
            MISSING_PARAMS: {errorType: 'route', msg: 'Missing user data'}
        }
    },
    dbErrors: {
        INVALID_INSERT_DATA: {errorType: 'db', msg: 'Invalid record data'},
        UPDATE_RECORD_NOT_FOUND: {errorType: 'db', msg: 'No such record to update'},
    }
};