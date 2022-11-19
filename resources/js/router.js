const { routes } = require("../routes");
const { error_handler } = require("./error_handler");

var router = {
    routeRequest : async function(method, url, body, response) {
        const router = routes[method][url];
        if (router === undefined) {
            error_handler.errorResponse(response, `Invalid ${method} request '${url}'`, 404);
            return;
        }

        if (!router.validateRequest()) {
            error_handler.errorResponse(response, `Invalid permissions for request`, 403);
            return;
        }

        router.routeRequest(body, response);
    },
}

module.exports = { router };