import { ajax } from "../../ajax";

async function fetchUser(args) {
    const request = {
        target_user_id: args.user_id,
    };
    const response = await ajax.sendRequest("POST", "fetch_user", request);
    var user = await response.json();

    return user;
}

async function profileController(args) {
    var user = await fetchUser(args);

    // populate page info
    document.querySelector("#user-name").textContent = user.first_name + " " + user.last_name;
    document.querySelector("#user-username").textContent = "@" + user.username;
    document.querySelector("#user-email").textContent = user.email;
    document.querySelector("#profile-picture").src = user.profile_picture.slice(7);
    document.querySelector("#friend-count").textContent = "13 friends";
    document.querySelector("#hidden_user_input").value = user.user_id;


    // handle update modal
    const editModal = document.querySelector("#edit-profile-modal");
    const modalFirstName = editModal.querySelector("#first-name");
    const modalLastName = editModal.querySelector("#last-name");

    var modalObserver = new MutationObserver(function(mutations) {
        mutations.forEach(async function(mutationRecord) {
            if (mutationRecord.target.style.display === "block") {
                modalFirstName.value = user.first_name;
                modalLastName.value = user.last_name;
            }
        });
    });
    modalObserver.observe(editModal, {
        attributes: true,
        attributeFilter: ["style"]
    });
}

export { profileController };
