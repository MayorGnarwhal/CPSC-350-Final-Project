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
        console.log(button, modal);

        if (modal) {
            button.addEventListener("click", function(event) {
                event.preventDefault();

                modal.style.display = "block";
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