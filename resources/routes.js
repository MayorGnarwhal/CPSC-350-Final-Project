const { fetchPage } = require("./controllers/fetch_page");

class Routing {
    constructor(routingFunc, middleware = null) {
        this.routingFunc = routingFunc;
        this.middleware = middleware;
    }

    validateRequest() {
        if (!this.middleware) { // no middleware, allow request
            return true;
        }
        return this.middleware(); // return middleware success
    }

    async routeRequest(...args) {
        return await this.routingFunc(...args);
    }
}

const routes = {
    "GET": {

    },
    "POST": {
        "/fetch_page": new Routing(fetchPage, null),
    },
}

module.exports = { routes };