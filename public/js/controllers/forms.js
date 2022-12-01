import { ajax } from "../ajax";

const inputTypes = ["input", "select", "textarea"];

var forms = {
    readFileInput : async function(input) {
        const promise = new Promise((resolve, reject) => {
            const file = input.files[0];
            var reader = new FileReader();
            
            if (file) {
                reader.onloadend = function() {
                    resolve(reader.result);
                }
                reader.readAsDataURL(file);
            }
            else {
                reject();
            }
        });
        
        try {
            return await promise;
        }
        catch {
            console.log("Failed to read file");
            return "";
        }
    },

    packFormInputs : async function(form) {
        const inputs = Array.from(form.elements).filter(tag => {
            return inputTypes.includes(tag.tagName.toLowerCase());
        });
        
        var packed = {};
        await Promise.all(inputs.map(async input => {
            if (input.getAttribute("type") === "file") { // pack file inputs
                const encoded = await this.readFileInput(input);
                console.log(encoded);
                packed[input.name] = encoded;
            }
            else if (input.name.substr(-2) === "[]") { // pack array inputs
                if (input.checked) {
                    const name = input.name.slice(0, -2);
                    if (!packed[name]) {
                        packed[name] = [];
                    }
                    packed[name].push(input.id);
                }
            }
            else { // pack standard inputs
                packed[input.name] = input.value;
            }
        }));

        return packed;
    },

    queryAllForms : function() {
        return document.querySelectorAll("form");
    },

    handleFormSubmit : function(form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();

            const action = form.getAttribute("action").replace("/", "");
            var packed = await forms.packFormInputs(form);

            console.log(packed);

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