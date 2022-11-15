import { ajax } from "../ajax";

var partials = {
    queryAllPartials : function() {
        return document.querySelectorAll("[data-toggle=partial]");
    },

    // uses data-target to pull partialPath
    populatePartial : async function(container) {
        const partialPath = `partials/${container.getAttribute("data-target")}.html`;
        await ajax.fetchHtmlAndInsert(partialPath, container);
    },

    populatePartialByPath : async function(container, partialPath) {
        await ajax.fetchHtmlAndInsert(partialPath, container);
    },

    populateAllPartials : async function() {
        const containers = this.queryAllPartials();
        containers.forEach(container => {
            this.populatePartial(container);
        });
    },
}

export { partials };