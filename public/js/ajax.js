var fileCache = {};

async function tryCacheOrFetch(path, parseFuncKey) {
    if (fileCache[path]) {
        // console.log("pull from cache: " + path);
        return fileCache[path];
    }

    const response = await ajax.fetchFile(path);
    const body = await response[parseFuncKey]();
    fileCache[path] = body;
    return body;
}

var ajax = {
    fetch : async function(url, options) {
        const response = await fetch(url, options);
        return response;
    },

    fetchFile : async function(path) {
        const response = await this.fetch(path, null);
        return response;
    },

    fetchFileAsText : async function(path) {
        return await tryCacheOrFetch(path, "text");
    },

    fetchJsonAndParse : async function(path) {
        return await tryCacheOrFetch(path, "json");
    },

    fetchHtmlAndInsert : async function(path, container) {
        container.innerHTML = await this.fetchFileAsText(path);
    },

    fetchHtmlAndAppend : async function(path, container, overrideChildType) {
        const child = document.createElement(overrideChildType || "div");
        await this.fetchHtmlAndInsert(path, child);
        container.appendChild(child);

        return child;
    },
}

export { ajax };