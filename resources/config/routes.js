/*
    Define routes (method and URI) and handle routing functions and middleware

    Each middleware is a psuedo-class with two attributes:
        args (key, value pair object)
        func (routing func)
    middleware.args is used to easily validate that all required args exist
*/

// Middleware
const { force_login } = require("../middleware/force_login");
const { force_admin } = require("../middleware/force_admin");

// Routing functions
const { fetchPosts } = require("../controllers/fetch_posts");
const { fetchPage } = require("../controllers/fetch_page");
const { logout } = require("../controllers/logout");
const { signup } = require("../controllers/signup");
const { login } = require("../controllers/login");
const { storePost } = require("../controllers/store_post");
const { fetchUser, updateUser } = require("../controllers/user_methods");
const { init } = require("../controllers/initial_request");


// Routing class
class Routing {
    constructor(routing, middleware = null) {
        this.routing = routing;
        this.middleware = middleware;
        this.args = routing.args || {};
    }

    async validateRequest(...args) {
        if (this.middleware === null) { // no middleware, allow request
            return [true, undefined];
        }
        return await this.middleware(...args); // return middleware success
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
        "/init": new Routing(init, null),
        "/login": new Routing(login, null),
        "/logout": new Routing(logout, force_login),
        "/signup": new Routing(signup, null),
        "/fetch_page": new Routing(fetchPage, null),
        "/fetch_posts": new Routing(fetchPosts, force_login),
        "/store_post": new Routing(storePost, force_login),
        "/fetch_user": new Routing(fetchUser, force_login),
    },
    "PUT": {
        "/update_user": new Routing(updateUser, force_login),
    },
    "DELETE": {

    },
};

module.exports = { routes };