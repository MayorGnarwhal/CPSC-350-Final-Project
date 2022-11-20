const { routes } = require("../routes");
const { error_handler } = require("../helpers/error_handler");

const validateTypes = ["string", "number", "boolean"];

var router = {
    validateArguments : function(body, args) {
        for (const [arg, validate] of Object.entries(args)) {
            const requirements = validate.split("|");
            
            // verify if argument is required
            const isRequired = requirements.find(elem => elem === "required") !== undefined;
            if (isRequired && body[arg] === undefined) {
                return [false, `Request missing required argument, ${arg}`];
            }

            // verify argument types
            const types = requirements.filter(elem => validateTypes.includes(elem));
            const violation = types.find(type => type !== typeof body[arg]);
            if (violation !== undefined) {
                return [false, `Request argument '${arg}' of invalid type (${typeof body[arg]}). Should be ${violation}`];
            }
        }
        
        return [true, undefined];
    },

    routeRequest : async function(method, url, body, response) {
        const routing = routes[method] && routes[method][url];
        // verify route exists
        if (routing === undefined) {
            error_handler.errorResponse(response, `Invalid ${method} request '${url}'`, 404);
            return;
        }

        // verify user has permissions to request
        const [permsSuccess, permsError] = routing.validateRequest(body);
        if (!permsSuccess) {
            error_handler.errorResponse(response, `Invalid permissions for request: ${permsError}`, 403);
            return;
        }

        // verify proper arguments were passed with body
        const [argsSuccess, argsError] = this.validateArguments(body, routing.args);
        if (!argsSuccess) {
            error_handler.errorResponse(response, argsError, 400);
            return;
        }

        routing.routeRequest(body, response);
    },
};

module.exports = { router };