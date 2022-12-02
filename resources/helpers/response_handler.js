var response_handler = {
    errorResponse : function(response, errorMessage, statusCode = 404) {
        console.log("Error:", errorMessage);
        response.statusCode = statusCode;
        response.write(`{"error": "${errorMessage}"}`);
        response.end();
    },

    endResponse : function(response, messageBody, statusCode = 200) {
        response.statusCode = statusCode;
        response.write(messageBody);
        response.end();
    },
};

module.exports = { response_handler };