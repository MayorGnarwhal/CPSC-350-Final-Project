import { pages } from "./controllers/pages";
import { modals } from "./controllers/modals";
import { session } from "./session";

var serverUrl = "http://cpsc.roanoke.edu:3003/";
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
        return await fetch(url, options);
    },

    fetchAsText : async function(path, options = null) {
        return await tryCacheOrFetch(path, options, "text");
    },

    fetchAsJson : async function(path, options = null) {
        return await tryCacheOrFetch(path, options, "json");
    },

    sendRequest : async function(method, route, request = {}) {
        request.user_id = session.user_id; 

        const url = serverUrl + route;
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
        };

        return await ajax.fetch(url, options);
    },

    fetchPage : async function(pageName) {
        const request = {
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
            modals.errorModal(body.error);
            return;
        }

        // response has page (redirect to page)
        if (body.page) {
            pages.loadPage(body.page);
        }

        if (body.set_user_id) {
            session.user_id = body.set_user_id;
        }
    },

    sendRequestAndHandle : async function(...args) {
        const response = await this.sendRequest(...args);
        return await this.handleServerResponse(response);
    },
};

export { ajax };