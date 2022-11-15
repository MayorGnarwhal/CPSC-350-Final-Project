var file_cache = {};

var ajax = {
    fetchFile : async function(path) {
        if (file_cache[path]) {
            return file_cache[path];
        }

        const response = await fetch(path);
        file_cache[path] = response;

        return response;
    },

    fetchFileAsText : async function(path) {
        const response = await ajax.fetchFile(path);
        return await response.text();
    },

    fetchJsonAndParse : async function(path) {
        const response = await ajax.fetchFile(path);
        return await response.json();
    },

    fetchHtmlAndInsert : async function(path, container) {
        container.innerHTML = await ajax.fetchFileAsText(path);
    },

    fetchHtmlAndAppend : async function(path, container, overrideChildType) {
        const child = document.createElement(overrideChildType || "div");
        await ajax.fetchHtmlAndInsert(path, child);
        container.appendChild(child);

        return child;
    }
}

export { ajax };