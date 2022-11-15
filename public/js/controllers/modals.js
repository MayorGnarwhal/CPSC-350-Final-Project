var modals = {
    queryModalButtons : function() {
        return document.querySelectorAll("[data-toggle=modal]");
    },

    handleModalButton : function(button) {
        const modal = document.querySelector(button.getAttribute("data-target"));
        const dismiss = modal.querySelector(".close");

        button.addEventListener("click", function() {
            modal.style.display = "block";
        });

        if (dismiss) {
            dismiss.addEventListener("click", function() {
                modal.style.display = "none";
            });
        }
    },

    handleAllModalButtons : function() {
        this.queryModalButtons().forEach(button => {
            this.handleModalButton(button);
        });
    },
}

export { modals };