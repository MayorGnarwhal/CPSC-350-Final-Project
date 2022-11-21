import { pages } from "./controllers/pages";

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

    sendRequest : async function(method, route, request) {
        const url = serverUrl + route;
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
        };

        const response = await ajax.fetch(url, options);
        return response;
    },

    fetchPage : async function(pageName) {
        const request = {
            user_id: -1,
            page: pageName,
        };

        const response = await this.sendRequest("POST", "fetch_page", request);
        return await response.text();
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

    handleServerResponse : async function(response) {
        const body = await response.json();

        // response failed
        if (body.error) {
            // add some display that response failed
            console.log("Response errored");
        }
        // response has page (redirect to page)
        else if (body.page) {
            pages.loadPage(body.page);
        }
    },
};

export { ajax };