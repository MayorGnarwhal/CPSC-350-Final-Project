var logout = {
    args: {
    
    },

    // no extra validation as force_login handles error cases
    func : async function(body, response) {
        // close out session
        response.statusCode = 201;
        response.write(`{"page": "login"}`);
        response.end();
    }
};

module.exports = { logout };