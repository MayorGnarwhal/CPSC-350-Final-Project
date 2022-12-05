import { ajax } from "../ajax";

var typeahead = {
    fetchTypeaheads : function() {
        return document.querySelectorAll(".typeahead");
    },

    handleTypeahead : async function(container) {
        const partialPath = `partials/typeahead/typeahead.html`;
        await ajax.fetchHtmlAndInsert(partialPath, container);

        const formValue = container.querySelector("input[type='hidden']");
        const input = container.querySelector("input[type='text']");
        const buffer = container.querySelector(".typeahead-buffer");
        const filter = container.getAttribute("data-filter");

        formValue.setAttribute("name", container.getAttribute("data-input"));

        function onTypeaheadSelect(user) {
            input.value = user.first_name + " " + user.last_name;
            formValue.value = user.user_id;
            buffer.setAttribute("disabled", true);
            buffer.innerHTML = "";
        }

        input.addEventListener("input", async function() {
            const request = {
                search_term: input.value,
                filter: filter,
            };
            buffer.removeAttribute("disabled");
            const users = await ajax.sendRequestAndHandle("POST", "typeahead_results", request);
            typeahead.populateTypeaheadResults(buffer, users, onTypeaheadSelect);
        });
    },

    handleAllTypeaheads : function() {
        this.fetchTypeaheads().forEach(container => {
            this.handleTypeahead(container);
        });
    },

    populateTypeaheadResults : async function(buffer, users, onTypeaheadSelect) {
        buffer.innerHTML = "";
        if (users && !buffer.getAttribute("disabled")) {
            for (const [key, user] of Object.entries(users)) {
                const partialPath = "partials/typeahead/result.html";
                const result = await ajax.fetchHtmlAndAppend(partialPath, buffer);
    
                const link = result.querySelector(".typeahead-result");
                link.innerHTML = user.first_name + " " + user.last_name;

                link.addEventListener("click", () => onTypeaheadSelect(user));
            }
        }
    },
};

export { typeahead };