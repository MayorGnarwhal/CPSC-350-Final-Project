import { ajax } from "../../ajax";

const userFramePartialPath = "partials/user_preview.html";

async function adminController(args) {
    const response = await ajax.sendRequest("POST", "fetch_users");
    const users = await response.json();

    const usersList = document.querySelector("#users-list");

    users.forEach(async user => {
        if (user.account_status === "ADMIN") {
            return;
        }

        const partialName = "admin_" + user.account_status.toLowerCase();
        const optionPartialPath = `partials/options/${partialName}.html`;

        const fullName = user.first_name + " " + user.last_name;

        const frame = await ajax.fetchHtmlAndAppend(userFramePartialPath, usersList);
        const optionsFrame = frame.querySelector(".preview-options");
        await ajax.fetchHtmlAndInsert(optionPartialPath, optionsFrame);
        optionsFrame.querySelector("input[type='hidden']").value = user.user_id;

        frame.querySelector("#name").textContent = fullName;
        frame.querySelector("#username").textContent = "@" + user.username;
        frame.querySelector("#profile-picture").src = await ajax.fetchImage(user.profile_picture);

        frame.setAttribute("data-filter", fullName.toLowerCase());
        frame.setAttribute("data-status", user.account_status);
    });

    const filtersFrame = document.querySelector("#filters");
    function showUsersOfStatus(statusues) {
        for (const [index, userFrame] of Object.entries(usersList.children)) {
            if (statusues.find(x => x === userFrame.getAttribute("data-status"))) {
                userFrame.classList.remove("hidden");
            }
            else {
                userFrame.classList.add("hidden");
            }
        }
    }

    document.querySelector("#filter-pending").addEventListener("input", function() {
        showUsersOfStatus(["PENDING"]);
    });
    document.querySelector("#filter-active").addEventListener("input", function() {
        showUsersOfStatus(["ACTIVE"]);
    });
    document.querySelector("#filter-rejected").addEventListener("input", function() {
        showUsersOfStatus(["REJECTED"]);
    });
    document.querySelector("#filter-disabled").addEventListener("input", function() {
        showUsersOfStatus(["DISABLED"]);
    });
    document.querySelector("#filter-all").addEventListener("input", function() {
        showUsersOfStatus(["PENDING", "ACTIVE", "REJECTED", "DISABLED"]);
    });
}

export { adminController };