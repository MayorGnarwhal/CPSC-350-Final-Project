var modals = {
    queryModalButtons : function() {
        return document.querySelectorAll("[data-toggle=modal]");
    },

    queryModals : function() {
        return document.querySelectorAll(".modal");
    },

    handleModalButton : function(button) {
        const modal = document.querySelector(button.getAttribute("data-target"));

        button.addEventListener("click", function() {
            modal.style.display = "block";
        });
    },

    handleAllModals : function() {
        // handle modals
        console.log(this.queryModals());
        this.queryModals().forEach(modal => {
            const dismiss = modal.querySelector(".close");

            if (dismiss) {
                dismiss.addEventListener("click", function() {
                    modal.style.display = "none";
                });
            }
        });

        // handle modal toggle buttons
        this.queryModalButtons().forEach(button => {
            this.handleModalButton(button);
        });
    },

    errorModal : function(errorMessage) {
        const modal = document.querySelector("#error-modal");
        const label = modal.querySelector("#error-message");

        label.textContent = "Error: " + errorMessage;
        modal.style.display = "block";
    },
}

export { modals };