import { ajax } from "../ajax";

const inputTypes = ["input", "select", "textarea"];

var forms = {
    packFormInputs : function(form) {
        const inputs = Array.from(form.elements).filter(tag => {
            return inputTypes.includes(tag.tagName.toLowerCase());
        });
        
        var packed = {};
        inputs.forEach(input => {
            packed[input.name] = input.value;
        });

        return packed;
    },

    queryAllForms : function() {
        return document.querySelectorAll("form");
    },

    handleFormSubmit : function(form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();

            const action = form.getAttribute("action").replace("/", "");
            var packed = forms.packFormInputs(form);
            
            const response = await ajax.sendRequest("POST", action, packed);
            ajax.handleServerResponse(response);
        });
    },

    handleAllForms : function() {
        this.queryAllForms().forEach(form => {
            this.handleFormSubmit(form);

            this.handleMasterCheckbox(form);
        });
    },

    handleMasterCheckbox : function(form) {
        const containers = form.querySelectorAll(".master-checkbox");
        
        containers.forEach(container => {
            const master = container.querySelector("div.master > input");
            const options = container.querySelectorAll("div:not(.master) > input");
            
            master.addEventListener("click", function(event) {
                options.forEach(option => {
                    option.checked = master.checked;
                });
            });

            options.forEach(option => {
                option.addEventListener("click", function(event) {
                    if (!option.checked) {
                        master.checked = false;
                    }
                });
            });
        });
    },
};

export { forms };