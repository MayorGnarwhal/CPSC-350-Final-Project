var helpers = {
    setupCORS:function(response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    }
}

module.exports = { helpers };