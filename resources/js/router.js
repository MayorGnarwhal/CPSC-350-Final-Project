const { routes } = require("../routes");
const { error_handler } = require("../helpers/error_handler");

const validateTypes = ["string", "number", "boolean"];

var router = {
    validateArguments : function(body, args) {
        var success = true;
        for (const [arg, validate] of Object.entries(args)) {
            const requirements = validate.split("|");
            
            // verify if argument is required
            const isRequired = requirements.find(elem => elem === "required") !== undefined;
            if (isRequired && body[arg] === undefined) {
                success = false;
            }

            // verify argument types
            const types = requirements.filter(elem => validateTypes.includes(elem));
            types.forEach(type => {
                if (typeof body[arg] !== type) {
                    success = false;
                }
            });
        }
        
        return success;
    },

    routeRequest : async function(method, url, body, response) {
        const routing = routes[method][url];
        if (routing === undefined) {
            error_handler.errorResponse(response, `Invalid ${method} request '${url}'`, 404);
            return;
        }

        if (!routing.validateRequest(body)) {
            error_handler.errorResponse(response, `Invalid permissions for request`, 403);
            return;
        }

        if (!this.validateArguments(body, routing.args)) {
            error_handler.errorResponse(response, `Invalid arguments for request`, 400);
            return;
        }

        routing.routeRequest(body, response);
    },
}

module.exports = { router };