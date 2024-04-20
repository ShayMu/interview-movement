const errors = require('../utils/errors');

module.exports = {
    asyncHandler: func => (req, res, next) => {
        return Promise
            .resolve(func(req, res, next))
            .catch(next);
    },

    errorHandler: (err, req, res, next) => {
        let msg = errors.routeErrors.GENERAL;
        if (err.errorType) msg = err;
        else console.log(err);

        res.status(500).json({ok: 0, ...msg});
    }
};