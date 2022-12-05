import { addMutationObserver } from "../observer";

var modals = {
    queryModalButtons : function() {
        return document.querySelectorAll("[data-toggle=modal]");
    },

    queryModals : function() {
        return document.querySelectorAll(".modal");
    },

    handleModalButton : function(button) {
        const modal = document.querySelector(button.getAttribute("data-target"));

        if (modal) {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                modal.style.display = "block";

                const dataset = Object.assign({}, button.dataset);
                for (const [dataKey, dataValue] of Object.entries(dataset)) {
                    // https://stackoverflow.com/a/47836484
                    const elementID = "#" + dataKey.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                    const element = modal.querySelector(elementID);
                    if (element) {
                        const [type, value] = dataValue.split(":");
                        if (type === "attr") {
                            element.setAttribute(type, value);
                        }
                        else {
                            element[type] = value; // for value and textContent
                        }
                    }
                }
            });
        }
    },

    handleAllModals : function() {
        this.queryModals().forEach(modal => {
            const dismiss = modal.querySelector(".close");

            if (dismiss) {
                dismiss.addEventListener("click", function() {
                    modal.style.display = "none";
                });
            }
        });

        this.queryModalButtons().forEach(button => {
            this.handleModalButton(button);
        });

        addMutationObserver(undefined, "button[data-toggle='modal']", this.handleModalButton);
    },

    errorModal : function(errorMessage, statusCode) {
        const modal = document.querySelector("#error-modal");
        const label = modal.querySelector("#error-message");

        label.textContent = `${statusCode} ERROR: ${errorMessage}`;
        modal.style.display = "block";
    },
};

export { modals };