var response_handler = {
    errorResponse : function(response, errorMessage, statusCode = 404) {
        console.log("Error:", errorMessage);
        response.statusCode = statusCode;
        response.write(`{"error": "${errorMessage}"}`);
        response.end();
    },
};

module.exports = { response_handler };