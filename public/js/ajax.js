var file_cache = {};

var ajax = {
    fetch : async function(url, options) {
        const response = await fetch(url, options);
        return response;
    },

    fetchFile : async function(path) {
        // if (file_cache[path]) {
        //     return file_cache[path];
        // }

        const response = await this.fetch(path, null);
        // file_cache[path] = response;

        return response;
    },

    fetchFileAsText : async function(path) {
        const response = await this.fetchFile(path);
        return await response.text();
    },

    fetchJsonAndParse : async function(path) {
        const response = await this.fetchFile(path);
        return await response.json();
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