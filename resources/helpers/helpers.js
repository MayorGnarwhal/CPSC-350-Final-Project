var helpers = {
    setupCORS : function(response) {
        response.setHeader("Access-Control-Allow-Origin", "http://cpsc.roanoke.edu");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization"); 
        response.setHeader("Access-Control-Allow-Credentials", "true");
    },

    formatDatetime : function(date = new Date()) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
}

module.exports = { helpers };