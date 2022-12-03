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
    },

    errorModal : function(errorMessage, statusCode) {
        const modal = document.querySelector("#error-modal");
        const label = modal.querySelector("#error-message");

        label.textContent = `${statusCode} ERROR: ${errorMessage}`;
        modal.style.display = "block";
    },
};

export { modals };