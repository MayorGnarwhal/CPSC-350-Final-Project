function profileController() {
    const editModal = document.querySelector("#edit-profile-modal");
    const modalFirstName = editModal.querySelector("#first-name");
    const modalLastName = editModal.querySelector("#last-name");
    const modalProfilePicture = editModal.querySelector("#profile-picture");

    var modalObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            if (mutationRecord.target.style.display === "block") {
                // fetch player info
                modalFirstName.value = "John";
                modalLastName.value = "Doe";
            }
        });
    });
    modalObserver.observe(editModal, {
        attributes: true,
        attributeFilter: ["style"]
    });
}

export { profileController };
