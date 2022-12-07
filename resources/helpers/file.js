const fs = require("fs");
const crypto = require("crypto");

var file = {
    store : async function(dataURL, path, extension) {
        const promise = new Promise((resolve, reject) => {
            // https://stackoverflow.com/a/43488020
            const data = dataURL.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(data, "base64");
            const storePath = path + "/" + crypto.randomUUID() + "." + extension;

            console.log("i am here");
    
            fs.writeFile(storePath, buffer, function(error, results) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else {
                    resolve(storePath);
                }
            });
        });

        try {
            return await promise;
        }
        catch(error) {
            console.log("failed to store image");
            return null;
        }
    },

    fetch : async function(filePath) {
        try {
            return fs.readFileSync(filePath);
        }
        catch {
            return fs.readFileSync("public/storage/images/default-profile-picture.jpg");
        }
    }
};

module.exports = { file };