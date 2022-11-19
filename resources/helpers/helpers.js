var helpers = {
    setupCORS:function(response) {
        response.setHeader("Access-Control-Allow-Origin", "http://cpsc.roanoke.edu");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization"); 
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}

module.exports = { helpers };