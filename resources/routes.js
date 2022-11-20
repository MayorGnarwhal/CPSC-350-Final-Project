/*
    Define routes (method and URI) and handle routing functions and middleware

    Each middleware is a psuedo-class with two attributes:
        args (key, value pair object)
        func (routing func)
    middleware.args is used to easily validate that all required args exist
*/

// Middleware
const { force_login } = require("./middleware/force_login");
const { force_admin } = require("./middleware/force_admin");

// Routing functions
const { fetchPage } = require("./controllers/fetch_page");

// Routing class
class Routing {
    constructor(routing, middleware = null) {
        this.routing = routing;
        this.middleware = middleware;
        this.args = routing.args || {};
    }

    validateRequest(...args) {
        if (this.middleware === null) { // no middleware, allow request
            return true;
        }
        return this.middleware(...args); // return middleware success
    }

    routeRequest(...args) {
        this.routing.func(...args);
    }
}

// Defined routes
const routes = {
    "GET": {

    },
    "POST": {
        "/fetch_page": new Routing(fetchPage, force_login),
    },
    "DELETE": {

    },
};

module.exports = { routes };