// -- Services
const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const crypto = require("crypto");

// -- Variables from other .js files
const { root_path, routes } = require("../routes");
const { helpers } = require("../js/helpers");

// -- Variables
const port = 3003;
const server = http.createServer();

const mimetypes = {
    ".html": "text/html",
    ".json": "application/json",
    ".ico":  "image/x-icon",
    ".jpg":  "image/x-icon",
    ".png":  "image/png",
    ".gif":  "image/gif",
    ".css":  "text/css",
    ".js":   "text/javascript",
};

// -- Route server requests
server.on("request", function(request, response) {
    console.log("Method: " + request.method);
    console.log("URL " + request.url);

    helpers.setupCORS(response);
    
    if (request.method == "GET") {
        const routePath = routes.GET[request.url];
        if (routePath) {
            response.writeHead(200, {"Content-Type": "text/html"});
            fs.createReadStream(routePath).pipe(response);
        }
        else {
            fs.readFile(root_path + request.url, function(error, data) {
                if (error) {
                    response.writeHead(404, "File not found");
                    response.end();
                    console.log("File not found");
                }
                else {
                    var dotoffset = request.url.lastIndexOf(".");
                    var mimetype = dotoffset == -1 ? "text/plain" : mimetypes[request.url.substring(dotoffset)];

                    response.setHeader("Content-type" , mimetype);
                    response.end(data);
                }
            });
        }
    }
});

server.listen(port, function() {
    console.log("Server starting on port " + port);
});