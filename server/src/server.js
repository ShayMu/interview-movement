const express = require('express');
const server = express();
const routes = require('./routes/main.route');
const app = require('./services/app.service');
const errorMiddlewares = require('./middlewares/errors.middleware');
const { userAuth, buildCorsAuth } = require('./middlewares/auth.middleware');

global._ = require('lodash');

async function init() {
    const port = 8081;
    definePreRouteMiddlewares();
    defineRoutes();
    definePostRouteMiddlewares();
    await app.init();

    // Start the server
    server.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

function definePreRouteMiddlewares() {
    let corsMiddlewareFunc = buildCorsAuth();
    server.options('*', corsMiddlewareFunc)
    server.use('*', corsMiddlewareFunc);

    const bodyParser = require('body-parser');
    server.use(bodyParser.json());

    server.use(userAuth)
}

function definePostRouteMiddlewares() {
    server.use(errorMiddlewares.errorHandler);
}

// Get defined routes
function getRoutes(router) {
    const routes = [];
  
    router.stack.forEach((middleware) => {
      if (middleware.route) { // middleware with a route property is a registered route
        routes.push({
          path: middleware.route.path,
          methods: middleware.route.methods
        });
      } else if (middleware.name === 'router') { // middleware that represents a sub-router
        const nestedRoutes = getRoutes(middleware.handle);
        routes.push(...nestedRoutes);
      }
    });
  
    return routes;
}

function defineRoutes() {
    server.use('/', routes);

    server.all('*', (req, res) => {
        return res.status(404).send(getRoutes(routes));
    });
}


init();
