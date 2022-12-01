const { routes } = require("../config/routes");
const { response_handler } = require("../helpers/response_handler");

const validateTypes = ["string", "number", "boolean", "object"];

var router = {
    validateArguments : function(body, args) {
        for (const [arg, validate] of Object.entries(args)) {
            const requirements = validate.split("|");
            
            // verify if argument is required
            const isRequired = requirements.find(elem => elem === "required") !== undefined;
            if (isRequired && (body[arg] === undefined || body[arg] === null)) {
                return [false, `Request missing required argument, ${arg}`];
            }

            // verify argument types
            const types = requirements.filter(elem => validateTypes.includes(elem));
            const violation = types.find(type => !(type === typeof body[arg] || type === typeof parseFloat(body[arg])));
            if (violation !== undefined) {
                return [false, `Request argument '${arg}' of invalid type (${typeof body[arg]}). Should be ${violation}`];
            }

            // validate regex string patterns
            var regexString = requirements.find(elem => elem.search("regex:") !== -1);
            if (regexString !== undefined && !body[arg].match(regexString.substring(6))) {
                return [false, `${arg} field failed regex validation`];
            }
        }
        
        return [true, undefined];
    },

    routeRequest : async function(method, url, body, response) {
        const routing = routes[method] && routes[method][url];
        // verify route exists
        if (routing === undefined) {
            response_handler.errorResponse(response, `Invalid ${method} request '${url}'`, 404);
            return;
        }

        // verify user has permissions to request
        const [permsSuccess, permsError] = await routing.validateRequest(body);
        if (!permsSuccess) {
            response_handler.errorResponse(response, `Invalid permissions for request: ${permsError}`, 403);
            return;
        }

        // verify proper arguments were passed with body
        const [argsSuccess, argsError] = this.validateArguments(body, routing.args);
        if (!argsSuccess) {
            response_handler.errorResponse(response, argsError, 400);
            return;
        }

        routing.routeRequest(body, response);
    },
};

module.exports = { router };