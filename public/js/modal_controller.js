const buttons = document.querySelectorAll("[data-toggle=modal]");

buttons.forEach(button => {
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
});