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
            console.log(response);
        });
    },

    handleAllForms : function() {
        this.queryAllForms().forEach(form => {
            this.handleFormSubmit(form);
        });
    },
};

export { forms };