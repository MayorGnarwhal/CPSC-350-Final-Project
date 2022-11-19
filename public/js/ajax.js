const serverUrl = "http://cpsc.roanoke.edu:3003/";
var fileCache = {};

async function tryCacheOrFetch(path, options, parseFuncKey) {
    if (fileCache[path]) {
        return fileCache[path];
    }

    const response = await ajax.fetch(path, options);
    const body = await response[parseFuncKey]();
    fileCache[path] = body;
    return body;
}

var ajax = {
    fetch : async function(url, options) {
        const response = await fetch(url, options);
        return response;
    },

    fetchAsText : async function(path, options = null) {
        return await tryCacheOrFetch(path, options, "text");
    },

    fetchAsJson : async function(path, options = null) {
        return await tryCacheOrFetch(path, options, "json");
    },

    fetchPage : async function(pageName) {
        const url = serverUrl + "fetch_page";
        const request = {
            user_id: -1,
            page: pageName,
        };
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
        };

        return await this.fetchAsText(url, options);
    },

    fetchHtmlAndInsert : async function(path, container) {
        container.innerHTML = await this.fetchAsText(path);
    },

    fetchHtmlAndAppend : async function(path, container, overrideChildType) {
        const child = document.createElement(overrideChildType || "div");
        await this.fetchHtmlAndInsert(path, child);
        container.appendChild(child);

        return child;
    },
}

export { ajax };