var error_handler = {
    errorResponse : function(response, errorMessage, statusCode = 404) {
        console.log("error response", errorMessage);
        response.statusCode = statusCode;
        response.write(`"error": "${errorMessage}"`);
        response.end();
    }
};

module.exports = { error_handler };