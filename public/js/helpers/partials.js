var partials = {
    queryAllPartials : function() {
        return document.querySelectorAll("[data-toggle=partial]");
    },

    // uses data-target to pull partialPath
    populatePartial : async function(container, ajax) {
        const partialPath = `../partials/${container.getAttribute("data-target")}.html`;
        await ajax.fetchHtmlAndInsert(partialPath, container);
    },

    populateAllPartials : async function(ajax) {
        const containers = partials.queryAllPartials();
        containers.forEach(container => {
            partials.populatePartial(container, ajax);
        });
    }
}

export { partials };