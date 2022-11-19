const fs = require("fs");

async function fetchPage(body, response) {
    const pageName = body.page;
    const pagePath = `public/views/${body.page}.html`;

    fs.readFile(pagePath, function(error, data) {
        if (error) {
            response.statusCode = 404;
            response.write(`"error": Failed to fetch '${pagePath}'`);
        }
        else {
            response.statusCode = 201;
            response.write(data);
        }

        response.end();
    });
}

module.exports = { fetchPage };