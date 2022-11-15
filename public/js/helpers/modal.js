var modal = {
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
        modal.queryModalButtons().forEach(button => {
            modal.handleModalButton(button);
        });
    },
}

export { modal };