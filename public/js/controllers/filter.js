import { ajax } from "../ajax";

var filter = {
    fetchFilters : function() {
        return document.querySelectorAll(".result-filter");
    },

    handleFilter : async function(container) {
        console.log(container);
        const partialPath = "partials/result_filter.html";
        await ajax.fetchHtmlAndInsert(partialPath, container);

        container.querySelector("label").textContent = container.getAttribute("data-label") || "Filter Results";

        const targetList = document.querySelector(container.getAttribute("data-target"));
        const input = container.querySelector("input");
        if (targetList) {
            input.addEventListener("input", function() {
                const searchTerms = input.value.toLowerCase().trim().split(" ");
                for (const [key, child] of Object.entries(targetList.children)) {
                    const filter = child.getAttribute("data-filter").toLowerCase();
                    if (filter) {
                        const matches = searchTerms.filter(term => filter.search(term) !== -1);
                        if (matches.length === searchTerms.length) {
                            child.classList.remove("hidden");
                        }
                        else {
                            child.classList.add("hidden");
                        }
                    }
                }
            });
        }
    },

    handleAllFilters : function() {
        this.fetchFilters().forEach(container => {
            this.handleFilter(container);
        });
    }
};

export { filter };